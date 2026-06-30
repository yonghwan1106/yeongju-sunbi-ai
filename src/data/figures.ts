// 영주 선비 인물 데이터 — 천 년의 학맥을 잇는 인물 계보
export type SunbiEra = "신라" | "고려" | "조선" | "근현대";
export type SunbiSchool = "불교" | "성리학" | "관학" | "향촌";

// 인물 간 관계(학맥/계승/현창/설화) — 지식그래프의 핵심 간선
export interface FigureLink {
  to: string; // 대상 인물 id
  label: string; // 관계 설명(짧게)
  kind: "학맥" | "계승" | "현창" | "설화";
}

export interface HistoricalFigure {
  id: string;
  name: string;
  hanja?: string; // 한자명
  ho?: string; // 호(號)
  bornYear: number;
  diedYear: number;
  era?: SunbiEra;
  school?: SunbiSchool;
  role: string;
  contribution?: string; // 한 줄 핵심 업적
  description: string;
  relatedHeritage: string[];
  links?: FigureLink[]; // 이 인물 → 다른 인물 관계
}

export const figuresData: HistoricalFigure[] = [
  {
    id: "uisang",
    name: "의상대사",
    hanja: "義湘",
    ho: "해동화엄 초조",
    bornYear: 625,
    diedYear: 702,
    era: "신라",
    school: "불교",
    role: "화엄종 조사",
    contribution: "676년 부석사를 창건한 해동 화엄종의 비조",
    description:
      "신라의 고승. 당나라에서 화엄학을 익히고 돌아와 676년 부석사를 창건, 한국 화엄종의 근본 도량을 세웠습니다. 영주 천 년 학맥의 가장 오래된 뿌리입니다.",
    relatedHeritage: ["buseoksa"],
    links: [],
  },
  {
    id: "seonmyo",
    name: "선묘낭자",
    hanja: "善妙",
    bornYear: 620,
    diedYear: 680,
    era: "신라",
    school: "불교",
    role: "부석사 설화 인물",
    contribution: "‘부석(浮石)’ 설화의 주인공",
    description:
      "의상대사를 사모한 당나라 여인. 용으로 변해 부석사 창건을 도왔다는 설화의 주인공으로, ‘부석(浮石)’이라는 이름의 유래가 됩니다.",
    relatedHeritage: ["buseoksa"],
    links: [{ to: "uisang", label: "부석사 창건을 도운 설화", kind: "설화" }],
  },
  {
    id: "anhyang",
    name: "안향",
    hanja: "安珦",
    ho: "회헌(晦軒)",
    bornYear: 1243,
    diedYear: 1306,
    era: "고려",
    school: "성리학",
    role: "성리학 비조",
    contribution: "고려 말 주자학을 처음 들여온 한국 성리학의 비조",
    description:
      "고려 말 원나라에서 주자학을 처음 들여온 학자. 한국 성리학의 비조(鼻祖)로 추앙되며 소수서원의 주향(主享) 인물입니다. 그의 도통이 조선 영남학파로 이어집니다.",
    relatedHeritage: ["sosuseowon", "sosu-museum"],
    links: [],
  },
  {
    id: "gongminwang",
    name: "공민왕",
    hanja: "恭愍王",
    bornYear: 1330,
    diedYear: 1374,
    era: "고려",
    school: "관학",
    role: "고려 31대 왕",
    contribution: "1368년 영주향교를 창건해 지방 관학의 토대 마련",
    description:
      "고려의 개혁 군주. 재위 17년(1368)에 영주향교를 창건하여 지방 관학(官學)의 토대를 마련했습니다. 사림이 자라기 전, 나라가 세운 배움터의 출발점입니다.",
    relatedHeritage: ["yeongju-hyanggyo"],
    links: [],
  },
  {
    id: "juseboong",
    name: "주세붕",
    hanja: "周世鵬",
    ho: "신재(愼齋)",
    bornYear: 1495,
    diedYear: 1554,
    era: "조선",
    school: "성리학",
    role: "백운동서원 창건자",
    contribution: "1543년 한국 최초의 서원(백운동서원)을 세움",
    description:
      "풍기군수 재임 중 1543년 백운동서원(소수서원의 전신)을 창건해 안향을 기렸고, 풍기 인삼 재배 전설의 시조로도 전해집니다. 사사로운 배움터인 ‘서원’을 처음 연 인물입니다.",
    relatedHeritage: ["sosuseowon", "sosu-museum", "sunbichon", "punggi-ginseng"],
    links: [{ to: "anhyang", label: "안향을 주향(主享)으로 서원 창건", kind: "현창" }],
  },
  {
    id: "yihwang",
    name: "이황",
    hanja: "李滉",
    ho: "퇴계(退溪)",
    bornYear: 1501,
    diedYear: 1570,
    era: "조선",
    school: "성리학",
    role: "퇴계 · 성리학 집대성",
    contribution: "백운동서원을 ‘소수서원’으로 사액받아 사액서원 제도를 연 영남학파의 종장",
    description:
      "조선 성리학을 집대성한 대학자. 풍기군수 시절 ‘소수서원’ 사액을 받아내 국가 공인 서원의 길을 열었고, 영주·안동으로 이어지는 영남학파의 정신적 기둥입니다.",
    relatedHeritage: ["sosuseowon", "sunbichon", "sosu-museum"],
    links: [
      { to: "juseboong", label: "백운동서원을 사액서원으로 승격", kind: "계승" },
      { to: "anhyang", label: "안향의 성리학 도통을 계승", kind: "학맥" },
    ],
  },
  {
    id: "parksu",
    name: "박수",
    bornYear: 1641,
    diedYear: 1712,
    era: "조선",
    school: "향촌",
    role: "무섬마을 입향조",
    contribution: "1666년 무섬에 정착해 사대부 마을의 토대를 닦음",
    description:
      "반남 박씨로 1666년 무섬에 처음 정착한 입향조. 내성천 물돌이 안쪽에 학문하는 사대부 마을의 토대를 닦아, 서원의 학맥이 향촌 생활문화로 이어지게 했습니다.",
    relatedHeritage: ["museom"],
    links: [],
  },
];

export function getFigureById(id: string): HistoricalFigure | undefined {
  return figuresData.find((f) => f.id === id);
}

export function getFigureByName(name: string): HistoricalFigure | undefined {
  return figuresData.find((f) => f.name === name);
}
