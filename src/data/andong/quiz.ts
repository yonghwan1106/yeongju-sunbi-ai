import { QuizQuestion } from "@/types";

export const andongQuizData: QuizQuestion[] = [
  {
    id: "aq1",
    heritageId: "dosanseowon",
    question: "도산서원을 처음 세운 조선 성리학자는 누구일까요?",
    options: ["주세붕", "이황", "류성룡", "안향"],
    correctIndex: 1,
    explanation:
      "퇴계 이황(1501~1570)이 1561년 도산서당을 짓고 후학을 가르쳤으며, 그의 사후 1574년 제자들이 도산서원으로 확장하였습니다.",
    difficulty: "easy",
    category: "역사",
  },
  {
    id: "aq2",
    heritageId: "hoeemaul",
    question: "하회마을이 2010년 유네스코 세계유산으로 등재된 공식 명칭은?",
    options: [
      "한국의 서원",
      "한국의 역사마을: 하회와 양동",
      "산사, 한국의 산지승원",
      "한국의 갯벌",
    ],
    correctIndex: 1,
    explanation:
      "하회마을은 경주 양동마을과 함께 '한국의 역사마을: 하회와 양동(Historic Villages of Korea: Hahoe and Yangdong)'이라는 이름으로 유네스코 세계유산에 등재되었습니다.",
    difficulty: "medium",
    category: "문화",
  },
  {
    id: "aq3",
    heritageId: "hoeemaul",
    question: "임진왜란 교훈을 담아 류성룡이 저술한 역사서는?",
    options: ["난중일기", "징비록", "삼국사기", "동국통감"],
    correctIndex: 1,
    explanation:
      "『징비록(懲毖錄)』은 류성룡이 임진왜란의 전 과정을 기록한 회고록으로, 2001년 유네스코 세계기록유산에 등재되었습니다. '징비'는 '지난 잘못을 경계하다'는 뜻입니다.",
    difficulty: "easy",
    category: "역사",
  },
  {
    id: "aq4",
    heritageId: "bongjeongsa",
    question: "봉정사 극락전이 주목받는 건축사적 의의는?",
    options: [
      "한국 최초의 불탑",
      "현존 최고(最古) 목조건축 중 하나",
      "한국 최대 규모의 불전",
      "최초의 벽돌조 건물",
    ],
    correctIndex: 1,
    explanation:
      "봉정사 극락전(국보 제15호)은 1972년 수리 중 발견된 상량문에 고려 공민왕 12년(1363년) 중수 기록이 확인되어, 현존하는 한국 최고(最古)의 목조건축 중 하나로 공인됩니다.",
    difficulty: "medium",
    category: "건축",
  },
];
