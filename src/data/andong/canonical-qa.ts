import { CanonicalQA } from "@/data/canonical-qa";

export const andongCanonicalQAs: CanonicalQA[] = [
  {
    id: "andong-dosanseowon-founder",
    matchPatterns: ["도산서원 누가", "도산서원 창건", "도산서원 설립"],
    question: "도산서원은 누가 세웠나요?",
    answer:
      "도산서원은 퇴계 이황(1501~1570)의 학덕을 기리기 위해 세워진 서원입니다. 이황은 생전인 1561년 도산서당을 짓고 제자들을 가르쳤으며, 그의 사후인 1574년 문인들이 서원으로 확장하였습니다. 선조 임금이 '도산(陶山)'이라는 사액을 내려 국가 공인 서원이 되었고, 2019년 유네스코 세계유산 '한국의 서원'으로 등재되었습니다. 이황은 영주 소수서원 사액을 이끈 인연도 있어, 영주·안동 영남 학맥의 정신적 기둥으로 평가받습니다.",
    citations: [
      { name: "문화재청 국가문화유산포털", url: "https://www.heritage.go.kr" },
      { name: "한국학중앙연구원 한국민족문화대백과사전", url: "https://encykorea.aks.ac.kr" },
      { name: "유네스코 세계유산 한국의 서원", url: "https://whc.unesco.org/en/list/1498" },
    ],
  },
  {
    id: "andong-hahoe-feature",
    matchPatterns: ["하회마을 특징", "하회마을 유네스코", "하회마을 낙동강"],
    question: "하회마을의 특징과 유네스코 등재 이유는?",
    answer:
      "하회마을은 낙동강이 S자로 마을을 완전히 감싸 도는 독특한 지형 위에 자리한 풍산 류씨 집성촌입니다. '하회(河回)'라는 이름 자체가 '강이 돌아간다'는 뜻입니다. 조선시대 사대부 가옥이 원형대로 보존되고, 하회탈(국보 제121호)을 이용한 하회별신굿탈놀이(국가무형문화재)가 지금도 전승되어 살아있는 민속 문화의 현장으로 평가됩니다. 2010년 경주 양동마을과 함께 유네스코 세계유산 '한국의 역사마을'로 등재되었습니다.",
    citations: [
      { name: "문화재청 국가문화유산포털", url: "https://www.heritage.go.kr" },
      { name: "유네스코 세계유산 한국의 역사마을", url: "https://whc.unesco.org/en/list/1324" },
      { name: "한국학중앙연구원 한국민족문화대백과사전", url: "https://encykorea.aks.ac.kr" },
    ],
  },
  {
    id: "andong-best-course",
    matchPatterns: ["안동 대표 코스", "안동 여행 추천", "안동 하루"],
    question: "안동의 대표적인 여행 코스를 추천해 주세요",
    answer:
      "오전에는 도산서원을 출발하여 퇴계 이황의 학문 공간을 탐방하세요. 시사단과 열정(이황이 직접 판 우물)도 놓치지 마세요. 점심은 안동 시내에서 안동찜닭이나 안동간고등어를 즐긴 뒤, 하회마을로 이동하여 충효당·양진당 고택과 하회별신굿탈놀이 상설 공연을 감상합니다. 해질 무렵에는 병산서원 만대루에서 낙동강 풍경을 조망하고, 저녁에 월영교 야경으로 하루를 마무리하면 안동의 핵심을 압축적으로 경험할 수 있습니다.",
    citations: [
      { name: "안동시 문화관광", url: "https://www.andong.go.kr/tour" },
      { name: "문화재청 국가문화유산포털", url: "https://www.heritage.go.kr" },
      { name: "한국관광공사", url: "https://www.visitkorea.or.kr" },
    ],
  },
];
