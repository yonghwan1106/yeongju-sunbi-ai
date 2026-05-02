/**
 * 국립중앙박물관 e-Museum API 클라이언트
 * 공식 엔드포인트: https://www.emuseum.go.kr/openapi/relicSearchList
 * API 키 없을 경우 영주 관련 정적 폴백 데이터 반환
 */

export interface MuseumRelic {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  period: string;
  material: string;
  size: string;
  description: string;
  location: string;
  relatedPlace: string;
  source: string;
}

const MUSEUM_API_BASE = "https://www.emuseum.go.kr/openapi/relicSearchList";

/** 영주 관련 주요 유물 정적 폴백 데이터 5건 */
const STATIC_YEONGJU_RELICS: MuseumRelic[] = [
  {
    id: "museum-001",
    name: "안향 초상",
    nameEn: "Portrait of An Hyang",
    category: "회화",
    period: "고려 후기 (1277년 추정)",
    material: "비단에 채색",
    size: "세로 37.0cm, 가로 29.0cm",
    description:
      "고려의 대표적 유학자 안향(安珦, 1243~1306)의 초상화. 주자학을 처음 우리나라에 도입한 인물로, 소수서원에 배향되어 있다. 현재 소수서원 내 영정각에 보관된 원본은 국보로 지정되어 있으며, 국립중앙박물관에도 관련 자료가 소장되어 있다.",
    location: "국립중앙박물관 서화실",
    relatedPlace: "영주 소수서원",
    source: "국립중앙박물관 e-Museum",
  },
  {
    id: "museum-002",
    name: "의상대사 진영",
    nameEn: "Portrait of Buddhist Monk Uisang",
    category: "불교회화",
    period: "조선 후기",
    material: "삼베에 채색",
    size: "세로 118.0cm, 가로 78.5cm",
    description:
      "신라의 고승 의상대사(義湘, 625~702)의 진영. 부석사를 창건한 화엄종의 개조(開祖)로, 당나라에서 귀국 후 676년 영주 부석사를 창건하였다. 선묘 용녀의 전설과 함께 부석사의 창건 역사를 상징하는 인물이다.",
    location: "국립중앙박물관 불교미술실",
    relatedPlace: "영주 부석사",
    source: "국립중앙박물관 e-Museum",
  },
  {
    id: "museum-003",
    name: "부석사 소조여래좌상",
    nameEn: "Clay Seated Buddha from Buseoksa Temple",
    category: "불교조각",
    period: "통일신라",
    material: "소조(塑造, 흙으로 빚음)",
    size: "높이 278.0cm",
    description:
      "영주 부석사 무량수전에 봉안된 소조아미타여래좌상. 국보 제45호로 지정된 우리나라 최고(最古)의 소조불상 중 하나다. 9세기 통일신라 시대 작품으로, 온화한 얼굴과 균형 잡힌 비례가 특징이다. 배흘림기둥의 무량수전과 함께 한국 고건축·불교미술의 정수로 손꼽힌다.",
    location: "부석사 무량수전 (국립중앙박물관 자료 소장)",
    relatedPlace: "영주 부석사 무량수전",
    source: "국립중앙박물관 e-Museum",
  },
  {
    id: "museum-004",
    name: "소수서원 강학당 현판",
    nameEn: "Lecture Hall Signboard of Sosuseowon Academy",
    category: "목공예·현판",
    period: "조선 중기 (16세기)",
    material: "목재에 묵서",
    size: "가로 240.0cm, 세로 80.0cm",
    description:
      "한국 최초의 서원인 소수서원의 강학당(講學堂) 현판. 1543년 풍기군수 주세붕이 창설하고, 1550년 퇴계 이황이 '소수(紹修)'라는 사액을 받아 사액서원이 되었다. '소수'는 '무너진 교학을 다시 이어 닦는다'는 뜻으로, 조선 성리학의 부흥을 상징한다.",
    location: "소수서원 강학당 (국립중앙박물관 탁본 소장)",
    relatedPlace: "영주 소수서원",
    source: "국립중앙박물관 e-Museum",
  },
  {
    id: "museum-005",
    name: "죽령 고개 옛길 도자기 유물",
    nameEn: "Ceramics from the Ancient Jungnyeong Pass Road",
    category: "도자기",
    period: "고려~조선",
    material: "청자·분청사기·백자",
    size: "다양 (조각 포함)",
    description:
      "죽령 옛길 일대 발굴 조사에서 출토된 도자기류. 죽령은 삼국시대부터 영남과 기호 지방을 잇는 주요 교통로로, 신라·고려·조선 시대를 거쳐 수많은 물자와 문화가 오간 길이다. 출토 도자기를 통해 각 시대 무역·교역의 흔적을 확인할 수 있다.",
    location: "국립중앙박물관 고고역사관",
    relatedPlace: "영주 죽령 옛길",
    source: "국립중앙박물관 e-Museum",
  },
];

interface MuseumApiResponse {
  result?: Array<{
    relicName?: string;
    relicNameEn?: string;
    categoryName?: string;
    era?: string;
    material?: string;
    size?: string;
    description?: string;
    museumName?: string;
  }>;
}

/**
 * 영주 관련 박물관 유물 검색
 * MUSEUM_API_KEY 환경변수가 있으면 실제 API 호출, 없으면 정적 데이터 반환
 */
export async function searchYeongjuRelics(keyword?: string): Promise<{
  found: boolean;
  count: number;
  data: MuseumRelic[];
  source: string;
  apiUsed: boolean;
}> {
  const apiKey = process.env.MUSEUM_API_KEY;

  if (apiKey) {
    try {
      const params = new URLSearchParams({
        serviceKey: apiKey,
        keyword: keyword || "영주",
        pageNo: "1",
        numOfRows: "10",
        type: "json",
      });

      const response = await fetch(`${MUSEUM_API_BASE}?${params}`, {
        next: { revalidate: 86400 },
      });

      if (!response.ok) {
        throw new Error(`Museum API error: ${response.status}`);
      }

      const json: MuseumApiResponse = await response.json();
      const items = json.result ?? [];

      if (items.length > 0) {
        const data: MuseumRelic[] = items.map((item, idx) => ({
          id: `museum-api-${idx}`,
          name: item.relicName ?? "",
          nameEn: item.relicNameEn ?? "",
          category: item.categoryName ?? "",
          period: item.era ?? "",
          material: item.material ?? "",
          size: item.size ?? "",
          description: item.description ?? "",
          location: item.museumName ?? "국립중앙박물관",
          relatedPlace: "영주",
          source: "국립중앙박물관 e-Museum",
        }));

        return { found: true, count: data.length, data, source: "국립중앙박물관 e-Museum (API)", apiUsed: true };
      }
    } catch (error) {
      console.error("국립중앙박물관 API 호출 실패, 정적 데이터로 폴백:", error);
    }
  }

  // 정적 폴백 데이터 — 키워드 필터링
  let results = [...STATIC_YEONGJU_RELICS];
  if (keyword) {
    const kw = keyword.toLowerCase();
    const filtered = results.filter(
      (r) =>
        r.name.toLowerCase().includes(kw) ||
        r.description.toLowerCase().includes(kw) ||
        r.category.toLowerCase().includes(kw) ||
        r.relatedPlace.toLowerCase().includes(kw) ||
        r.period.toLowerCase().includes(kw)
    );
    if (filtered.length > 0) results = filtered;
  }

  return {
    found: results.length > 0,
    count: results.length,
    data: results,
    source: "국립중앙박물관 e-Museum (정적 데이터)",
    apiUsed: false,
  };
}
