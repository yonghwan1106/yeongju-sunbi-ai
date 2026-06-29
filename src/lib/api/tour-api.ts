/**
 * 한국관광공사 TourAPI 4.0 클라이언트 (KorService2)
 * https://api.visitkorea.or.kr/
 *
 * 주의(과거 버그 수정):
 *  - KorService1은 종료되어 HTTP 500을 반환 → KorService2로 전환.
 *  - 도시 스코핑: areaCode + sigunguCode(영주 14 / 안동 11)로 해당 시 결과만.
 *  - "맛집/숙박/축제" 같은 카테고리 단어는 검색 키워드가 아니라 contentTypeId로
 *    매핑해 areaBasedList2로 브라우즈해야 결과가 나온다(키워드 검색은 제목 매칭이라 빈약).
 */

import { getActiveCity } from "@/config/city";

const TOUR_API_BASE = "https://apis.data.go.kr/B551011/KorService2";
const API_KEY = process.env.TOUR_API_KEY || "";

interface TourSearchParams {
  keyword?: string;
  contentTypeId?: string; // 12: 관광지, 14: 문화시설, 15: 축제, 32: 숙박, 39: 음식점
  areaCode?: string;
  sigunguCode?: string;
  pageNo?: number;
  numOfRows?: number;
}

// 카테고리 단어 → contentTypeId (키워드 오용 방지)
const CATEGORY_WORDS: Record<string, string> = {
  맛집: "39", 음식: "39", 식당: "39", 먹거리: "39", 한식: "39", 한우: "39",
  숙박: "32", 숙소: "32", 호텔: "32", 펜션: "32", 한옥: "32",
  축제: "15", 행사: "15",
  관광지: "12", 명소: "12", 볼거리: "12", 가볼만한곳: "12",
  문화시설: "14", 박물관: "14",
};

export async function searchTourSpots(params: TourSearchParams) {
  const city = getActiveCity();

  let contentTypeId = params.contentTypeId;
  let keyword = params.keyword?.trim();

  // 키워드가 카테고리 단어를 포함하면 contentTypeId로 승격하고 키워드는 비움
  if (!contentTypeId && keyword) {
    const hit = Object.keys(CATEGORY_WORDS).find((w) => keyword!.includes(w));
    if (hit) {
      contentTypeId = CATEGORY_WORDS[hit];
      keyword = undefined;
    }
  }

  // contentTypeId(카테고리)가 있으면 areaBasedList2로 브라우즈, 아니면 키워드 검색
  const useKeyword = !contentTypeId && !!keyword;
  const endpoint = useKeyword ? "searchKeyword2" : "areaBasedList2";

  const searchParams = new URLSearchParams({
    serviceKey: API_KEY,
    MobileOS: "ETC",
    MobileApp: city.tourMobileApp,
    _type: "json",
    areaCode: params.areaCode || city.areaCode,
    numOfRows: String(params.numOfRows || 15),
    pageNo: String(params.pageNo || 1),
  });

  const sigungu = params.sigunguCode || city.sigunguCode;
  if (sigungu) searchParams.set("sigunguCode", sigungu);
  if (contentTypeId) searchParams.set("contentTypeId", contentTypeId);
  if (useKeyword && keyword) searchParams.set("keyword", keyword);

  try {
    const response = await fetch(`${TOUR_API_BASE}/${endpoint}?${searchParams}`, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });
    if (!response.ok) throw new Error(`Tour API error: ${response.status}`);

    const data = await response.json();
    const items = data.response?.body?.items?.item;
    return Array.isArray(items) ? items : items ? [items] : [];
  } catch (error) {
    console.error("관광공사 API 호출 실패:", error);
    return [];
  }
}

/** 관광지 상세정보 조회 */
export async function getTourDetail(contentId: string, contentTypeId: string = "12") {
  const params = new URLSearchParams({
    serviceKey: API_KEY,
    MobileOS: "ETC",
    MobileApp: getActiveCity().tourMobileApp,
    _type: "json",
    contentId,
    contentTypeId,
    defaultYN: "Y",
    firstImageYN: "Y",
    addrinfoYN: "Y",
    overviewYN: "Y",
  });

  try {
    const response = await fetch(`${TOUR_API_BASE}/detailCommon2?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Tour Detail API error: ${response.status}`);

    const data = await response.json();
    return data.response?.body?.items?.item?.[0] || null;
  } catch (error) {
    console.error("관광 상세정보 조회 실패:", error);
    return null;
  }
}

/** 활성 도시 행사/축제 조회 */
export async function getYeongjuEvents() {
  return searchTourSpots({ contentTypeId: "15" });
}

/** 활성 도시 음식점 조회 */
export async function getYeongjuRestaurants() {
  return searchTourSpots({ contentTypeId: "39" });
}
