import { streamText, tool, stepCountIs, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { buildAgentSystemPrompt } from "@/lib/rag/heritage-context";
import { heritageData, quizData, getHeritageById, findCuratedCourse, findCanonicalAnswer } from "@/data/active";
import { getYeongjuWeather } from "@/lib/api/weather-api";
import { searchTourSpots } from "@/lib/api/tour-api";
import { searchYeongjuRelics } from "@/lib/api/museum-api";
import { searchEncykoreaLive } from "@/lib/api/encykorea-api";
import { searchOfficialHeritage } from "@/lib/api/cha-api";
import { getActiveCity } from "@/config/city";
import { getAdminClient } from "@/lib/supabase";

// 빌드 타임 상수 — NEXT_PUBLIC_CITY_ID 환경변수로 도시 선택
const _activeCity = getActiveCity();

// PII 스크러버 — 한글 리터럴 없이 숫자·영문·기호 패턴만 사용 (SWC 한글 regex 버그 회피)
function scrubPii(text: string): string {
  return text
    .replace(/\d{2,3}[-\s]?\d{3,4}[-\s]?\d{4}/g, "[PHONE]")
    .replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, "[EMAIL]")
    .replace(/\d{6}-[1-4]\d{6}/g, "[SSN]");
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const {
      messages,
      noLog = false,
      sessionId = "",
      classCode = "",
    }: {
      messages: UIMessage[];
      noLog?: boolean;
      sessionId?: string;
      classCode?: string;
    } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- Canonical Q&A cache: instant response for 5 demo-critical questions ---
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const lastUserText = lastUserMessage
      ? lastUserMessage.parts
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join(" ")
      : "";

    // ── 질문 로깅 (fire-and-forget, PII 스크럽) ──────────────────────────────
    // 스트리밍을 블로킹하지 않음. 실패해도 챗 동작 무관.
    if (!noLog && lastUserText.trim()) {
      const admin = getAdminClient();
      if (admin) {
        // 스트리밍 시작 전에 insert를 보장한다. Vercel 서버리스는 응답 종료 후
        // await 없는 백그라운드 프로미스를 종료시켜 로깅을 유실시키므로(특히 클라이언트
        // 조기 종료 시), 여기서 await 하되 2초 타임아웃 가드로 챗 응답을 막지 않는다.
        try {
          const insert = admin.from("chat_questions").insert({
            question: scrubPii(lastUserText).slice(0, 500),
            session_id: sessionId,
            class_code: classCode,
            city_id: _activeCity.id,
          });
          await Promise.race([
            Promise.resolve(insert),
            new Promise((resolve) => setTimeout(resolve, 2000)),
          ]);
        } catch {
          // non-fatal — 로깅 실패가 챗 동작에 영향 없음
        }
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    const canonical = findCanonicalAnswer(lastUserText);
    if (canonical) {
      const citationText =
        "\n\n**출처:** " +
        canonical.citations.map((c) => (c.url ? `[${c.name}](${c.url})` : c.name)).join(" · ");
      const fullAnswer = canonical.answer + citationText;
      const chunkSize = 80;
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          writer.write({ type: "text-start", id: "0" });
          for (let i = 0; i < fullAnswer.length; i += chunkSize) {
            writer.write({
              type: "text-delta",
              id: "0",
              delta: fullAnswer.slice(i, i + chunkSize),
            });
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          writer.write({ type: "text-end", id: "0" });
        },
      });
      return createUIMessageStreamResponse({ stream });
    }
    // --- End canonical cache ---

    // --- API key guard: fail fast before any Anthropic SDK call ---
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY가 설정되지 않았습니다. Vercel 환경변수를 확인하세요." }),
        { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const systemPrompt = buildAgentSystemPrompt();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: systemPrompt,
      messages: modelMessages,
      maxOutputTokens: 2000,
      temperature: 0.7,
      stopWhen: stepCountIs(5),
      tools: {
        searchHeritage: tool({
          description:
            `${_activeCity.name}시 문화유산을 검색합니다. ${heritageData.slice(0, 4).map((h) => h.name).join(", ")} 등의 정보를 조회할 수 있습니다. 사용자가 특정 문화유산에 대해 질문하거나, ${_activeCity.name} 관광지를 알고 싶을 때 사용합니다.`,
          inputSchema: z.object({
            query: z.string().describe(`검색할 문화유산 이름 또는 키워드 (예: ${heritageData[0]?.name ?? "유산"}, 유네스코, 서원)`),
            category: z
              .enum(["유네스코", "국보", "보물", "사적", "명승", "천연기념물", "민속문화재", "전체"])
              .optional()
              .describe("문화유산 카테고리 필터"),
          }),
          execute: async ({ query, category }) => {
            const tokens = query
              .toLowerCase()
              .split(/[\s,?.!]+/)
              .filter((t: string) => t.length > 1);

            let results = [...heritageData];

            if (category && category !== "전체") {
              results = results.filter((h) => h.category === category);
            }

            if (tokens.length > 0) {
              const scored = results.map((h) => {
                const searchable = [
                  h.name, h.nameEn, h.description, h.history ?? "",
                  h.architecture ?? "", h.hiddenStory ?? "",
                  h.category, h.location.address, ...(h.tags ?? []),
                ].join(" ").toLowerCase();

                const score = tokens.reduce((acc: number, token: string) => {
                  return acc + (searchable.match(new RegExp(token, "g")) ?? []).length;
                }, 0);

                return { heritage: h, score };
              });

              results = scored
                .filter((s) => s.score > 0)
                .sort((a, b) => b.score - a.score)
                .map((s) => s.heritage);
            }

            // 문화재청 국가문화유산포털 실시간 조회(무인증) — 공식 지정문화유산
            const official = await searchOfficialHeritage(query);
            const heritageSource = official.apiUsed
              ? "문화재청 국가문화유산포털 (실시간 조회)"
              : "문화재청 국가문화유산포털";

            if (results.length === 0) {
              return {
                found: official.count > 0,
                message:
                  official.count > 0
                    ? "큐레이션 자료에는 없지만 문화재청 실시간 조회 결과가 있습니다."
                    : "해당 조건에 맞는 문화유산을 찾지 못했습니다.",
                data: [],
                officialDesignations: official.data,
                officialCount: official.count,
                externalSources: [heritageSource],
              };
            }

            return {
              found: true,
              count: results.length,
              externalSources: [heritageSource],
              officialDesignations: official.data,
              officialCount: official.count,
              data: results.map((h) => ({
                id: h.id,
                name: h.name,
                nameEn: h.nameEn,
                category: h.category,
                description: h.description,
                history: h.history,
                architecture: h.architecture,
                hiddenStory: h.hiddenStory,
                address: h.location.address,
                hours: h.visitInfo.hours,
                fee: h.visitInfo.fee,
                closedDays: h.visitInfo.closedDays,
                tags: h.tags,
              })),
            };
          },
        }),

        getWeather: tool({
          description:
            `${_activeCity.name}시의 현재 날씨 정보를 조회합니다. 기온, 하늘 상태, 강수, 습도, 바람, 방문 추천 메시지를 반환합니다. 사용자가 날씨를 묻거나 관광 코스를 추천받을 때 먼저 호출합니다.`,
          inputSchema: z.object({
            reason: z.string().optional().describe("날씨를 조회하는 이유 (예: 여행 계획, 코스 추천)"),
          }),
          execute: async () => {
            const weather = await getYeongjuWeather();
            if (!weather) {
              return {
                available: false,
                message: "현재 기상청 API에서 날씨 정보를 가져올 수 없습니다.",
                fallback: `${_activeCity.name}시는 일교차가 클 수 있으니 겉옷을 준비하시는 것이 좋습니다.`,
              };
            }
            return {
              available: true,
              temperature: weather.temperature,
              sky: weather.sky,
              precipitation: weather.precipitation,
              humidity: weather.humidity,
              windSpeed: weather.windSpeed,
              recommendation: weather.recommendation,
              source: "기상청 단기예보 API",
            };
          },
        }),

        searchTourSpots: tool({
          description:
            `${_activeCity.name}시 주변 관광지, 맛집, 숙박, 축제 정보를 한국관광공사 Tour API에서 검색합니다. 사용자가 맛집, 숙소, 행사 등을 물을 때 사용합니다.`,
          inputSchema: z.object({
            keyword: z.string().optional().describe("검색 키워드 (예: 맛집, 한우, 숙박)"),
            type: z
              .enum(["관광지", "문화시설", "축제", "숙박", "음식점"])
              .optional()
              .describe("검색 유형"),
          }),
          execute: async ({ keyword, type }) => {
            const typeMap: Record<string, string> = {
              관광지: "12",
              문화시설: "14",
              축제: "15",
              숙박: "32",
              음식점: "39",
            };

            const results = await searchTourSpots({
              keyword: keyword,
              contentTypeId: type ? typeMap[type] : undefined,
              areaCode: _activeCity.areaCode,
              numOfRows: 10,
            });

            if (!results || results.length === 0) {
              return {
                found: false,
                message: `"${keyword || type || _activeCity.name}" 관련 관광 정보를 찾지 못했습니다.`,
                suggestion: `${_activeCity.name}시 문화유산(${heritageData.slice(0, 2).map((h) => h.name).join(", ")} 등)에 대해 대신 안내해 드릴까요?`,
              };
            }

            return {
              found: true,
              count: results.length,
              source: "한국관광공사 Tour API",
              data: results.slice(0, 5).map((item: Record<string, string>) => ({
                title: item.title,
                address: item.addr1,
                image: item.firstimage || null,
                contentId: item.contentid,
                type: item.contenttypeid,
              })),
            };
          },
        }),

        planTourCourse: tool({
          description:
            `날씨, 시간, 선호도를 종합하여 ${_activeCity.name}시 맞춤 관광 코스를 생성합니다. 사용자가 하루 코스, 반나절 코스, 여행 일정 등을 요청할 때 사용합니다. 이 도구를 호출하기 전에 getWeather와 searchHeritage를 먼저 호출하여 정보를 수집하세요.`,
          inputSchema: z.object({
            duration: z
              .enum(["반나절", "하루", "1박2일"])
              .describe("관광 소요 시간"),
            preference: z
              .enum(["역사탐방", "자연힐링", "가족나들이", "선비체험", "맛집투어", "종합"])
              .optional()
              .describe("선호하는 관광 테마"),
            weather: z.string().optional().describe("현재 날씨 상황 (getWeather 결과 참고)"),
          }),
          execute: async ({ duration, preference, weather }) => {
            // Curated-first: prefer hand-picked course when duration/theme matches
            const curated = findCuratedCourse({ duration, theme: preference });
            if (curated) {
              let weatherNote = "";
              if (weather) {
                if (weather.includes("비") || weather.includes("눈"))
                  weatherNote = "비/눈 예보가 있으니 실내 명소(박물관·서원·향교) 위주로 동선을 조정하세요.";
                else if (weather.includes("맑음"))
                  weatherNote = "날씨가 좋아 야외 문화유산 탐방에 적합합니다!";
              }
              return {
                curated: true,
                source: `${_activeCity.brand.title} 큐레이션 코스`,
                duration: curated.duration,
                theme: curated.theme,
                course: {
                  id: curated.id,
                  name: curated.name,
                  description: curated.description,
                  spots: curated.spots.map((s) => ({
                    name: s.name,
                    address: s.location.address,
                    description: s.description,
                  })),
                  highlights: curated.highlights ?? [],
                  season: curated.season ?? [],
                  transport: curated.transport ?? "",
                },
                weatherNote,
                hint: "/courses 페이지에서 모든 큐레이션 코스를 확인할 수 있습니다.",
              };
            }

            // 폴백 코스: 활성 dataPack.heritage 이름을 기반으로 생성
            const top = heritageData.slice(0, 5).map((h) => h.name);
            const courses: Record<string, { name: string; spots: string[]; tip: string }[]> = {
              반나절: [
                { name: `${_activeCity.name} 핵심 코스`, spots: [top[0], top[1]].filter(Boolean), tip: "주요 명소 위주로 둘러보세요." },
                { name: `${_activeCity.name} 심층 탐방`, spots: [top[2] ?? top[0]].filter(Boolean), tip: "한 곳을 깊이 탐방해 보세요." },
              ],
              하루: [
                { name: `${_activeCity.name} 핵심 역사 코스`, spots: [...top.slice(0, 3), "점심", ...top.slice(3)].filter(Boolean), tip: "오전·오후로 나눠 탐방하세요." },
                { name: "자연+문화 융합 코스", spots: [top[4] ?? top[0], "점심", top[0], top[1]].filter(Boolean), tip: "자연과 문화를 함께 즐겨보세요." },
              ],
              "1박2일": [
                { name: `${_activeCity.name} 완전정복 코스`, spots: [`Day1: ${top.slice(0, 3).join(" → ")}`, `Day2: ${top.slice(3).join(" → ") || top[0]}`].filter(Boolean), tip: "전통 한옥 숙박을 추천합니다." },
              ],
            };

            const options = courses[duration] || courses["하루"];
            let recommended = options[0];
            if (preference === "자연힐링") {
              recommended = options.find((c) => c.name.includes("자연")) || options[0];
            }

            let weatherNote = "";
            if (weather) {
              if (weather.includes("비") || weather.includes("눈")) weatherNote = "비/눈 예보가 있으니 실내 명소 위주로 조정하세요.";
              else if (weather.includes("맑음")) weatherNote = "날씨가 좋아 야외 활동에 적합합니다!";
            }

            return {
              duration,
              preference: preference || "종합",
              recommendedCourse: recommended,
              alternativeCourses: options.filter((c) => c !== recommended),
              weatherNote,
              heritageInfo: heritageData.map((h) => ({ name: h.name, hours: h.visitInfo.hours, fee: h.visitInfo.fee })),
            };
          },
        }),

        generateQuiz: tool({
          description:
            `${_activeCity.name}시 문화유산 관련 퀴즈를 동적으로 생성합니다. 사용자가 퀴즈, 문제, 테스트를 요청하면 난이도를 되묻지 말고 즉시 이 도구를 호출하세요(난이도 미지정 시 medium 기본값으로 바로 생성). 문화유산에 대해 재미있게 배우고 싶어할 때도 사용합니다.`,
          inputSchema: z.object({
            heritageId: z.string().optional().describe(`특정 문화유산 ID (${heritageData.slice(0, 5).map((h) => h.id).join(", ")})`),
            difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("난이도"),
          }),
          execute: async ({ heritageId, difficulty }) => {
            const target = heritageId ? getHeritageById(heritageId) : null;
            const diff = difficulty || "medium";

            // 활성 dataPack의 퀴즈를 사용 (도시별로 자동 전환됨)
            let filtered = [...quizData];
            if (target) filtered = quizData.filter((q) => q.heritageId === target.id);
            if (diff !== "medium") {
              const diffFiltered = filtered.filter((q) => q.difficulty === diff);
              if (diffFiltered.length > 0) filtered = diffFiltered;
            }

            const selected = filtered.length > 0
              ? filtered[Math.floor(Math.random() * filtered.length)]
              : quizData[Math.floor(Math.random() * quizData.length)];

            if (!selected) {
              return { quiz: null, tip: "현재 퀴즈 데이터를 불러올 수 없습니다." };
            }

            const heritage = getHeritageById(selected.heritageId);

            return {
              quiz: {
                question: selected.question,
                options: selected.options,
                correctIndex: selected.correctIndex,
                difficulty: selected.difficulty,
                explanation: selected.explanation,
                relatedHeritage: heritage?.name || `${_activeCity.name} 문화유산`,
              },
              tip: `정답을 맞추면 ${_activeCity.name} 문화유산에 대한 이해가 더 깊어집니다!`,
            };
          },
        }),

        searchMuseum: tool({
          description:
            `국립중앙박물관 e-Museum에서 ${_activeCity.name} 관련 유물·소장품을 검색합니다. ${_activeCity.name}과 연관된 박물관 소장 유물 정보를 조회할 때 사용합니다.`,
          inputSchema: z.object({
            keyword: z
              .string()
              .optional()
              .describe(`검색 키워드 (예: ${heritageData[0]?.name ?? _activeCity.name}, 불상, 초상화)`),
          }),
          execute: async ({ keyword }) => {
            const result = await searchYeongjuRelics(keyword, _activeCity.dataPack.museumRelics);
            if (!result.found) {
              return {
                found: false,
                message: `해당 키워드와 관련된 ${_activeCity.name} 유물을 찾지 못했습니다.`,
                data: [],
              };
            }
            return {
              found: true,
              count: result.count,
              source: result.source,
              data: result.data.map((r) => ({
                id: r.id,
                name: r.name,
                nameEn: r.nameEn,
                category: r.category,
                period: r.period,
                material: r.material,
                description: r.description,
                location: r.location,
                relatedPlace: r.relatedPlace,
              })),
            };
          },
        }),

        searchEncyclopedia: tool({
          description:
            `한국학중앙연구원 한국민족문화대백과사전에서 ${_activeCity.name} 관련 인물·역사·풍속·유래를 검색합니다. ${_activeCity.dataPack.encyData.slice(0, 3).map((e) => e.title).join(", ")} 등 역사·문화적 배경 정보가 필요할 때 사용합니다.`,
          inputSchema: z.object({
            keyword: z.string().describe(`검색 키워드 (예: ${_activeCity.dataPack.figures.slice(0, 3).map((f) => f.name).join(", ")})`),
          }),
          execute: async ({ keyword }) => {
            const result = await searchEncykoreaLive(keyword, _activeCity.dataPack.encyData);
            if (!result.found) {
              return {
                found: false,
                message: "해당 키워드와 관련된 백과 항목을 찾지 못했습니다.",
                data: [],
              };
            }
            return {
              found: true,
              count: result.count,
              source: result.source,
              data: result.data.map((e) => ({
                id: e.id,
                title: e.title,
                category: e.category,
                era: e.era,
                summary: e.summary,
                content: e.content,
                relatedKeywords: e.relatedKeywords,
              })),
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[chat/route] error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
