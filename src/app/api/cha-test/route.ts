// 임시 진단 라우트: Vercel(클라우드)에서 문화재청 무인증 OpenAPI(cha.go.kr)에 닿는지 확인.
// 검증 후 삭제 예정.
export const runtime = "nodejs";

export async function GET() {
  const url =
    "https://www.cha.go.kr/cha/SearchKindOpenapiList.do?ccbaCtcd=35&pageUnit=5";
  const started = Date.now();
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 0 },
    });
    const text = await res.text();
    const ms = Date.now() - started;
    const totalCnt = text.match(/<totalCnt>(\d+)<\/totalCnt>/)?.[1] ?? null;
    const names = Array.from(text.matchAll(/<ccbaMnm1><!\[CDATA\[([^\]]*)\]\]><\/ccbaMnm1>/g))
      .slice(0, 5)
      .map((m) => m[1]);
    return Response.json({
      ok: res.ok,
      status: res.status,
      ms,
      totalCnt,
      sample: names,
      len: text.length,
    });
  } catch (e) {
    return Response.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      ms: Date.now() - started,
    });
  }
}
