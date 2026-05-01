/**
 * 한국관광공사 TourAPI 4.0 클라이언트
 * https://api.visitkorea.or.kr/
 */

const TOUR_API_BASE = "https://apis.data.go.kr/B551011/KorService1";
const API_KEY = process.env.TOUR_API_KEY || "";

interface TourSearchParams {
  keyword?: string;
  contentTypeId?: string; // 12: 관광지, 14: 문화시설, 15: 축제, 32: 숙박, 39: 음식점
  areaCode?: string; // 35: 경상북도
  sigunguCode?: string; // 영주시 코드
  pageNo?: number;
  numOfRows?: number;
}

export async function searchTourSpots(params: TourSearchParams) {
  const searchParams = new URLSearchParams({
    serviceKey: API_KEY,
    MobileOS: "ETC",
    MobileApp: "YeongjuSunbiAI",
    _type: "json",
    areaCode: params.areaCode || "35", // 경상북도
    numOfRows: String(params.numOfRows || 20),
    pageNo: String(params.pageNo || 1),
  });

  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.contentTypeId) searchParams.set("contentTypeId", params.contentTypeId);
  if (params.sigunguCode) searchParams.set("sigunguCode", params.sigunguCode);

  const endpoint = params.keyword ? "searchKeyword1" : "areaBasedList1";

  try {
    const response = await fetch(`${TOUR_API_BASE}/${endpoint}?${searchParams}`, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      throw new Error(`Tour API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response?.body?.items?.item || [];
  } catch (error) {
    console.error("관광공사 API 호출 실패:", error);
    return [];
  }
}

/**
 * 관광지 상세정보 조회
 */
export async function getTourDetail(contentId: string, contentTypeId: string = "12") {
  const params = new URLSearchParams({
    serviceKey: API_KEY,
    MobileOS: "ETC",
    MobileApp: "YeongjuSunbiAI",
    _type: "json",
    contentId,
    contentTypeId,
    defaultYN: "Y",
    firstImageYN: "Y",
    addrinfoYN: "Y",
    overviewYN: "Y",
  });

  try {
    const response = await fetch(`${TOUR_API_BASE}/detailCommon1?${params}`, {
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

/**
 * 영주시 행사/축제 조회
 */
export async function getYeongjuEvents() {
  return searchTourSpots({
    contentTypeId: "15", // 축제/행사
    areaCode: "35",
  });
}

/**
 * 영주시 음식점 조회
 */
export async function getYeongjuRestaurants() {
  return searchTourSpots({
    contentTypeId: "39", // 음식점
    areaCode: "35",
  });
}
