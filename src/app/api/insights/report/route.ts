/**
 * POST /api/insights/report
 * body: { city?: string; base?: BaseInsights }
 *
 * /insights 1차 분석(주제 군집·미충족 수요·정책 요약)을 근거로
 * Claude Sonnet 5가 "지자체 관광정책 담당자용 심층 리포트"를 생성한다.
 *   - demandSignals: 데이터 기반 수요 신호 해석
 *   - recommendations: 우선순위·실행시계·실행단계·기대효과·KPI를 갖춘 정책 제언
 *   - quickWins / dataOpportunities / risks / closing
 *
 * base 미제공(리포트 페이지 직접 진입) 시 chat_questions를 직접 조회해 분석.
 * 데이터 0건 / DB 미연결 / Claude 오류 → 빈 결과 graceful 반환.
 */
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase";
import { getActiveCity } from "@/config/city";

export const runtime = "nodejs";
// Sonnet 5 심층 분석은 Haiku보다 오래 걸리므로 함수 실행시간 상향
export const maxDuration = 60;

const MODEL_ID = "claude-sonnet-5";

const ReportSchema = z.object({
  headline: z.string().describe("리포트 핵심 진단을 담은 한 줄 제목"),
  executiveSummary: z
    .string()
    .describe("관광정책 담당자용 종합 요약 3~4문장 (핵심 진단과 방향)"),
  demandSignals: z
    .array(
      z.object({
        signal: z.string().describe("질문 데이터에서 포착된 관광 수요 신호"),
        evidence: z.string().describe("그렇게 판단한 질문 데이터 근거"),
        interpretation: z.string().describe("정책적 의미·해석"),
      })
    )
    .describe("데이터 기반 관광 수요 신호 3~5개"),
  recommendations: z
    .array(
      z.object({
        title: z.string().describe("정책 제언 제목"),
        priority: z.string().describe("우선순위: 높음 / 중간 / 낮음 중 하나"),
        horizon: z.string().describe("실행 시계: 즉시 / 단기 / 중기 중 하나"),
        rationale: z.string().describe("이 제언이 필요한 근거"),
        actions: z.array(z.string()).describe("구체적 실행 단계 2~4개"),
        expectedEffect: z.string().describe("기대 효과 (가능하면 정성/정량)"),
        kpi: z.string().describe("성과를 측정할 핵심 지표 1개"),
      })
    )
    .describe("우선순위별 실행형 정책 제언 3~5개"),
  quickWins: z
    .array(z.string())
    .describe("예산·조직 부담이 적어 즉시 착수 가능한 저비용 조치 3~5개"),
  dataOpportunities: z
    .array(z.string())
    .describe("추가 연계·개방하면 관광 데이터 가치가 커질 공공데이터·정보 2~4개"),
  risks: z.array(z.string()).describe("데이터 해석·정책 추진 시 유의점 2~3개"),
  closing: z.string().describe("담당자에게 전하는 마무리 제언 1~2문장"),
});

type BaseInsights = {
  summary?: string;
  themes?: { name: string; count: number; example: string }[];
  unmetNeeds?: string[];
  count?: number;
  samples?: string[];
};

const EMPTY = (configured: boolean) => ({
  ok: true,
  configured,
  count: 0,
  report: null as z.infer<typeof ReportSchema> | null,
  samples: [] as string[],
  generatedWith: MODEL_ID,
});

export async function POST(req: Request) {
  const cityCfg = getActiveCity();

  let body: { city?: string; base?: BaseInsights } = {};
  try {
    body = await req.json();
  } catch {
    /* body 없음 허용 */
  }

  const cityId = (body.city ?? cityCfg.id).trim();
  const cityName = cityCfg.name;
  const base = body.base;

  const admin = getAdminClient();

  // ── 근거 질문 확보: DB 조회 우선, 실패 시 base.samples 폴백 ──
  let questions: string[] = [];
  let count = base?.count ?? 0;
  if (admin) {
    try {
      const { data, error } = await admin
        .from("chat_questions")
        .select("question")
        .eq("city_id", cityId)
        .order("created_at", { ascending: false })
        .limit(80);
      if (!error && data && data.length > 0) {
        questions = (data as { question: string }[]).map((r) => r.question);
        count = Math.max(count, questions.length);
      }
    } catch (e) {
      console.error("[insights/report] db query (non-fatal):", e);
    }
  }
  if (questions.length === 0 && base?.samples?.length) {
    questions = base.samples;
  }

  // 1차 분석도, 질문 근거도 전혀 없으면 분석 불가
  if (!base && questions.length === 0) {
    return Response.json(EMPTY(!!admin));
  }

  try {
    const baseBlock = base
      ? [
          "── 1차 분석 결과 (요약·주제 군집·미충족 수요) ──",
          base.summary ? `정책 요약: ${base.summary}` : "",
          base.themes?.length
            ? `주제 군집: ${base.themes
                .map((th) => `${th.name}(약 ${th.count}건, 예: "${th.example}")`)
                .join(" / ")}`
            : "",
          base.unmetNeeds?.length
            ? `미충족 수요: ${base.unmetNeeds
                .map((n, i) => `${i + 1}) ${n}`)
                .join("  ")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "";

    const qBlock = questions.length
      ? [
          "── 원본 질문 샘플 (익명) ──",
          questions
            .slice(0, 60)
            .map((q, i) => `${i + 1}. ${q}`)
            .join("\n"),
        ].join("\n")
      : "";

    const totalCount = count || questions.length;

    const { object } = await generateObject({
      model: anthropic(MODEL_ID),
      schema: ReportSchema,
      // 심층 리포트는 출력이 길어 기본 한도에서 JSON이 잘리면 스키마 검증 실패 → 여유 있게 상향
      maxOutputTokens: 8000,
      prompt: [
        `당신은 ${cityName}시 관광정책을 자문하는 데이터 기반 정책 애널리스트입니다.`,
        `아래는 ${cityName} 관광 AI 도슨트(공공데이터 5종 연동)에 익명으로 누적된 관광객·학습자 질문(총 ${totalCount}건 기준)과 1차 분석입니다.`,
        "이를 근거로 지자체 관광정책 담당자가 곧바로 검토·활용할 수 있는 '심층 정책 리포트'를 작성하세요.",
        "",
        baseBlock,
        "",
        qBlock,
        "",
        "작성 지침:",
        "- 모든 내용은 위 질문·1차 분석 '근거에 기반'해 도출하세요. 근거 없는 수치·허구 통계는 쓰지 말고, 추정이면 '추정'이라 밝히세요.",
        "- demandSignals: 질문에서 읽히는 관광 수요 신호를, 근거(evidence)와 정책적 해석(interpretation)과 함께.",
        "- recommendations: 우선순위(높음/중간/낮음)와 실행 시계(즉시/단기/중기)를 붙인 실행형 제언. 각 제언에 구체 실행단계(actions), 기대효과, 성과지표(kpi)를 포함.",
        `- dataOpportunities: ${cityName}시가 추가로 연계·개방하면 관광 데이터 가치가 커질 공공데이터·정보.`,
        "- risks: 데이터 해석·정책 추진 시 유의점.",
        "- 문체: 공공기관 정책보고서 톤으로 간결하고 실무적으로. 반드시 한국어로 작성.",
      ].join("\n"),
    });

    return Response.json({
      ok: true,
      configured: !!admin,
      count: totalCount,
      report: object,
      samples: base?.samples ?? questions.slice(0, 5),
      generatedWith: MODEL_ID,
    });
  } catch (err) {
    console.error("[insights/report] error (non-fatal):", err);
    return Response.json(EMPTY(!!admin));
  }
}
