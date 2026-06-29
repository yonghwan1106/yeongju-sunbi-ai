"use client";

/**
 * 클라이언트 익명 세션 유틸리티
 *
 * 개인정보 보호 설계:
 * - 식별자 = 기기 생성 익명 UUID (localStorage 캐시)
 * - 실명·연락처·IP 저장 없음
 * - SSR/localStorage 오류 시 빈 문자열 반환 (graceful)
 */

const SESSION_KEY = "yeongju-anon-session";
const CLASS_CODE_KEY = "sunbi-class-code";
const OPT_OUT_KEY = "sunbi-log-optout";

/**
 * 익명 세션 ID — localStorage에 캐시, 없으면 crypto.randomUUID() 생성.
 * SSR 또는 storage 오류 시 "" 반환.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "";
  }
}

/** 교실코드 조회 — 없으면 "" */
export function getClassCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(CLASS_CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** 교실코드 저장 */
export function setClassCode(code: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLASS_CODE_KEY, code.trim());
  } catch {
    // ignore storage errors
  }
}

/** 질문 로깅 옵트아웃 여부 */
export function isQuestionLoggingOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "true";
  } catch {
    return false;
  }
}

/** 질문 로깅 옵트아웃 설정 */
export function setQuestionLoggingOptOut(v: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OPT_OUT_KEY, v ? "true" : "false");
  } catch {
    // ignore
  }
}
