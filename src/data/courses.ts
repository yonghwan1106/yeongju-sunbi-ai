import { CourseRecommendation, Heritage } from "@/types";
import { heritageData } from "@/data/heritage";

function getSpots(ids: string[]): Heritage[] {
  return ids
    .map((id) => heritageData.find((h) => h.id === id))
    .filter((h): h is Heritage => h !== undefined);
}

export const coursesData: CourseRecommendation[] = [
  {
    id: "unesco-day",
    name: "유네스코 반나절 코스",
    duration: "당일치기 (4시간)",
    theme: "역사탐방",
    spots: getSpots(["buseoksa", "sosuseowon", "sosu-museum"]),
    description:
      "영주가 자랑하는 두 곳의 유네스코 세계유산을 하루 만에 압축적으로 만나는 코스입니다. 오전에는 신라 의상대사가 창건한 부석사에서 무량수전과 배흘림기둥이 빚어내는 1300년의 건축 미학을 음미하고, 점심 이후에는 한국 최초의 사액서원인 소수서원으로 이동해 안향·주세붕·퇴계 이황으로 이어지는 영남 성리학의 학맥을 따라가 봅니다. 마지막 한 시간은 인근 소수박물관에서 영주·순흥에서 출토된 유물과 사대부 생활 도구를 정리하며 하루의 학습을 마무리합니다. 시간이 짧은 외국인 단체나 학습형 가족 여행에 최적의 코스입니다.",
    season: ["봄", "가을"],
    highlights: [
      "부석사 무량수전에서 한국 최고(最古) 목조건축 감상",
      "소수서원 죽계천 '경(敬)' 자 암각으로 보는 유학 정신",
      "소수박물관에서 영남 성리학 학맥 한눈에 정리",
      "두 개의 유네스코 세계유산을 한 권의 PASS 티켓으로",
    ],
    transport: "영주역 도착 후 시내버스 27번 또는 택시 약 30분",
  },
  {
    id: "sunbi-overnight",
    name: "선비정신 1박2일",
    duration: "1박 2일",
    theme: "선비체험",
    spots: getSpots(["sosuseowon", "sunbichon", "museom", "yeongju-hyanggyo"]),
    description:
      "조선 사대부의 일상에 직접 들어가 보는 한국형 슬로우 트래블 코스입니다. 첫째 날 오전 소수서원에서 한국 최초의 서원이 어떻게 사림(士林)의 강학 공간으로 기능했는지 살펴보고, 오후에는 길 건너 선비촌에서 양반·중인·서민 가옥을 둘러본 뒤 한옥에서 1박을 보냅니다. 새벽 한지 창호로 스며드는 햇살, 누마루의 차 한 잔이 잊지 못할 기억으로 남습니다. 둘째 날에는 내성천이 마을을 휘감는 무섬마을에서 외나무다리를 건너고, 영주향교 명륜당 마당의 400년 은행나무 아래에서 석전대제의 흔적을 더듬어 보며 여정을 마칩니다.",
    season: ["봄", "가을", "겨울"],
    highlights: [
      "선비촌 한옥 1박 — 누마루·사랑채·안채 공간 위계 체험",
      "소수서원 죽계천에서 보는 안향·퇴계의 학문 정신",
      "무섬마을 외나무다리에서 만나는 한국 농촌 원풍경",
      "영주향교 명륜당 400년 은행나무와 석전대제 이야기",
    ],
    transport: "영주역에서 선비촌 직행 셔틀 또는 시내버스 27·55번",
  },
  {
    id: "family-weekend",
    name: "가족 나들이 2박3일",
    duration: "2박 3일",
    theme: "가족나들이",
    spots: getSpots([
      "sobaeksan",
      "museom",
      "sunbichon",
      "punggi-ginseng",
      "buseoksa",
    ]),
    description:
      "어린이가 지루해지기 전에 자연·놀이·전통·체험을 골고루 섞은 가족 친화형 코스입니다. 1일 차에는 소백산 자락에서 짧은 트레킹과 야생화 산책을 즐긴 뒤 무섬마을로 이동해 외나무다리를 건너며 사진을 남깁니다. 2일 차는 선비촌에서 한복을 입고 전통 예절·서예·다도를 체험하고, 오후에는 풍기인삼박물관에서 600년 인삼 농사 이야기와 인삼 캐기 체험으로 아이들의 호기심을 자극합니다. 마지막 날 오전에는 부석사 무량수전 앞마당에서 한국 10대 절경으로 꼽히는 풍경을 바라보며 여행을 마무리합니다. 어른은 깊이를, 아이는 재미를 가져갑니다.",
    season: ["봄", "여름", "가을"],
    highlights: [
      "소백산 비로봉 자락 가족 트레킹(2시간) + 야생화 관찰",
      "선비촌 한복·서예·다도 패키지 체험",
      "풍기인삼박물관 인삼 캐기 체험 (9월 인삼축제 추천)",
      "부석사 무량수전 석양 — 어른·아이 모두 잊지 못할 마무리",
    ],
    transport: "영주역 렌터카 또는 시티투어 버스(주말 운행) 추천",
  },
];

export function getCourseById(id: string): CourseRecommendation | undefined {
  return coursesData.find((c) => c.id === id);
}

export function findCuratedCourse(opts: {
  duration?: string;
  theme?: string;
}): CourseRecommendation | undefined {
  const { duration, theme } = opts;

  const durationMap: Record<string, string> = {
    반나절: "unesco-day",
    당일: "unesco-day",
    당일치기: "unesco-day",
    하루: "unesco-day",
    "1박2일": "sunbi-overnight",
    "1박 2일": "sunbi-overnight",
    "2박3일": "family-weekend",
    "2박 3일": "family-weekend",
  };

  const themeMap: Record<string, string> = {
    역사탐방: "unesco-day",
    건축감상: "unesco-day",
    선비체험: "sunbi-overnight",
    자연힐링: "family-weekend",
    가족나들이: "family-weekend",
  };

  if (duration) {
    const id = durationMap[duration.trim()];
    if (id) return getCourseById(id);
  }

  if (theme) {
    const id = themeMap[theme.trim()];
    if (id) return getCourseById(id);
  }

  return undefined;
}
