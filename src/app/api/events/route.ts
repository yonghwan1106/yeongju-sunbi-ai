/**
 * POST /api/events — 익명 학습 이벤트 수집 API
 *
 * Graceful degradation: DB 미설정 시 {ok:false, skipped:"db-unconfigured"} 200 반환.
 * 모든 DB 호출 try/catch, 실패해도 200 반환 (앱 동작 영향 0).
 *
 * 프라이버시: 개인식별자 없음. session_id = 기기 익명 UUID, class_code = 교실코드.
 */

import { getAdminClient } from "@/lib/supabase";
import { getActiveCity } from "@/config/city";

export const runtime = "nodejs";

// 빌드 타임 상수
const _cityId = getActiveCity().id;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type,
      session_id = "",
      class_code = "",
    } = body as {
      type: string;
      session_id?: string;
      class_code?: string;
    };

    const admin = getAdminClient();
    if (!admin) {
      return Response.json({ ok: false, skipped: "db-unconfigured" });
    }

    // ── stamp 체크인 ──────────────────────────────────────────────────────────
    if (type === "stamp") {
      const { heritage_id } = body as { heritage_id: string };
      const { error } = await admin.from("stamp_checkins").insert({
        class_code,
        session_id,
        heritage_id,
        city_id: (body.city_id as string | undefined) ?? _cityId,
      });
      if (error) throw error;
      return Response.json({ ok: true });
    }

    // ── 퀴즈 답변 ────────────────────────────────────────────────────────────
    if (type === "quiz") {
      const attempts = (body.attempts ?? []) as Array<{
        quiz_id: string;
        is_correct: boolean;
      }>;
      if (attempts.length === 0) {
        return Response.json({ ok: true, skipped: "no-attempts" });
      }
      const rows = attempts.map((a) => ({
        class_code,
        session_id,
        quiz_id: a.quiz_id,
        is_correct: a.is_correct,
        city_id: (body.city_id as string | undefined) ?? _cityId,
      }));
      const { error } = await admin.from("quiz_attempts").insert(rows);
      if (error) throw error;
      return Response.json({ ok: true, count: rows.length });
    }

    // ── 교실코드 등록 ─────────────────────────────────────────────────────────
    if (type === "classroom") {
      const { code, label = "" } = body as { code: string; label?: string };
      const { error } = await admin.from("class_rooms").insert({
        code,
        label,
        city_id: (body.city_id as string | undefined) ?? _cityId,
      });
      if (error) throw error;
      return Response.json({ ok: true });
    }

    return Response.json({ ok: false, error: "unknown-type" }, { status: 400 });
  } catch (err) {
    // 모든 DB 오류는 non-fatal — 앱 동작에 영향 없음
    console.error("[events] DB error (non-fatal):", err);
    return Response.json({ ok: false, error: String(err) });
  }
}
