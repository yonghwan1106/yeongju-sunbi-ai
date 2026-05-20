// 영주 선비 인물 데이터 — 천 년의 학맥을 잇는 인물 계보
export interface HistoricalFigure {
  id: string;
  name: string;
  bornYear: number;
  diedYear: number;
  role: string;
  description: string;
  relatedHeritage: string[];
}

export const figuresData: HistoricalFigure[] = [
  {
    id: "uisang",
    name: "의상대사",
    bornYear: 625,
    diedYear: 702,
    role: "화엄종 조사",
    description:
      "신라의 고승. 당나라에서 화엄학을 익히고 돌아와 676년 부석사를 창건, 한국 화엄종의 근본 도량을 세웠습니다.",
    relatedHeritage: ["buseoksa"],
  },
  {
    id: "seonmyo",
    name: "선묘낭자",
    bornYear: 620,
    diedYear: 680,
    role: "부석사 설화 인물",
    description:
      "의상대사를 사모한 당나라 여인. 용으로 변해 부석사 창건을 도왔다는 설화의 주인공으로, '부석(浮石)'이라는 이름의 유래가 됩니다.",
    relatedHeritage: ["buseoksa"],
  },
  {
    id: "gongminwang",
    name: "공민왕",
    bornYear: 1330,
    diedYear: 1374,
    role: "고려 31대 왕",
    description:
      "고려의 개혁 군주. 재위 17년(1368)에 영주향교를 창건하여 지방 관학의 토대를 마련했습니다.",
    relatedHeritage: ["yeongju-hyanggyo"],
  },
  {
    id: "anhyang",
    name: "안향",
    bornYear: 1243,
    diedYear: 1306,
    role: "성리학 도입자",
    description:
      "고려 말 원나라에서 주자학을 처음 들여온 학자. 한국 성리학의 비조(鼻祖)로 추앙되며 소수서원의 주향(主享) 인물입니다.",
    relatedHeritage: ["sosuseowon", "sosu-museum"],
  },
  {
    id: "juseboong",
    name: "주세붕",
    bornYear: 1495,
    diedYear: 1554,
    role: "백운동서원 창건자",
    description:
      "풍기군수 재임 중 1543년 백운동서원(소수서원의 전신)을 창건했고, 풍기 인삼 재배 전설의 시조로도 전해집니다.",
    relatedHeritage: ["sosuseowon", "sosu-museum", "sunbichon", "punggi-ginseng"],
  },
  {
    id: "yihwang",
    name: "이황",
    bornYear: 1501,
    diedYear: 1570,
    role: "성리학자 (퇴계)",
    description:
      "조선 성리학을 집대성한 대학자. 풍기군수 시절 '소수서원' 사액을 받아냈고, 영주 학맥의 정신적 기둥으로 평가됩니다.",
    relatedHeritage: ["sosuseowon", "sunbichon", "sosu-museum"],
  },
  {
    id: "parksu",
    name: "박수",
    bornYear: 1641,
    diedYear: 1712,
    role: "무섬마을 입향조",
    description:
      "반남 박씨로 1666년 무섬에 처음 정착한 입향조. 내성천 물돌이 안쪽에 학문하는 사대부 마을의 토대를 닦았습니다.",
    relatedHeritage: ["museom"],
  },
];

export function getFigureById(id: string): HistoricalFigure | undefined {
  return figuresData.find((f) => f.id === id);
}

export function getFigureByName(name: string): HistoricalFigure | undefined {
  return figuresData.find((f) => f.name === name);
}
