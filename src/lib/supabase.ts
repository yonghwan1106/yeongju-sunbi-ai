import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트 팩토리 (Graceful Degradation)
 *
 * URL/키에 플레이스홀더가 들어있거나 비어있으면 미설정으로 간주하여 null 반환.
 * DB가 미프로비저닝 상태에서도 앱이 정상 동작한다.
 */

const PLACEHOLDER_FRAGMENTS = ["your-project", "your-anon", "your-service"];

function isPlaceholder(val: string | undefined): boolean {
  if (!val || val.trim() === "") return true;
  return PLACEHOLDER_FRAGMENTS.some((frag) => val.includes(frag));
}

const _url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const _anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const _serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Anon 키 + URL이 유효한지 여부 */
export function isSupabaseConfigured(): boolean {
  return !isPlaceholder(_url) && !isPlaceholder(_anonKey);
}

/** Service-role 키 + URL이 유효한지 여부 (서버 전용) */
export function isSupabaseAdminConfigured(): boolean {
  return !isPlaceholder(_url) && !isPlaceholder(_serviceKey);
}

/**
 * Anon 클라이언트 — 클라이언트·서버 양쪽 사용 가능.
 * 미설정 시 null.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(_url!, _anonKey!)
  : null;

/**
 * Service-role 클라이언트 — 서버 전용.
 * 미설정 시 null 반환.
 * persistSession:false로 세션 저장 없음.
 */
export function getAdminClient(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) return null;
  return createClient(_url!, _serviceKey!, {
    auth: { persistSession: false },
  });
}
