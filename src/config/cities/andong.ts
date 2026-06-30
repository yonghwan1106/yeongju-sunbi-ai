import type { CityConfig } from "./types";
import { andongHeritageData } from "@/data/andong/heritage";
import { andongFiguresData } from "@/data/andong/figures";
import { andongCoursesData } from "@/data/andong/courses";
import { andongQuizData } from "@/data/andong/quiz";
import { andongCanonicalQAs } from "@/data/andong/canonical-qa";
import { STATIC_ANDONG_RELICS } from "@/data/andong/museum";
import { STATIC_ANDONG_ENCY_DATA } from "@/data/andong/ency";

/**
 * 안동 도시 설정 — 2호 도시.
 * NEXT_PUBLIC_CITY_ID=andong 일 때 사용.
 */
export const andongCity: CityConfig = {
  id: "andong",
  name: "안동",
  brand: {
    title: "안동 유교문화 AI",
    description:
      "안동 유교문화 AI 해설 & 선비문화 체험 플랫폼. 도산서원·하회마을 등 유네스코 세계유산과 퇴계 이황·류성룡의 학맥을 AI가 생생하게 안내합니다.",
    keywords: [
      "안동",
      "도산서원",
      "하회마을",
      "류성룡",
      "이황",
      "유교문화",
      "유네스코",
      "공공데이터",
    ],
    contestLabel: "안동 유교문화 AI 해설 플랫폼",
  },
  persona: "안동 유교문화 AI 에이전트",
  weatherGrid: { nx: 91, ny: 106 },
  areaCode: "35",
  sigunguCode: "11",
  chaCtcd: "37",
  tourMobileApp: "AndongSunbiAI",
  govUrl: "https://www.andong.go.kr",
  suggestedQuestions: [
    "도산서원은 누가 세웠나요?",
    "하회마을이 유네스코에 등재된 이유는?",
    "류성룡의 징비록은 어떤 책인가요?",
    "병산서원 만대루에서 보이는 경치를 알려주세요",
    "봉정사 극락전이 왜 중요한가요?",
    "안동 하루 여행 코스를 추천해 주세요",
  ],
  dataPack: {
    heritage: andongHeritageData,
    figures: andongFiguresData,
    courses: andongCoursesData,
    quiz: andongQuizData,
    canonicalQAs: andongCanonicalQAs,
    museumRelics: STATIC_ANDONG_RELICS,
    encyData: STATIC_ANDONG_ENCY_DATA,
  },
};
