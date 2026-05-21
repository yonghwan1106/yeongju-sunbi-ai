export interface CanonicalQA {
  id: string;
  matchPatterns: string[]; // lowercased substrings; if any appears in normalized user input → match
  question: string;        // the canonical surface form
  answer: string;          // pre-written 200-400 char Korean answer in scholarly tone
  citations: { name: string; url?: string }[]; // 2-3 sources
}

export const canonicalQAs: CanonicalQA[] = [
  {
    id: "buseoksa-entasis",
    matchPatterns: ["배흘림기둥", "무량수전 기둥", "엔타시스"],
    question: "부석사 무량수전의 배흘림기둥은 왜 특별한가요?",
    answer:
      "배흘림기둥은 기둥 중간부가 상·하단보다 볼록하게 튀어나온 엔타시스(entasis) 기법으로 제작되어, 시각적 착시를 보정하고 하중을 분산시키는 구조미를 동시에 구현합니다. 부석사 무량수전(국보 제18호)은 고려 중기 목조 건축의 최고봉으로, 이 기법은 고대 그리스 파르테논 신전에서도 동일하게 발견되어 동서양 건축 지혜의 합일로 평가받습니다. 유네스코 세계유산 '한국의 산사'에 등재된 부석사의 무량수전은 현존 최고(最古) 목조 건물 중 하나로, 배흘림기둥은 그 정수를 상징합니다.",
    citations: [
      { name: "문화재청 국가문화유산포털", url: "https://www.heritage.go.kr" },
      { name: "국립중앙박물관 e-Museum", url: "https://www.emuseum.go.kr" },
      { name: "한국학중앙연구원 한국민족문화대백과사전", url: "https://encykorea.aks.ac.kr" },
    ],
  },
  {
    id: "sosu-first-academy",
    matchPatterns: ["최초의 서원", "한국 최초의 서원", "사액서원"],
    question: "소수서원이 한국 최초의 서원인 이유는?",
    answer:
      "소수서원은 1543년 풍기군수 주세붕이 고려 성리학자 안향을 배향하기 위해 '백운동서원'으로 창건한 조선 최초의 서원입니다. 1550년 풍기군수로 부임한 퇴계 이황이 조정에 사액을 건의하여 명종으로부터 '소수(紹修)'라는 편액을 하사받아, 국가 공인 사액서원 제1호가 되었습니다. 이후 소수서원은 성리학 보급의 거점이자 서원 제도의 표준 모델로 기능하며, 2019년 유네스코 세계유산 '한국의 서원'으로 등재되었습니다.",
    citations: [
      { name: "문화재청 국가문화유산포털", url: "https://www.heritage.go.kr" },
      { name: "한국학중앙연구원 한국민족문화대백과사전", url: "https://encykorea.aks.ac.kr" },
      { name: "유네스코 세계유산 한국의 서원", url: "https://whc.unesco.org/en/list/1498" },
    ],
  },
  {
    id: "yeongju-sunbi-culture",
    matchPatterns: ["선비문화", "영주 선비"],
    question: "영주의 선비문화란 무엇인가요?",
    answer:
      "영주는 안향이 원나라에서 성리학을 도입하고, 주세붕이 백운동서원을 세워 서원 제도를 정착시켰으며, 퇴계 이황으로 학맥이 이어진 한국 선비정신의 발상지입니다. 선비정신이란 의리·청렴·학문 정진·처사적 삶의 가치를 체화한 지식인 문화로, 영주는 이를 가장 순도 높게 계승한 고장으로 평가받습니다. 현재 선비촌 한옥 체험마을, 소수서원, 향교 등이 이 정신을 구현하며, '영주선비문화축제'를 통해 매년 계승·발전되고 있습니다.",
    citations: [
      { name: "한국학중앙연구원 한국민족문화대백과사전", url: "https://encykorea.aks.ac.kr" },
      { name: "영주시 문화관광", url: "https://www.yeongju.go.kr/open_content/tour/page.do?mnu_uid=1240" },
      { name: "문화재청 국가문화유산포털", url: "https://www.heritage.go.kr" },
    ],
  },
  {
    id: "museom-bridge",
    matchPatterns: ["외나무다리", "무섬마을 다리", "무섬 다리"],
    question: "무섬마을 외나무다리의 역사가 궁금해요",
    answer:
      "무섬마을 외나무다리는 삼면이 내성천으로 둘러싸인 수도리 마을과 외부를 잇던 350년 이상의 유일한 통로였습니다. 해마다 봄이면 자작나무 통나무를 엮어 새로 놓았으며, 마을 혼례·장례·등교길 모두 이 다리 하나에 의존했습니다. 1979년 콘크리트 교량 건설로 사라졌다가 2005년 향토 문화 보존 차원에서 복원되었고, 현재는 매년 10월 '무섬 외나무다리 축제'의 상징으로 자리잡아 전국적 명소가 되었습니다.",
    citations: [
      { name: "문화재청 국가문화유산포털", url: "https://www.heritage.go.kr" },
      { name: "영주시 문화관광", url: "https://www.yeongju.go.kr/open_content/tour/page.do?mnu_uid=1240" },
      { name: "한국학중앙연구원 한국민족문화대백과사전", url: "https://encykorea.aks.ac.kr" },
    ],
  },
  {
    id: "buseoksa-sosu-day",
    matchPatterns: ["부석사와 소수서원", "두 곳 하루", "유네스코 하루"],
    question: "부석사와 소수서원 하루 코스 추천해 주세요",
    answer:
      "오전 9시 부석사 출발을 권장합니다. 무량수전·조사당·선묘각 순으로 탐방하고, 가을에는 천 년 은행나무 단풍과 일몰 전망이 압권입니다. 점심은 부석사 아래 순흥한우 또는 영주역 인근 식당가를 이용하세요. 오후 2시 소수서원으로 이동(차량 25분)하여 강학당·문성공묘·취한대 자연암각·죽계천 산책로를 둘러보고, 인접한 영주선비촌까지 연계하면 알찬 하루가 완성됩니다. 2026년 기준 통합권(부석사+소수서원+선비촌) 할인 적용이 가능합니다.",
    citations: [
      { name: "문화재청 국가문화유산포털", url: "https://www.heritage.go.kr" },
      { name: "영주시 문화관광", url: "https://www.yeongju.go.kr/open_content/tour/page.do?mnu_uid=1240" },
      { name: "유네스코 세계유산 한국의 산사·서원", url: "https://whc.unesco.org" },
    ],
  },
];

export function findCanonicalAnswer(userInput: string): CanonicalQA | null {
  const normalized = userInput.toLowerCase().replace(/\s+/g, " ").trim();
  for (const qa of canonicalQAs) {
    for (const pattern of qa.matchPatterns) {
      if (normalized.includes(pattern.toLowerCase())) {
        return qa;
      }
    }
  }
  return null;
}
