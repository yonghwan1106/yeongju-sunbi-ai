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
import type { CourseRecommendation, QuizQuestion } from "@/types";
import type { CanonicalQA } from "@/data/canonical-qa";

// 모듈 초기화 시점(빌드 타임)에 한 번만 평가된다
const _pack = getActiveCity().dataPack;

// ── 데이터 배열 ──────────────────────────────────────────────────────────────
export const heritageData = _pack.heritage;
export const figuresData = _pack.figures;
export const coursesData = _pack.courses;
export const quizData = _pack.quiz;
export const canonicalQAs = _pack.canonicalQAs;

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

  if (duration) {
    const norm = duration.trim();
    const found = coursesData.find((c) => {
      const d = c.duration;
      return (
        d.includes(norm) ||
        (norm === "반나절" && d.includes("반나절")) ||
        ((norm === "당일" || norm === "하루" || norm === "당일치기") &&
          d.includes("당일")) ||
        ((norm === "1박2일" || norm === "1박 2일") && d.includes("1박")) ||
        ((norm === "2박3일" || norm === "2박 3일") && d.includes("2박"))
      );
    });
    if (found) return found;
  }

  if (theme) {
    const found = coursesData.find((c) => c.theme === theme);
    if (found) return found;
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
