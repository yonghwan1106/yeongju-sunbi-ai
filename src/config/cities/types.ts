import type { Heritage, CourseRecommendation, QuizQuestion } from "@/types";
import type { HistoricalFigure } from "@/data/figures";
import type { CanonicalQA } from "@/data/canonical-qa";
import type { MuseumRelic } from "@/lib/api/museum-api";
import type { EncykoreaEntry } from "@/lib/api/encykorea-api";

/** 도시별 콘텐츠 묶음 — dataPack */
export interface CityDataPack {
  heritage: Heritage[];
  figures: HistoricalFigure[];
  courses: CourseRecommendation[];
  quiz: QuizQuestion[];
  canonicalQAs: CanonicalQA[];
  museumRelics: MuseumRelic[];
  encyData: EncykoreaEntry[];
}

/** 도시 설정 전체 */
export interface CityConfig {
  id: string;
  /** 도시명 (예: "영주", "안동") */
  name: string;
  brand: {
    title: string;       // 예: "영주선비AI"
    description: string; // SEO 설명
    keywords: string[];
    contestLabel: string;
  };
  /** AI 에이전트 페르소나 이름 */
  persona: string;
  /** 기상청 격자 좌표 */
  weatherGrid: { nx: number; ny: number };
  /** 한국관광공사 areaCode (35 = 경상북도) */
  areaCode: string;
  sigunguCode?: string;
  /** 문화재청(국가유산청) 시도코드 (경상북도=37) — 무인증 국가문화유산포털 */
  chaCtcd?: string;
  /** TourAPI MobileApp 파라미터 */
  tourMobileApp: string;
  /** 지자체 공식 누리집 URL (예: "https://www.yeongju.go.kr") */
  govUrl?: string;
  /** AI 채팅 추천 질문 목록 */
  suggestedQuestions: string[];
  dataPack: CityDataPack;
}
