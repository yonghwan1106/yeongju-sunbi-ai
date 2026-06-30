import { HistoricalFigure } from "@/data/figures";

export const andongFiguresData: HistoricalFigure[] = [
  {
    id: "yihwang-andong",
    name: "이황",
    hanja: "李滉",
    ho: "퇴계(退溪)",
    bornYear: 1501,
    diedYear: 1570,
    era: "조선",
    school: "성리학",
    role: "퇴계 · 성리학 집대성",
    contribution: "도산서원을 세워 후학을 기른 영남학파의 종장",
    description:
      "조선 성리학을 집대성한 대학자. 안동 도산서원을 세워 후학을 양성하고, 풍기군수 재임 시 소수서원 사액을 이끌어내어 영남 학맥의 중심이 되었습니다.",
    relatedHeritage: ["dosanseowon"],
    links: [],
  },
  {
    id: "kimseongil",
    name: "김성일",
    hanja: "金誠一",
    ho: "학봉(鶴峯)",
    bornYear: 1538,
    diedYear: 1593,
    era: "조선",
    school: "성리학",
    role: "퇴계 문인 · 의병장",
    contribution: "퇴계의 학문을 이은 문인이자 임진왜란 의병장",
    description:
      "퇴계 이황의 문인으로 임진왜란 직전 일본 통신사로 파견되었습니다. 전쟁 중 의병을 일으켜 경상우도를 수호하였으며, 안동 출신의 대표적 절의 인물입니다.",
    relatedHeritage: ["hoeemaul"],
    links: [{ to: "yihwang-andong", label: "퇴계 이황의 문인", kind: "학맥" }],
  },
  {
    id: "ryuseongnyong",
    name: "류성룡",
    hanja: "柳成龍",
    ho: "서애(西厓)",
    bornYear: 1542,
    diedYear: 1607,
    era: "조선",
    school: "성리학",
    role: "임진왜란 영의정",
    contribution: "퇴계의 수제자, 임진왜란 영의정·『징비록』 저술",
    description:
      "퇴계 이황의 수제자로 임진왜란 당시 영의정을 맡아 전쟁 극복에 기여했습니다. 하회마을에서 태어났으며, 전란의 교훈을 담은 『징비록(懲毖錄)』을 저술했습니다.",
    relatedHeritage: ["hoeemaul", "byeongsanseowon"],
    links: [{ to: "yihwang-andong", label: "퇴계 이황의 수제자", kind: "학맥" }],
  },
];
