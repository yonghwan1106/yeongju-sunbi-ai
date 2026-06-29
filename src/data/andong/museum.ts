import { MuseumRelic } from "@/lib/api/museum-api";

/** 안동 관련 국립중앙박물관 소장 유물 정적 데이터 */
export const STATIC_ANDONG_RELICS: MuseumRelic[] = [
  {
    id: "andong-museum-001",
    name: "하회탈 — 양반",
    nameEn: "Hahoe Mask — Yangban (Aristocrat)",
    category: "목공예·민속",
    period: "고려 말~조선 초 (12~14세기 추정)",
    material: "오리나무",
    size: "세로 24.8cm, 가로 20.8cm",
    description:
      "안동 하회마을의 하회별신굿탈놀이에 사용되는 탈. 양반 탈은 입꼬리가 위로 올라가 웃는 듯하면서도 아래로 내려가 슬퍼 보이는 이중적 표정이 특징이다. 국보 제121호로 지정되어 현재 국립중앙박물관에 소장되어 있으며, 하회마을의 공동체 의례와 민중 풍자를 담고 있다.",
    location: "국립중앙박물관 민속관",
    relatedPlace: "안동 하회마을",
    source: "국립중앙박물관 e-Museum",
  },
  {
    id: "andong-museum-002",
    name: "류성룡 징비록",
    nameEn: "Jingbirok (Record of Regret) by Ryu Seong-nyong",
    category: "전적·고문서",
    period: "조선 선조~광해군 (1604년 저술)",
    material: "한지 필사본",
    size: "세로 31.5cm, 가로 20.5cm (2권 2책)",
    description:
      "임진왜란의 전 과정을 기록한 류성룡(1542~1607)의 회고록. '징비(懲毖)'는 시경(詩經) 구절에서 따온 말로 '지난 잘못을 뉘우쳐 후환을 경계한다'는 뜻이다. 2001년 유네스코 세계기록유산에 등재되었으며, 국보 제132호로 지정되어 있다.",
    location: "국립중앙박물관 역사관",
    relatedPlace: "안동 하회마을·병산서원",
    source: "국립중앙박물관 e-Museum",
  },
  {
    id: "andong-museum-003",
    name: "퇴계 이황 초상",
    nameEn: "Portrait of Yi Hwang (Toegye)",
    category: "회화",
    period: "조선 중기 (16세기 후반)",
    material: "비단에 채색",
    size: "세로 68.0cm, 가로 42.5cm",
    description:
      "조선 성리학의 대가 퇴계 이황(1501~1570)의 초상화. 도산서원 창설자이자 영남 학파의 종조(宗祖)로, 현재 1,000원권 지폐 앞면의 인물이다. 고아한 선비의 풍모와 학자적 기품을 잘 담아낸 작품으로 평가받는다.",
    location: "국립중앙박물관 회화실",
    relatedPlace: "안동 도산서원",
    source: "국립중앙박물관 e-Museum",
  },
];
