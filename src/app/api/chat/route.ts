import { streamText, tool, stepCountIs, convertToModelMessages, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { buildAgentSystemPrompt } from "@/lib/rag/heritage-context";
import { heritageData, getHeritageById } from "@/data/heritage";
import { getYeongjuWeather } from "@/lib/api/weather-api";
import { searchTourSpots } from "@/lib/api/tour-api";
import { searchHeritage as fetchCHA } from "@/lib/api/heritage-api";
import { searchYeongjuRelics } from "@/lib/api/museum-api";
import { searchEncykorea } from "@/lib/api/encykorea-api";


export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
            "영주시 문화유산을 검색합니다. 부석사, 소수서원, 선비촌, 무섬마을, 소백산 등의 정보를 조회할 수 있습니다. 사용자가 특정 문화유산에 대해 질문하거나, 영주 관광지를 알고 싶을 때 사용합니다.",
          inputSchema: z.object({
            query: z.string().describe("검색할 문화유산 이름 또는 키워드 (예: 부석사, 유네스코, 서원)"),
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

            if (results.length === 0) {
              return { found: false, message: "해당 조건에 맞는 문화유산을 찾지 못했습니다.", data: [], externalSources: [] };
            }

            // 문화재청 API 실호출: 결과 1건이고 한국어 문화재명이 포함된 경우 보강
            let chaEnrichment: { ccbaKdcdNm?: string; ccbaCpno?: string } = {};
            const hasKoreanHeritageName = /[가-힣]{2,}/.test(query);
            if (results.length === 1 && hasKoreanHeritageName) {
              try {
                const chaResults = await fetchCHA({ ccbaCtcd: "37", ccbaMnm1: query });
                if (chaResults && chaResults.length > 0) {
                  chaEnrichment = {
                    ccbaKdcdNm: chaResults[0].ccbaKdcd,
                    ccbaCpno: chaResults[0].ccbaCpno,
                  };
                }
              } catch {
                // API 실패 시 정적 데이터만 반환 (안전 폴백)
              }
            }

            return {
              found: true,
              count: results.length,
              externalSources: ["문화재청 국가문화유산포털"],
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
                ...(results.length === 1 ? chaEnrichment : {}),
              })),
            };
          },
        }),

        getWeather: tool({
          description:
            "영주시의 현재 날씨 정보를 조회합니다. 기온, 하늘 상태, 강수, 습도, 바람, 방문 추천 메시지를 반환합니다. 사용자가 날씨를 묻거나 관광 코스를 추천받을 때 먼저 호출합니다.",
          inputSchema: z.object({
            reason: z.string().optional().describe("날씨를 조회하는 이유 (예: 여행 계획, 코스 추천)"),
          }),
          execute: async () => {
            const weather = await getYeongjuWeather();
            if (!weather) {
              return {
                available: false,
                message: "현재 기상청 API에서 날씨 정보를 가져올 수 없습니다.",
                fallback: "영주시는 내륙 산간 지역으로 일교차가 크니 겉옷을 준비하시는 것이 좋습니다.",
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
            "영주시 주변 관광지, 맛집, 숙박, 축제 정보를 한국관광공사 Tour API에서 검색합니다. 사용자가 맛집, 숙소, 행사 등을 물을 때 사용합니다.",
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
              areaCode: "35",
              numOfRows: 10,
            });

            if (!results || results.length === 0) {
              return {
                found: false,
                message: `"${keyword || type || "영주"}" 관련 관광 정보를 찾지 못했습니다.`,
                suggestion: "영주시 문화유산(부석사, 소수서원 등)에 대해 대신 안내해 드릴까요?",
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
            "날씨, 시간, 선호도를 종합하여 영주시 맞춤 관광 코스를 생성합니다. 사용자가 하루 코스, 반나절 코스, 여행 일정 등을 요청할 때 사용합니다. 이 도구를 호출하기 전에 getWeather와 searchHeritage를 먼저 호출하여 정보를 수집하세요.",
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
            const courses: Record<string, { name: string; spots: string[]; tip: string }[]> = {
              반나절: [
                { name: "선비문화 핵심 코스", spots: ["소수서원", "선비촌", "소수서원 주변 카페"], tip: "소수서원과 선비촌은 도보 5분 거리입니다." },
                { name: "부석사 집중 코스", spots: ["부석사", "부석사 앞 먹거리촌"], tip: "석양 시간에 맞춰 방문하면 무량수전 석양을 감상할 수 있습니다." },
              ],
              하루: [
                { name: "영주 핵심 역사 코스", spots: ["소수서원", "선비촌", "점심(영주한우)", "부석사", "무섬마을(석양)"], tip: "오전에 서원·선비촌, 오후에 부석사, 석양에 무섬마을 추천" },
                { name: "자연+문화 융합 코스", spots: ["소백산 죽령옛길", "점심(풍기인삼갈비)", "소수서원", "선비촌"], tip: "오전에 죽령옛길 트레킹(2시간), 오후에 문화유산 탐방" },
              ],
              "1박2일": [
                { name: "영주 완전정복 코스", spots: ["Day1: 소수서원 → 선비촌 → 점심(한우) → 부석사 → 석양감상", "Day2: 소백산 죽령옛길 → 점심(인삼갈비) → 무섬마을 → 영주시장"], tip: "선비촌 한옥 숙박을 추천합니다." },
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
            "영주시 문화유산 관련 퀴즈를 동적으로 생성합니다. 사용자가 퀴즈, 문제, 테스트를 요청하거나 문화유산에 대해 재미있게 배우고 싶어할 때 사용합니다.",
          inputSchema: z.object({
            heritageId: z.string().optional().describe("특정 문화유산 ID (buseoksa, sosuseowon, sunbichon, museom, sobaeksan)"),
            difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("난이도"),
          }),
          execute: async ({ heritageId, difficulty }) => {
            const target = heritageId ? getHeritageById(heritageId) : null;
            const diff = difficulty || "medium";

            const quizPool = [
              { heritage: "buseoksa", difficulty: "easy" as const, question: "부석사를 창건한 승려는 누구일까요?", options: ["원효대사", "의상대사", "지눌", "혜초"], correctIndex: 1, explanation: "부석사는 신라 문무왕 16년(676년) 의상대사가 창건한 화엄종의 근본도량입니다." },
              { heritage: "buseoksa", difficulty: "medium" as const, question: "부석사 무량수전의 건축 특징인 '배흘림기둥'은 어떤 형태인가요?", options: ["기둥 상단이 넓은 형태", "기둥 중간이 볼록한 형태", "기둥이 나선형인 형태", "기둥이 사각형인 형태"], correctIndex: 1, explanation: "배흘림기둥은 기둥 중간이 볼록한 엔타시스(entasis) 기법으로, 그리스 파르테논 신전에서도 발견됩니다." },
              { heritage: "buseoksa", difficulty: "hard" as const, question: "추사 김정희가 부석사에 남긴 글씨는 무엇인가요?", options: ["무량수전", "천하제일장락", "부석사", "화엄도량"], correctIndex: 1, explanation: "'천하제일장락(天下第一長樂)' — 천하에서 가장 즐거운 곳이라는 뜻입니다." },
              { heritage: "sosuseowon", difficulty: "easy" as const, question: "소수서원은 한국 최초의 무엇인가요?", options: ["사찰", "서원", "향교", "성균관"], correctIndex: 1, explanation: "소수서원은 1543년 풍기군수 주세붕이 설립한 한국 최초의 서원입니다." },
              { heritage: "sosuseowon", difficulty: "medium" as const, question: "'소수(紹修)'라는 사액을 조정에 건의한 인물은?", options: ["주세붕", "퇴계 이황", "율곡 이이", "안향"], correctIndex: 1, explanation: "퇴계 이황이 풍기군수 시절 조정에 건의하여 '소수서원'이라는 사액을 받았습니다." },
              { heritage: "museom", difficulty: "easy" as const, question: "무섬마을의 '무섬(水島)'은 어떤 뜻인가요?", options: ["산 위의 마을", "물 위의 섬", "숲 속의 마을", "바람의 섬"], correctIndex: 1, explanation: "삼면이 내성천으로 둘러싸여 '물 위의 섬'이라는 뜻의 무섬(水島)이라 불립니다." },
              { heritage: "sobaeksan", difficulty: "medium" as const, question: "소백산의 주봉인 비로봉의 해발 높이는?", options: ["1,239m", "1,339m", "1,439m", "1,539m"], correctIndex: 2, explanation: "소백산 비로봉은 해발 1,439m로, 매년 5~6월 철쭉 군락이 장관입니다." },
            ];

            let filtered = quizPool;
            if (target) filtered = quizPool.filter((q) => q.heritage === target.id);
            if (diff !== "medium") {
              const diffFiltered = filtered.filter((q) => q.difficulty === diff);
              if (diffFiltered.length > 0) filtered = diffFiltered;
            }

            const selected = filtered.length > 0
              ? filtered[Math.floor(Math.random() * filtered.length)]
              : quizPool[Math.floor(Math.random() * quizPool.length)];

            const heritage = getHeritageById(selected.heritage);

            return {
              quiz: {
                question: selected.question,
                options: selected.options,
                correctIndex: selected.correctIndex,
                difficulty: selected.difficulty,
                explanation: selected.explanation,
                relatedHeritage: heritage?.name || "영주 문화유산",
              },
              tip: "정답을 맞추면 영주 문화유산에 대한 이해가 더 깊어집니다!",
            };
          },
        }),

        searchMuseum: tool({
          description:
            "국립중앙박물관 e-Museum에서 영주 관련 유물·소장품을 검색합니다. 부석사 불상, 안향 초상, 의상대사 진영 등 영주와 연관된 박물관 소장 유물 정보를 조회할 때 사용합니다.",
          inputSchema: z.object({
            keyword: z
              .string()
              .optional()
              .describe("검색 키워드 (예: 부석사, 안향, 불상, 초상화)"),
          }),
          execute: async ({ keyword }) => {
            const result = await searchYeongjuRelics(keyword);
            if (!result.found) {
              return {
                found: false,
                message: "해당 키워드와 관련된 영주 유물을 찾지 못했습니다.",
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
            "한국학중앙연구원 한국민족문화대백과사전에서 영주 관련 인물·역사·풍속·유래를 검색합니다. 퇴계 이황, 안향, 의상대사, 선묘 전설, 선비정신, 죽령 옛길 등 역사·문화적 배경 정보가 필요할 때 사용합니다.",
          inputSchema: z.object({
            keyword: z.string().describe("검색 키워드 (예: 퇴계, 안향, 선비정신, 죽령, 의상대사)"),
          }),
          execute: async ({ keyword }) => {
            const result = searchEncykorea(keyword);
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
