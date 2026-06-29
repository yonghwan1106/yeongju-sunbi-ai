import type { CityConfig } from "./types";
import { heritageData } from "@/data/heritage";
import { figuresData } from "@/data/figures";
import { coursesData } from "@/data/courses";
import { quizData } from "@/data/quiz";
import { canonicalQAs } from "@/data/canonical-qa";
import { STATIC_YEONGJU_RELICS } from "@/lib/api/museum-api";
import { STATIC_ENCYKOREA_DATA } from "@/lib/api/encykorea-api";

/**
 * 영주 도시 설정 — 기본 도시.
 * NEXT_PUBLIC_CITY_ID 미설정 또는 "yeongju" 일 때 사용.
 * 데이터는 기존 @/data/* 파일을 참조만 하며 내용은 변경하지 않는다.
 */
export const yeongjuCity: CityConfig = {
  id: "yeongju",
  name: "영주",
  brand: {
    title: "영주선비AI",
    description:
      "유네스코 세계유산 부석사·소수서원을 비롯한 영주의 천년 문화유산을 AI가 생생하게 해설해드립니다. 공공데이터 기반 대화형 AI 해설사, 선비문화 퀴즈, 디지털 스탬프투어를 만나보세요.",
    keywords: [
      "영주",
      "문화유산",
      "AI 해설사",
      "부석사",
      "소수서원",
      "선비문화",
      "유네스코",
      "공공데이터",
    ],
    contestLabel: "2026 영주시 공공데이터 활용 창업경진대회 출품작",
  },
  persona: "영주선비AI 에이전트",
  weatherGrid: { nx: 89, ny: 111 },
  areaCode: "35",
  tourMobileApp: "YeongjuSunbiAI",
  govUrl: "https://www.yeongju.go.kr",
  suggestedQuestions: [
    "부석사 무량수전의 배흘림기둥은 왜 특별한가요?",
    "소수서원이 한국 최초의 서원인 이유는?",
    "영주의 선비문화란 무엇인가요?",
    "무섬마을 외나무다리의 역사가 궁금해요",
    "소백산 철쭉 명소와 등산 정보를 알려주세요",
    "부석사와 소수서원 하루 코스 추천해 주세요",
  ],
  dataPack: {
    heritage: heritageData,
    figures: figuresData,
    courses: coursesData,
    quiz: quizData,
    canonicalQAs,
    museumRelics: STATIC_YEONGJU_RELICS,
    encyData: STATIC_ENCYKOREA_DATA,
  },
};
