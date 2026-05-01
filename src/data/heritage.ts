import { Heritage } from "@/types";

export const heritageData: Heritage[] = [
  {
    id: "buseoksa",
    name: "부석사",
    nameEn: "Buseoksa Temple",
    category: "유네스코",
    description:
      "신라 문무왕 16년(676년) 의상대사가 창건한 한국 화엄종의 근본도량. 2018년 유네스코 세계유산 '산사, 한국의 산지승원'에 등재되었습니다.",
    history:
      "의상대사가 당나라 유학 후 귀국하여 화엄종을 펼치기 위해 창건했습니다. '부석(浮石)'이라는 이름은 의상대사를 사모한 선묘 용녀가 큰 바위로 변해 떠올라 적을 물리쳤다는 설화에서 유래합니다. 고려·조선 시대를 거치며 여러 차례 중수되었으나, 무량수전은 고려 중기 이래의 원형을 잘 보존하고 있습니다.",
    architecture:
      "무량수전은 현존하는 한국 최고(最古)의 목조건축물 중 하나로, 주심포 양식의 배흘림기둥이 특징입니다. 기둥 중간이 볼록한 엔타시스(entasis) 기법은 그리스 파르테논 신전에서도 발견되는 세계적 건축 기법입니다. 건물이 자연 지형에 순응하며 배치된 점도 한국 전통 건축의 정수를 보여줍니다.",
    hiddenStory:
      "무량수전 앞마당에서 바라보는 석양은 한국 10대 절경 중 하나로 꼽힙니다. 추사 김정희는 '천하제일장락(天下第一長樂)'이라는 글씨를 남겼고, 시인 조지훈은 부석사의 아름다움에 감탄하여 여러 시를 남겼습니다.",
    location: {
      address: "경상북도 영주시 부석면 부석사로 345",
      lat: 36.9944,
      lng: 128.6825,
    },
    images: ["/images/buseoksa-main.png"],
    visitInfo: {
      hours: "08:00 ~ 18:00 (동절기 17:00)",
      fee: "성인 2,000원 / 청소년 1,500원 / 어린이 1,000원",
      closedDays: "연중무휴",
    },
    tags: ["유네스코세계유산", "의상대사", "무량수전", "배흘림기둥", "화엄종"],
    stampId: "stamp-buseoksa",
  },
  {
    id: "sosuseowon",
    name: "소수서원",
    nameEn: "Sosu Seowon",
    category: "유네스코",
    description:
      "1543년 풍기군수 주세붕이 설립한 한국 최초의 서원. 2019년 유네스코 세계유산 '한국의 서원'에 등재되었습니다.",
    history:
      "주세붕이 고려 말 성리학자 안향(安珦)의 학덕을 기리기 위해 백운동서원으로 설립했습니다. 이후 퇴계 이황이 풍기군수 시절 조정에 건의하여 '소수서원(紹修書院)'이라는 사액을 받았습니다. 이는 한국 최초의 사액서원이며, 흥선대원군의 서원 철폐령에도 살아남은 47개 서원 중 하나입니다.",
    architecture:
      "강학당(講學堂)을 중심으로 동·서재, 장서각, 사당이 배치되어 있으며, 주변 소나무 숲과 죽계천이 어우러져 학문하기에 최적의 환경을 조성합니다. 서원 경내에는 보물 제1403호인 안향 초상이 보관되어 있습니다.",
    hiddenStory:
      "소수서원의 '소수(紹修)'는 '이미 무너진 교학을 다시 이어 닦게 하라(旣廢之學 紹而修之)'는 뜻입니다. 퇴계 이황은 이곳에서 제자들을 가르치며 조선 성리학의 기초를 다졌습니다. 서원 앞 죽계천의 '경(敬)' 자 암각은 유학의 핵심 정신을 상징합니다.",
    location: {
      address: "경상북도 영주시 순흥면 소백로 2740",
      lat: 36.9337,
      lng: 128.6333,
    },
    images: ["/images/sosuseowon-main.png"],
    visitInfo: {
      hours: "09:00 ~ 18:00 (동절기 17:00)",
      fee: "성인 3,000원 / 청소년 2,000원 / 어린이 1,000원",
      closedDays: "매주 월요일, 1월 1일, 설·추석 당일",
    },
    tags: ["유네스코세계유산", "한국최초서원", "퇴계이황", "안향", "사액서원"],
    stampId: "stamp-sosuseowon",
  },
  {
    id: "sunbichon",
    name: "선비촌",
    nameEn: "Seonbi Village",
    category: "민속문화재",
    description:
      "조선시대 선비 문화와 생활상을 재현한 전통문화 체험마을. 한옥 숙박, 예절 교육, 전통 체험이 가능합니다.",
    history:
      "영주시가 선비정신의 현대적 계승을 위해 2004년 조성했습니다. 소수서원 인근에 위치하며, 조선시대 사대부 가옥 양식을 충실히 재현하여 선비의 일상을 체험할 수 있습니다.",
    architecture:
      "조선시대 양반가옥, 중인가옥, 서민가옥 등 다양한 계층의 전통 한옥이 재현되어 있습니다. 특히 누마루, 사랑채, 안채의 구조를 통해 유교 문화의 남녀유별 사상을 이해할 수 있습니다.",
    hiddenStory:
      "선비촌에서는 매년 '선비문화축제'가 열려 전통 혼례, 선비 차 문화, 서예 체험 등 다양한 프로그램이 진행됩니다. 한옥 숙박 시 고즈넉한 조선 시대의 하룻밤을 체험할 수 있어 외국인 관광객에게도 인기입니다.",
    location: {
      address: "경상북도 영주시 순흥면 소백로 2796",
      lat: 36.9352,
      lng: 128.6318,
    },
    images: ["/images/sunbichon-main.png"],
    visitInfo: {
      hours: "09:00 ~ 18:00",
      fee: "성인 3,000원 / 청소년 2,000원 / 어린이 1,500원",
      closedDays: "매주 월요일, 1월 1일, 설·추석 당일",
    },
    tags: ["선비문화", "한옥체험", "전통문화", "예절교육", "선비축제"],
    stampId: "stamp-sunbichon",
  },
  {
    id: "museom",
    name: "무섬마을",
    nameEn: "Museom Village",
    category: "민속문화재",
    description:
      "내성천이 마을을 감싸 안아 섬처럼 보이는 전통 마을. 외나무다리가 유명하며, 한국의 아름다운 길 100선에 선정되었습니다.",
    history:
      "조선 중기부터 반남 박씨와 선성 김씨가 터를 잡고 살아온 집성촌입니다. 삼면이 내성천으로 둘러싸여 '물 위의 섬'이라는 뜻의 무섬(水島)이라 불리며, 외부와 연결되는 유일한 통로가 외나무다리였습니다.",
    architecture:
      "해우당 고택, 만죽재 등 조선시대 전통 가옥이 잘 보존되어 있습니다. 내성천의 모래톱과 어우러진 마을 풍경은 한국 농촌의 원풍경으로 평가받습니다.",
    hiddenStory:
      "매년 여름 '무섬외나무다리축제'가 열리며, 외나무다리 건너기 체험이 인기입니다. 내성천의 맑은 물과 흰 모래사장은 '한국의 마지막 자연 하천'으로 불리며, 사진작가들의 성지이기도 합니다.",
    location: {
      address: "경상북도 영주시 문수면 무섬로 234",
      lat: 36.8567,
      lng: 128.7144,
    },
    images: ["/images/museom-main.png"],
    visitInfo: {
      hours: "상시 개방",
      fee: "무료",
      closedDays: "없음",
    },
    tags: ["외나무다리", "내성천", "전통마을", "한국의아름다운길", "집성촌"],
    stampId: "stamp-museom",
  },
  {
    id: "sobaeksan",
    name: "소백산 국립공원",
    nameEn: "Sobaeksan National Park",
    category: "명승",
    description:
      "해발 1,439m의 비로봉을 주봉으로 하는 소백산맥의 중심. 철쭉 군락과 주목 군락이 유명하며, 2018년 유네스코 생물권보전지역에 지정되었습니다.",
    history:
      "소백산은 예로부터 '작은 태백산'이라 불리며, 풍기와 영주를 잇는 죽령옛길의 관문이었습니다. 신라 시대부터 불교 사찰과 학문의 산으로 여겨졌으며, 조선시대에는 인삼 재배지로 유명했습니다.",
    hiddenStory:
      "매년 5~6월 비로봉 정상 일대에 펼쳐지는 철쭉 군락은 한국에서 가장 아름다운 꽃 풍경 중 하나입니다. 겨울철 상고대(나무에 피는 눈꽃)도 장관이며, 별 관측 명소로도 유명합니다.",
    location: {
      address: "경상북도 영주시 풍기읍 소백산길",
      lat: 36.9575,
      lng: 128.4864,
    },
    images: ["/images/sobaeksan-main.png"],
    visitInfo: {
      hours: "일출 1시간 전 ~ 일몰 시",
      fee: "무료",
      closedDays: "기상 악화 시 입산 통제",
    },
    tags: ["국립공원", "철쭉", "비로봉", "죽령옛길", "생물권보전지역"],
    stampId: "stamp-sobaeksan",
  },
];

export function getHeritageById(id: string): Heritage | undefined {
  return heritageData.find((h) => h.id === id);
}

export function getHeritageByCategory(category: Heritage["category"]): Heritage[] {
  return heritageData.filter((h) => h.category === category);
}

export function getUnescoHeritage(): Heritage[] {
  return heritageData.filter((h) => h.category === "유네스코");
}
