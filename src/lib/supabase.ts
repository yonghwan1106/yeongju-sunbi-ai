import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트 팩토리 (Graceful Degradation)
 *
 * 설계: anon 키 + RLS. 저장 데이터는 전부 비식별·익명(개인정보 0)이며,
 * RLS 정책이 익명 INSERT/SELECT만 허용한다.
 *
 * anon 키와 URL은 Supabase 보안 모델상 "공개되도록 설계된" 값이라(클라이언트
 * 번들에 그대로 실림) 폴백 상수로 내장한다 — 이렇게 하면 Vercel 환경변수 설정
 * 없이도 로컬·프리뷰·프로덕션 빌드가 동일하게 DB에 연결된다. 실제 보호는 RLS가 한다.
 * 환경변수가 설정되어 있으면 그 값이 우선한다.
 */

const PLACEHOLDER_FRAGMENTS = ["your-project", "your-anon", "your-service"];

function isValidKey(val: string | undefined): val is string {
  if (!val || val.trim() === "") return false;
  return !PLACEHOLDER_FRAGMENTS.some((frag) => val.includes(frag));
}

// 공개 anon 자격증명 (yeongju-sunbi-ai 프로젝트, ap-northeast-2) — RLS로 보호됨
const FALLBACK_URL = "https://sffgsqjjuwymalasqzdz.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZmdzcWpqdXd5bWFsYXNxemR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDE2OTcsImV4cCI6MjA5ODI3NzY5N30.IXNtv3nxgtHvx_xCKfBIfLg_ckc4Mf64iARJdxVBQTg";

const _url = isValidKey(process.env.NEXT_PUBLIC_SUPABASE_URL)
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL as string)
  : FALLBACK_URL;
const _anonKey = isValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)
  : FALLBACK_ANON_KEY;
const _serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 선택(미사용 가능)

/** Anon 키 + URL이 유효한지 여부 (폴백 내장이라 항상 true) */
export function isSupabaseConfigured(): boolean {
  return isValidKey(_url) && isValidKey(_anonKey);
}

/** Service-role 키가 유효한지 여부 (서버 전용, 선택) */
export function isSupabaseAdminConfigured(): boolean {
  return isValidKey(_url) && isValidKey(_serviceKey);
}

/**
 * Anon 클라이언트 — 클라이언트·서버 양쪽 사용 가능.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(_url, _anonKey)
  : null;

/**
 * 서버용 클라이언트.
 * service-role 키가 있으면 RLS 우회 admin 클라이언트를, 없으면 anon 클라이언트를
 * 반환한다(anon은 RLS 정책 기반 동작). 둘 다 미설정이면 null.
 * persistSession:false — 세션 저장 없음.
 */
export function getAdminClient(): SupabaseClient | null {
  if (isSupabaseAdminConfigured()) {
    return createClient(_url, _serviceKey as string, {
      auth: { persistSession: false },
    });
  }
  if (isSupabaseConfigured()) {
    return createClient(_url, _anonKey, { auth: { persistSession: false } });
  }
  return null;
}
