/**
 * Active city data layer
 *
 * NEXT_PUBLIC_CITY_ID 환경변수로 선택된 도시의 dataPack을 기존과 동일한
 * 이름으로 re-export한다. 소비처(컴포넌트/페이지/API route)는 이 파일만
 * import하면 된다.
 *
 * 영주(기본) 빌드: 기존 동작과 100% 동일.
 * 안동 빌드     : NEXT_PUBLIC_CITY_ID=andong 설정 후 배포.
 */
import { getActiveCity } from "@/config/city";
import { isEn } from "@/config/locale";
import { applyHeritageEn, applyFiguresEn, applyCoursesEn, applyQuizEn, applyCanonicalEn } from "@/data/en";
import type { CourseRecommendation, QuizQuestion } from "@/types";
import type { CanonicalQA } from "@/data/canonical-qa";

// 모듈 초기화 시점(빌드 타임)에 한 번만 평가된다
const _city = getActiveCity();
const _pack = _city.dataPack;
// 영어 오버레이: 영주(yeongju) 영문 빌드에서만 텍스트를 영어로 치환
const _en = isEn() && _city.id === "yeongju";

// ── 도시 편의 헬퍼 ───────────────────────────────────────────────────────────
/** 활성 도시명 (예: "영주", "안동") */
export const cityName = _city.name;
/** 활성 도시 브랜드 정보 */
export const cityBrand = _city.brand;
/** 활성 dataPack 문화유산 이름 배열 — 프롬프트·키워드 생성용 */
export const landmarks: string[] = _pack.heritage.map((h) => h.name);
/** 활성 dataPack 인물 이름 배열 — 프롬프트·키워드 생성용 */
export const figureNames: string[] = _pack.figures.map((f) => f.name);

// ── 데이터 배열 ──────────────────────────────────────────────────────────────
export const heritageData = _en ? applyHeritageEn(_pack.heritage) : _pack.heritage;
export const figuresData = _en ? applyFiguresEn(_pack.figures) : _pack.figures;
export const coursesData = _en ? applyCoursesEn(_pack.courses) : _pack.courses;
export const quizData = _en ? applyQuizEn(_pack.quiz) : _pack.quiz;
// 한국어 원본(챗 도구의 기간 매칭 등 — API/매칭은 한국어 기준)
export const coursesDataKo = _pack.courses;
export const canonicalQAs = _en ? applyCanonicalEn(_pack.canonicalQAs) : _pack.canonicalQAs;

// ── 타입 re-export ────────────────────────────────────────────────────────────
export type { HistoricalFigure } from "@/data/figures";
export type { CanonicalQA } from "@/data/canonical-qa";

// ── 문화유산 헬퍼 ─────────────────────────────────────────────────────────────
export function getHeritageById(id: string) {
  return heritageData.find((h) => h.id === id);
}

export function getHeritageByCategory(category: string) {
  return heritageData.filter((h) => h.category === category);
}

// ── 코스 헬퍼 ────────────────────────────────────────────────────────────────
export function findCuratedCourse(opts: {
  duration?: string;
  theme?: string;
}): CourseRecommendation | undefined {
  const { duration, theme } = opts;

  // 매칭은 항상 한국어 원본(기간 문자열) 기준 → 결과는 활성 로케일 코스로 반환
  const toActive = (c: CourseRecommendation) =>
    coursesData.find((x) => x.id === c.id) ?? c;

  if (duration) {
    const norm = duration.trim();
    const found = coursesDataKo.find((c) => {
      const d = c.duration;
      return (
        d.includes(norm) ||
        (norm === "반나절" && d.includes("반나절")) ||
        ((norm === "당일" || norm === "하루" || norm === "당일치기") &&
          d.includes("당일")) ||
        ((norm === "1박2일" || norm === "1박 2일") && d.includes("1박")) ||
        ((norm === "2박3일" || norm === "2박 3일") && d.includes("2박")) ||
        ((norm === "3박4일" || norm === "3박 4일") && d.includes("3박"))
      );
    });
    if (found) return toActive(found);
  }

  if (theme) {
    const found = coursesDataKo.find((c) => c.theme === theme);
    if (found) return toActive(found);
  }

  return undefined;
}

// ── 퀴즈 헬퍼 ────────────────────────────────────────────────────────────────
export function getQuizByHeritage(heritageId: string) {
  return quizData.filter((q) => q.heritageId === heritageId);
}

export function getQuizByDifficulty(difficulty: QuizQuestion["difficulty"]) {
  return quizData.filter((q) => q.difficulty === difficulty);
}

export function getRandomQuiz(count: number = 5) {
  const shuffled = [...quizData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── Canonical Q&A 헬퍼 ───────────────────────────────────────────────────────
export function findCanonicalAnswer(userInput: string): CanonicalQA | null {
  const normalized = userInput.toLowerCase().replace(/\s+/g, " ").trim();
  for (const qa of canonicalQAs) {
    for (const pattern of qa.matchPatterns) {
      if (normalized.includes(pattern.toLowerCase())) {
        return qa;
      }
    }
  }
  return null;
}
