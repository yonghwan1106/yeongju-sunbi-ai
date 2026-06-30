/**
 * 활성 로케일 — english 브랜치 전용: 영문(en) 고정.
 * (main/master 한국어 기본은 영향 없음 — 이 변경은 english 브랜치에만 존재)
 */
export type Locale = "ko" | "en";

export function getLocale(): Locale {
  if (process.env.NEXT_PUBLIC_LOCALE === "ko") return "ko";
  return "en";
}

export const isEn = (): boolean => getLocale() === "en";
