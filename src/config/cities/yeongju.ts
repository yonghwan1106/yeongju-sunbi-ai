import type { CityConfig } from "./types";
import { heritageData } from "@/data/heritage";
import { figuresData } from "@/data/figures";
import { coursesData } from "@/data/courses";
import { quizData } from "@/data/quiz";
import { canonicalQAs } from "@/data/canonical-qa";
import { STATIC_YEONGJU_RELICS } from "@/lib/api/museum-api";
import { STATIC_ENCYKOREA_DATA } from "@/lib/api/encykorea-api";
import { isEn } from "@/config/locale";

// 영문 빌드 여부(빌드 타임 고정) — true면 brand·페르소나·추천질문을 영어로
const _en = isEn();

/**
 * 영주 도시 설정 — 기본 도시.
 * NEXT_PUBLIC_CITY_ID 미설정 또는 "yeongju" 일 때 사용.
 * 데이터는 기존 @/data/* 파일을 참조만 하며 내용은 변경하지 않는다.
 * 영문 빌드(NEXT_PUBLIC_LOCALE=en): brand·persona·추천질문만 영어로 치환(한국어 기본 무영향).
 */
export const yeongjuCity: CityConfig = {
  id: "yeongju",
  name: "영주",
  brand: {
    title: _en ? "Yeongju Sunbi AI" : "영주선비AI",
    description: _en
      ? "An AI guide that brings Yeongju's thousand years of heritage vividly to life — from the UNESCO World Heritage Buseoksa Temple to Sosu Seowon, Korea's first Confucian academy. Meet a public-data-powered conversational AI docent, a Sunbi (scholar) culture quiz, and a digital stamp tour."
      : "유네스코 세계유산 부석사·소수서원을 비롯한 영주의 천년 문화유산을 AI가 생생하게 해설해드립니다. 공공데이터 기반 대화형 AI 해설사, 선비문화 퀴즈, 디지털 스탬프투어를 만나보세요.",
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
    contestLabel: _en
      ? "Entry · 2026 Yeongju Public Data Startup Competition"
      : "2026 영주시 공공데이터 활용 창업경진대회 출품작",
  },
  persona: _en ? "Yeongju Sunbi AI agent" : "영주선비AI 에이전트",
  weatherGrid: { nx: 89, ny: 111 },
  areaCode: "35",
  sigunguCode: "14",
  chaCtcd: "37",
  tourMobileApp: "YeongjuSunbiAI",
  govUrl: "https://www.yeongju.go.kr",
  suggestedQuestions: _en
    ? [
        "What makes the entasis pillars of Buseoksa Temple's Muryangsujeon Hall so special?",
        "Why is Sosu Seowon considered Korea's first Confucian academy?",
        "What exactly is Yeongju's Sunbi (Confucian scholar) culture?",
        "Tell me about the history of the single-log bridge in Museom Village.",
        "Where are the best royal azalea spots on Sobaeksan Mountain, and how do I get there?",
        "Can you suggest a one-day course covering Buseoksa Temple and Sosu Seowon?",
      ]
    : [
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
