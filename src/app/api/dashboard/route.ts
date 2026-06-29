/**
 * GET /api/dashboard?class=<교실코드>&city=<도시ID>
 *
 * Graceful degradation: DB 미설정 시 configured:false·빈 데이터 200 반환.
 * heritage_id→이름, quiz_id→질문 매핑은 @/data/active 정적 데이터 사용.
 */
import { getAdminClient } from "@/lib/supabase";
import { getActiveCity } from "@/config/city";
import { heritageData, quizData } from "@/data/active";

export const runtime = "nodejs";

const _fallback = {
  ok: true,
  configured: false,
  totals: { participants: 0, stamps: 0, quizAttempts: 0, overallAccuracy: 0 },
  heritage: [] as HeritageStat[],
  quiz: [] as QuizStat[],
};

interface HeritageStat {
  id: string;
  name: string;
  checkins: number;
  participants: number;
}

interface QuizStat {
  id: string;
  question: string;
  correct: number;
  total: number;
  accuracy: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classCode = (searchParams.get("class") ?? "").trim();
  const cityId = (searchParams.get("city") ?? getActiveCity().id).trim();

  const admin = getAdminClient();
  if (!admin) {
    return Response.json(_fallback);
  }

  try {
    // ── heritage 이름 맵 ──────────────────────────────────────────────────────
    const heritageNameMap = new Map(heritageData.map((h) => [h.id, h.name]));

    // ── quiz 질문 맵 ──────────────────────────────────────────────────────────
    const quizQuestionMap = new Map(quizData.map((q) => [q.id, q.question]));

    // ── stamp_checkins 조회 ───────────────────────────────────────────────────
    let stampsQuery = admin
      .from("stamp_checkins")
      .select("heritage_id, session_id")
      .eq("city_id", cityId);
    if (classCode) stampsQuery = stampsQuery.eq("class_code", classCode);

    const { data: stampsRaw, error: stampsErr } = await stampsQuery;
    if (stampsErr) throw stampsErr;

    // heritage_id별 집계
    const heritageAgg: Record<string, { checkins: number; sessions: Set<string> }> = {};
    for (const row of stampsRaw ?? []) {
      const hid = row.heritage_id as string;
      const sid = row.session_id as string;
      if (!heritageAgg[hid]) heritageAgg[hid] = { checkins: 0, sessions: new Set() };
      heritageAgg[hid].checkins++;
      heritageAgg[hid].sessions.add(sid);
    }

    const heritageStats: HeritageStat[] = Object.entries(heritageAgg).map(
      ([id, { checkins, sessions }]) => ({
        id,
        name: heritageNameMap.get(id) ?? id,
        checkins,
        participants: sessions.size,
      })
    );

    // ── quiz_attempts 조회 ────────────────────────────────────────────────────
    let quizQuery = admin
      .from("quiz_attempts")
      .select("quiz_id, is_correct, session_id")
      .eq("city_id", cityId);
    if (classCode) quizQuery = quizQuery.eq("class_code", classCode);

    const { data: quizRaw, error: quizErr } = await quizQuery;
    if (quizErr) throw quizErr;

    // quiz_id별 집계
    const quizAgg: Record<string, { correct: number; total: number }> = {};
    const stampParticipants = new Set<string>();
    for (const row of stampsRaw ?? []) stampParticipants.add(row.session_id as string);

    const quizParticipants = new Set<string>();
    for (const row of quizRaw ?? []) {
      const qid = row.quiz_id as string;
      const correct = row.is_correct as boolean;
      const sid = row.session_id as string;
      if (!quizAgg[qid]) quizAgg[qid] = { correct: 0, total: 0 };
      quizAgg[qid].total++;
      if (correct) quizAgg[qid].correct++;
      quizParticipants.add(sid);
    }

    const quizStats: QuizStat[] = Object.entries(quizAgg).map(([id, { correct, total }]) => ({
      id,
      question: quizQuestionMap.get(id) ?? id,
      correct,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }));

    // ── 전체 합계 ─────────────────────────────────────────────────────────────
    const totalStamps = (stampsRaw ?? []).length;
    const totalQuizAttempts = (quizRaw ?? []).length;
    const totalCorrect = (quizRaw ?? []).filter((r) => r.is_correct).length;
    const overallAccuracy =
      totalQuizAttempts > 0 ? Math.round((totalCorrect / totalQuizAttempts) * 100) : 0;

    // 참여자 = 스탬프 또는 퀴즈에 참여한 고유 세션 수 합집합
    const allSessions = new Set([...stampParticipants, ...quizParticipants]);

    return Response.json({
      ok: true,
      configured: true,
      totals: {
        participants: allSessions.size,
        stamps: totalStamps,
        quizAttempts: totalQuizAttempts,
        overallAccuracy,
      },
      heritage: heritageStats,
      quiz: quizStats,
    });
  } catch (err) {
    console.error("[dashboard] DB error (non-fatal):", err);
    return Response.json({ ..._fallback, configured: true });
  }
}
