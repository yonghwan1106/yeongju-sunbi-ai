import { CourseRecommendation, Heritage } from "@/types";
import { andongHeritageData } from "@/data/andong/heritage";

function getSpots(ids: string[]): Heritage[] {
  return ids
    .map((id) => andongHeritageData.find((h) => h.id === id))
    .filter((h): h is Heritage => h !== undefined);
}

export const andongCoursesData: CourseRecommendation[] = [
  {
    id: "andong-seowon-day",
    name: "안동 서원 성리학 하루",
    duration: "당일치기 (6시간)",
    theme: "역사탐방",
    spots: getSpots(["dosanseowon", "byeongsanseowon", "hoeemaul"]),
    description:
      "퇴계 이황과 류성룡의 자취를 따라 유네스코 세계유산 서원 2곳과 하회마을을 하루에 돌아보는 코스입니다. 오전에 도산서원에서 이황의 학문 정신을 느끼고, 점심 후 병산서원 만대루에서 낙동강 절경을 감상한 뒤, 오후에 하회마을에서 살아있는 선비 문화와 탈놀이를 경험합니다. 영남 성리학의 두 거인이 남긴 유산을 하루 동안 압축적으로 만나는 심화 코스입니다.",
    season: ["봄", "가을"],
    highlights: [
      "도산서원 시사단 — 조선 과거시험이 열리던 유서 깊은 터",
      "병산서원 만대루 — 낙동강을 액자처럼 담아내는 절경",
      "하회마을 하회별신굿탈놀이 상설 공연",
      "유네스코 서원 2곳 + 역사마을 1곳, 하루에 완성",
    ],
    transport: "안동역에서 도산서원행 버스(67번) 또는 렌터카 추천",
  },
  {
    id: "andong-world-heritage",
    name: "안동 세계유산 코스",
    duration: "1박 2일",
    theme: "가족나들이",
    spots: getSpots(["bongjeongsa", "hoeemaul", "wolyeonggyo"]),
    description:
      "유네스코 등재 세계유산과 야경 명소를 아우르는 가족 친화형 코스입니다. 첫째 날 오전 봉정사에서 현존 최고(最古) 목조건축 극락전을 감상하고, 오후에 하회마을에서 전통 가옥과 탈놀이를 체험합니다. 저녁에는 안동시내에서 찜닭을 즐기고, 해가 지면 월영교로 이동해 안동호 야경과 달빛 반영을 감상합니다. 둘째 날에는 도산서원을 여유롭게 탐방하며 여정을 마무리합니다.",
    season: ["봄", "여름", "가을"],
    highlights: [
      "봉정사 극락전 — 고려 시대 목조건축의 정수",
      "하회마을 탈놀이 체험 + 고택 산책",
      "월영교 야경 — 국내 최장 목책 인도교의 밤 풍경",
      "안동찜닭 + 간고등어 안동 대표 음식 체험",
    ],
    transport: "안동역에서 시내버스 또는 렌터카, 봉정사↔하회 택시 20분",
  },
];
