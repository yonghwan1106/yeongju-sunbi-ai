/**
 * 문화재청(국가유산청) 국가문화유산포털 OpenAPI 클라이언트 — 무인증.
 * https://www.cha.go.kr/cha/SearchKindOpenapiList.do
 *
 * 인증키가 필요 없는 공개 OpenAPI다(기상청·관광공사와 달리 data.go.kr 키 불필요).
 * 명칭(ccbaMnm1) 키워드 + 시도코드(ccbaCtcd, 경북=37)로 실시간 조회한다.
 * Vercel(클라우드)에서도 도달 확인됨(과거 'IP 차단' 메모는 사실이 아니었음).
 * 정규식은 ASCII 태그명만 사용(SWC 한글 regex 버그 회피), 한글은 값으로만 처리.
 */

import { getActiveCity } from "@/config/city";

const CHA_BASE = "https://www.cha.go.kr/cha/SearchKindOpenapiList.do";

export interface OfficialHeritage {
  name: string; // 지정명칭 (ccbaMnm1)
  designation: string; // 종목 (ccmaName: 국보/보물/사적/명승/천연기념물/국가민속문화유산 등)
  city: string; // 시군구 (ccsiName)
  source: string;
}

function tag(block: string, name: string): string {
  const cdata = block.match(new RegExp(`<${name}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${name}>`));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return plain ? plain[1].trim() : "";
}

/**
 * 활성 도시의 공식 지정문화유산을 문화재청에서 실시간 조회.
 * @param keyword 질문에서 추출한 검색어(예: 부석사). 2글자 미만이면 도시명으로 대체.
 */
export async function searchOfficialHeritage(keyword?: string): Promise<{
  found: boolean;
  count: number;
  data: OfficialHeritage[];
  source: string;
  apiUsed: boolean;
}> {
  const city = getActiveCity();
  const ctcd = city.chaCtcd;
  const miss = { found: false, count: 0, data: [] as OfficialHeritage[], source: "문화재청 국가문화유산포털", apiUsed: false };
  if (!ctcd) return miss;

  const kw = keyword && keyword.trim().length > 1 ? keyword.trim() : city.name;
  const params = new URLSearchParams({
    ccbaCtcd: ctcd,
    ccbaMnm1: kw,
    pageUnit: "30",
    pageIndex: "1",
  });

  try {
    const res = await fetch(`${CHA_BASE}?${params}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 }, // 1시간 캐시
    });
    if (!res.ok) throw new Error(`CHA API ${res.status}`);
    const xml = await res.text();

    const blocks = xml.split("<item>").slice(1).map((b) => b.split("</item>")[0]);
    let data: OfficialHeritage[] = blocks
      .map((b) => ({
        name: tag(b, "ccbaMnm1"),
        designation: tag(b, "ccmaName"),
        city: tag(b, "ccsiName"),
        source: "문화재청 국가문화유산포털",
      }))
      .filter((h) => h.name);

    // 도시명으로 한번 더 좁히기(타 시군 동명 유산 혼입 방지)
    const cityName = city.name;
    const cityFiltered = data.filter((h) => h.city.includes(cityName) || h.name.includes(cityName));
    if (cityFiltered.length > 0) data = cityFiltered;

    // 키워드 결과가 비었으면 도시명으로 재시도(대표 지정문화유산 목록)
    if (data.length === 0 && kw !== cityName) {
      return searchOfficialHeritage(cityName);
    }

    return {
      found: data.length > 0,
      count: data.length,
      data: data.slice(0, 15),
      source: "문화재청 국가문화유산포털 (실시간 조회)",
      apiUsed: true,
    };
  } catch (e) {
    console.error("문화재청 API 호출 실패:", e);
    return miss;
  }
}
