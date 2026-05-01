/**
 * 문화재청 국가문화유산포털 API 클라이언트
 * https://www.cha.go.kr/html/HtmlPage.do?pg=/openapi/openApiPage.jsp
 */

const HERITAGE_API_BASE = "http://www.cha.go.kr/cha/SearchKindOpenapiList.do";
const API_KEY = process.env.HERITAGE_API_KEY || "";

interface HeritageSearchParams {
  ccbaKdcd?: string; // 종목코드 (11: 국보, 12: 보물, 13: 사적 등)
  ccbaCtcd?: string; // 시도코드 (37: 경상북도)
  ccbaCpno?: string; // 관리번호
  ccbaMnm1?: string; // 문화재명
  pageUnit?: number;
  pageIndex?: number;
}

export async function searchHeritage(params: HeritageSearchParams) {
  const searchParams = new URLSearchParams({
    ccbaCtcd: params.ccbaCtcd || "37", // 경상북도
    pageUnit: String(params.pageUnit || 10),
    pageIndex: String(params.pageIndex || 1),
  });

  if (params.ccbaKdcd) searchParams.set("ccbaKdcd", params.ccbaKdcd);
  if (params.ccbaCpno) searchParams.set("ccbaCpno", params.ccbaCpno);
  if (params.ccbaMnm1) searchParams.set("ccbaMnm1", params.ccbaMnm1);

  try {
    const response = await fetch(`${HERITAGE_API_BASE}?${searchParams}`, {
      next: { revalidate: 86400 }, // 24시간 캐시
    });

    if (!response.ok) {
      throw new Error(`Heritage API error: ${response.status}`);
    }

    const text = await response.text();
    return parseHeritageXML(text);
  } catch (error) {
    console.error("문화재청 API 호출 실패:", error);
    return null;
  }
}

function parseHeritageXML(xml: string) {
  // 서버사이드에서 간단한 XML 파싱
  const items: Array<{
    sn: string;
    ccbaMnm1: string;
    ccbaCtcdNm: string;
    ccsiName: string;
    ccbaAdmin: string;
    ccbaKdcd: string;
    ccbaAsno: string;
    ccbaCpno: string;
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    items.push({
      sn: extractTag(itemXml, "sn"),
      ccbaMnm1: extractTag(itemXml, "ccbaMnm1"),
      ccbaCtcdNm: extractTag(itemXml, "ccbaCtcdNm"),
      ccsiName: extractTag(itemXml, "ccsiName"),
      ccbaAdmin: extractTag(itemXml, "ccbaAdmin"),
      ccbaKdcd: extractTag(itemXml, "ccbaKdcd"),
      ccbaAsno: extractTag(itemXml, "ccbaAsno"),
      ccbaCpno: extractTag(itemXml, "ccbaCpno"),
    });
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}><!\\[CDATA\\[(.+?)\\]\\]><\\/${tag}>|<${tag}>(.+?)<\\/${tag}>`);
  const match = regex.exec(xml);
  return match ? (match[1] || match[2] || "") : "";
}

/**
 * 문화재 상세정보 조회
 */
export async function getHeritageDetail(ccbaKdcd: string, ccbaAsno: string, ccbaCtcd: string = "37") {
  const params = new URLSearchParams({
    ccbaKdcd,
    ccbaAsno,
    ccbaCtcd,
  });

  try {
    const response = await fetch(
      `http://www.cha.go.kr/cha/SearchKindOpenapiDt.do?${params}`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) throw new Error(`Detail API error: ${response.status}`);

    const text = await response.text();
    return parseDetailXML(text);
  } catch (error) {
    console.error("문화재 상세정보 조회 실패:", error);
    return null;
  }
}

function parseDetailXML(xml: string) {
  return {
    ccbaMnm1: extractTag(xml, "ccbaMnm1"),
    ccbaLcad: extractTag(xml, "ccbaLcad"),
    ccceName: extractTag(xml, "ccceName"),
    ccbaQuan: extractTag(xml, "ccbaQuan"),
    ccbaAsdt: extractTag(xml, "ccbaAsdt"),
    ccbaPoss: extractTag(xml, "ccbaPoss"),
    content: extractTag(xml, "content"),
  };
}
