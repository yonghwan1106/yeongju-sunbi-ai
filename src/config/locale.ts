/**
 * 활성 로케일 — 빌드 타임 고정(NEXT_PUBLIC_LOCALE).
 *
 * - "en" → 영문 버전
 * - 그 외 / 미설정 → 한국어(기본)
 *
 * city.ts 핀과 동일하게, english 브랜치는 이 파일을 'en' 고정으로 오버라이드해
 * 영문 전용 빌드/배포를 만든다. (main/master 한국어 기본은 영향 없음)
 */
export type Locale = "ko" | "en";

export function getLocale(): Locale {
  return process.env.NEXT_PUBLIC_LOCALE === "en" ? "en" : "ko";
}

export const isEn = (): boolean => getLocale() === "en";
