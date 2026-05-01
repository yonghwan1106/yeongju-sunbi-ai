import { QuizQuestion } from "@/types";

export const quizData: QuizQuestion[] = [
  {
    id: "q1",
    heritageId: "buseoksa",
    question: "부석사를 창건한 신라의 고승은 누구일까요?",
    options: ["원효대사", "의상대사", "자장율사", "혜초"],
    correctIndex: 1,
    explanation:
      "부석사는 신라 문무왕 16년(676년) 의상대사가 당나라에서 화엄학을 공부하고 돌아와 창건한 화엄종의 근본도량입니다.",
    difficulty: "easy",
    category: "역사",
  },
  {
    id: "q2",
    heritageId: "buseoksa",
    question: "'부석(浮石)'이라는 이름의 유래가 된 설화 속 인물은?",
    options: ["선덕여왕", "선묘 용녀", "허황옥", "바리공주"],
    correctIndex: 1,
    explanation:
      "의상대사를 사모한 선묘(善妙)라는 여인이 용으로 변해 큰 바위를 떠올려 적을 물리쳤다는 설화에서 '뜬 돌(浮石)'이라는 이름이 유래했습니다.",
    difficulty: "medium",
    category: "역사",
  },
  {
    id: "q3",
    heritageId: "buseoksa",
    question: "부석사 무량수전의 기둥에 적용된 건축 기법의 이름은?",
    options: ["민흘림기둥", "배흘림기둥", "원기둥", "각기둥"],
    correctIndex: 1,
    explanation:
      "배흘림기둥(엔타시스 기법)은 기둥의 중간 부분이 볼록하게 나온 형태로, 시각적 안정감을 주는 세계적 건축 기법입니다. 그리스 파르테논 신전에서도 같은 기법이 발견됩니다.",
    difficulty: "medium",
    category: "건축",
  },
  {
    id: "q4",
    heritageId: "buseoksa",
    question: "부석사가 등재된 유네스코 세계유산의 공식 명칭은?",
    options: [
      "한국의 역사마을",
      "산사, 한국의 산지승원",
      "한국의 서원",
      "한국의 갯벌",
    ],
    correctIndex: 1,
    explanation:
      "부석사는 2018년 '산사, 한국의 산지승원(Sansa, Buddhist Mountain Monasteries in Korea)'이라는 이름으로 유네스코 세계유산에 등재되었습니다.",
    difficulty: "easy",
    category: "문화",
  },
  {
    id: "q5",
    heritageId: "sosuseowon",
    question: "소수서원을 설립한 풍기군수의 이름은?",
    options: ["이황", "이이", "주세붕", "김성일"],
    correctIndex: 2,
    explanation:
      "소수서원은 1543년 풍기군수 주세붕이 고려 말 성리학자 안향을 기리기 위해 '백운동서원'이라는 이름으로 설립했습니다.",
    difficulty: "easy",
    category: "역사",
  },
  {
    id: "q6",
    heritageId: "sosuseowon",
    question: "소수서원이 '한국 최초'인 것은 무엇일까요?",
    options: ["최초의 향교", "최초의 서원", "최초의 사액서원", "최초의 성균관"],
    correctIndex: 2,
    explanation:
      "소수서원은 퇴계 이황의 건의로 명종 임금에게서 '소수서원'이라는 사액(임금이 이름을 내림)을 받은 한국 최초의 사액서원입니다.",
    difficulty: "medium",
    category: "역사",
  },
  {
    id: "q7",
    heritageId: "sosuseowon",
    question: "'소수(紹修)'의 뜻으로 옳은 것은?",
    options: [
      "작고 아름답다",
      "학문을 소개하다",
      "무너진 교학을 다시 이어 닦다",
      "자연을 수양하다",
    ],
    correctIndex: 2,
    explanation:
      "'소수(紹修)'는 '이미 무너진 교학을 다시 이어 닦게 하라(旣廢之學 紹而修之)'라는 뜻으로, 명종 임금이 서원에 내린 의미입니다.",
    difficulty: "hard",
    category: "문화",
  },
  {
    id: "q8",
    heritageId: "sosuseowon",
    question: "소수서원이 기리는 고려 말 성리학자는 누구일까요?",
    options: ["정몽주", "안향", "이색", "길재"],
    correctIndex: 1,
    explanation:
      "안향(安珦, 1243~1306)은 고려 말 원나라에서 성리학을 처음 도입한 인물로, 한국 성리학의 시조로 여겨집니다.",
    difficulty: "medium",
    category: "인물",
  },
  {
    id: "q9",
    heritageId: "museom",
    question: "무섬마을의 '무섬(水島)'이 뜻하는 것은?",
    options: ["안개 섬", "물 위의 섬", "숲의 섬", "꿈의 섬"],
    correctIndex: 1,
    explanation:
      "내성천이 삼면을 감싸 안아 마치 물 위에 떠 있는 섬처럼 보인다 하여 '무섬(水島)', 즉 '물 위의 섬'이라는 이름이 붙었습니다.",
    difficulty: "easy",
    category: "자연",
  },
  {
    id: "q10",
    heritageId: "sunbichon",
    question: "조선시대 선비가 갖추어야 할 네 가지 덕목이 아닌 것은?",
    options: ["인(仁)", "의(義)", "부(富)", "지(智)"],
    correctIndex: 2,
    explanation:
      "선비의 핵심 덕목은 인(仁)·의(義)·예(禮)·지(智)입니다. 부(富, 재물)는 선비가 추구하는 덕목이 아니라, 오히려 경계하는 대상이었습니다.",
    difficulty: "medium",
    category: "문화",
  },
  {
    id: "q11",
    heritageId: "sobaeksan",
    question: "소백산 비로봉의 해발 높이로 맞는 것은?",
    options: ["1,015m", "1,187m", "1,439m", "1,567m"],
    correctIndex: 2,
    explanation:
      "소백산의 주봉인 비로봉은 해발 1,439m로, 소백산맥에서 가장 높은 봉우리입니다.",
    difficulty: "easy",
    category: "자연",
  },
  {
    id: "q12",
    heritageId: "sobaeksan",
    question: "소백산이 2018년 지정된 유네스코 프로그램은?",
    options: [
      "세계유산",
      "세계지질공원",
      "생물권보전지역",
      "무형문화유산",
    ],
    correctIndex: 2,
    explanation:
      "소백산은 풍부한 생물 다양성을 인정받아 2018년 유네스코 생물권보전지역(MAB)에 지정되었습니다.",
    difficulty: "hard",
    category: "자연",
  },
];

export function getQuizByHeritage(heritageId: string): QuizQuestion[] {
  return quizData.filter((q) => q.heritageId === heritageId);
}

export function getQuizByDifficulty(difficulty: QuizQuestion["difficulty"]): QuizQuestion[] {
  return quizData.filter((q) => q.difficulty === difficulty);
}

export function getRandomQuiz(count: number = 5): QuizQuestion[] {
  const shuffled = [...quizData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
