// 임시 진단: Vercel에서 (1) ENCYKOREA_API_KEY가 런타임에 있는지 (2) devin.aks.ac.kr:8080 도달 가능한지.
export const runtime = "nodejs";

export async function GET() {
  const key = process.env.ENCYKOREA_API_KEY ?? "";
  const started = Date.now();
  try {
    const res = await fetch(
      "https://devin.aks.ac.kr:8080/api/articles/search?q=%EC%9D%B4%ED%99%A9&p=1&ps=2",
      { headers: { "X-API-Key": key, accept: "application/json" } }
    );
    const t = await res.text();
    return Response.json({
      hasKey: key.length > 0,
      keyLen: key.length,
      status: res.status,
      ms: Date.now() - started,
      len: t.length,
      head: t.slice(0, 160),
    });
  } catch (e) {
    return Response.json({
      hasKey: key.length > 0,
      keyLen: key.length,
      error: e instanceof Error ? e.message : String(e),
      ms: Date.now() - started,
    });
  }
}
