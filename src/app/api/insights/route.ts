/**
 * GET /api/insights?city=<도시ID>&limit=<최대 질문수>
 *
 * chat_questions 테이블을 조회해 Claude로 주제 군집·미충족 수요·정책 요약을 생성.
 * B2G 프레이밍: 분산된 5종 국가 공공데이터 통합·해석 → 관광 수요신호.
 *
 * 데이터 0건 / DB 미연결 / Claude 오류 → 빈 결과 graceful 반환.
 */
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase";
import { getActiveCity } from "@/config/city";

export const runtime = "nodejs";

const InsightsSchema = z.object({
  themes: z.array(
    z.object({
      name: z.string().describe("주제 이름 (예: 교통·주차, 식당·맛집)"),
      count: z.number().describe("해당 주제 추정 질문 수 (정수)"),
      example: z.string().describe("대표 예시 질문 1개"),
    })
  ),
  unmetNeeds: z
    .array(z.string())
    .describe("관광객이 자주 묻지만 충분히 답되지 않는 미충족 수요 3~5개"),
  summary: z.string().describe("관광정책 담당자용 2~3문장 수요신호 요약"),
});

const EMPTY = (configured: boolean) => ({
  ok: true,
  configured,
  count: 0,
  themes: [] as z.infer<typeof InsightsSchema>["themes"],
  unmetNeeds: [] as string[],
  summary: "",
  samples: [] as string[],
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityId = (searchParams.get("city") ?? getActiveCity().id).trim();
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "200"), 10), 500);
  const cityName = getActiveCity().name;

  const admin = getAdminClient();
  if (!admin) return Response.json(EMPTY(false));

  try {
    // ── chat_questions 조회 ───────────────────────────────────────────────────
    const { data, error } = await admin
      .from("chat_questions")
      .select("question")
      .eq("city_id", cityId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!data || data.length === 0) {
      return Response.json(EMPTY(true));
    }

    const questions = (data as { question: string }[]).map((r) => r.question);
    const samples = questions.slice(0, 5);

    // ── Claude 분석 (generateObject + zod) ───────────────────────────────────
    const questionList = questions
      .slice(0, 100)
      .map((q, i) => `${i + 1}. ${q}`)
      .join("\n");

    const { object } = await generateObject({
      model: anthropic("claude-haiku-4-5-20251001"),
      schema: InsightsSchema,
      prompt: [
        `다음은 ${cityName} 관광 AI 도슨트에게 실제 관광객·학습자가 남긴 질문들입니다(총 ${questions.length}개, 익명 세션 기준).`,
        "",
        "질문 목록:",
        questionList,
        "",
        "분석 지침:",
        `- themes: 질문을 주제별로 군집화하세요. 주제 예시: 교통·주차, 식당·맛집, 접근성, 일정·코스 추천, 역사·인물, 날씨·계절, 숙박, 체험·행사 등. 각 주제의 추정 질문 수와 대표 예시 질문 1개를 포함하세요.`,
        `- unmetNeeds: 관광객이 반복해서 묻지만 현재 ${cityName} 관광 안내에서 충분히 답변되지 않는 정보 수요 3~5가지를 구체적으로 서술하세요.`,
        `- summary: ${cityName}시 관광정책 담당자에게 전달하는 2~3문장 요약. "문화재청·한국관광공사·기상청·국립중앙박물관·한국민족문화대백과 등 분산된 5종 국가 공공데이터를 통합·해석한 관광 수요신호" 관점으로 작성하세요.`,
      ].join("\n"),
    });

    return Response.json({
      ok: true,
      configured: true,
      count: questions.length,
      themes: object.themes,
      unmetNeeds: object.unmetNeeds,
      summary: object.summary,
      samples,
    });
  } catch (err) {
    console.error("[insights] error (non-fatal):", err);
    return Response.json(EMPTY(true));
  }
}
