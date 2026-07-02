"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getActiveCity } from "@/config/city";
import { t } from "@/i18n/ui";

const city = getActiveCity();

interface Theme {
  name: string;
  count: number;
  example: string;
}

interface InsightsData {
  ok: boolean;
  configured: boolean;
  count: number;
  themes: Theme[];
  unmetNeeds: string[];
  summary: string;
  samples: string[];
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl">
        📡
      </div>
      <p className="text-[var(--color-ink)] font-semibold text-lg">
        {t("아직 분석할 질문이 충분치 않습니다")}
      </p>
      <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
        {t("사용자가 AI 해설사에게 질문할수록")}
        <br />
        {t("{city}시 관광 수요 인사이트가 쌓입니다.")}
      </p>
    </div>
  );
}

function SummaryCard({ summary, onDetail }: { summary: string; onDetail: () => void }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
        {t("정책 담당자 요약")}
      </p>
      <p className="text-[var(--color-ink)] text-sm leading-relaxed">{summary}</p>
      <button
        onClick={onDetail}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-semibold px-4 py-2.5 transition-colors active:scale-[0.98]"
      >
        {t("상세보기 — 지자체 담당자용 심층 리포트")}
        <ArrowRight size={15} strokeWidth={2.2} />
      </button>
      <p className="mt-2 text-[11px] text-amber-700/80 leading-relaxed">
        {t("Claude Sonnet 5가 수요 신호 해석 · 우선순위 정책 제언 · 성과지표(KPI)를 생성합니다.")}
      </p>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 px-5 py-4 flex flex-col gap-1 shadow-sm">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/insights?city=${city.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: InsightsData = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleDetail() {
    if (!data) return;
    try {
      sessionStorage.setItem(`insights:base:${city.id}`, JSON.stringify(data));
    } catch {
      /* sessionStorage 불가 시 무시 — 리포트 페이지가 DB에서 직접 조회 */
    }
    router.push("/insights/report");
  }

  const hasData = data && data.count > 0;

  return (
    <main className="min-h-screen bg-[var(--color-cream)] pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-4">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {t("관광 인사이트 리포트 · 익명 질문 기반 · 개인정보 미수집")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            {t("{city} 관광")}
            <br />
            {t("수요 인사이트")}
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">
            {t("문화재청·한국관광공사·기상청·국립중앙박물관·한국민족문화대백과 등")}
            <br />
            {t("분산된 5종 국가 공공데이터를 통합·해석한 관광 수요신호입니다.")}
            <br />
            {t("AI 해설사에 누적된 익명 질문을 Claude로 분석합니다.")}
          </p>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-2 w-fit px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {t("분석 중…")}
              </>
            ) : (
              t("리포트 생성")
            )}
          </button>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 pt-8 flex flex-col gap-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {t("분석 실패: ")}{error}
          </div>
        )}

        {!data && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <p className="text-stone-400 text-sm">
              {t("[리포트 생성] 버튼을 눌러 관광 수요 인사이트를 확인하세요.")}
            </p>
          </div>
        )}

        {data && !hasData && <EmptyState />}

        {hasData && (
          <>
            {/* ── 요약 통계 ── */}
            <section>
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
                {t("분석 개요")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatPill label={t("분석 질문 수")} value={data.count.toLocaleString("ko-KR")} />
                <StatPill label={t("주제 군집")} value={data.themes.length} />
                <StatPill label={t("미충족 수요")} value={data.unmetNeeds.length} />
              </div>
            </section>

            {/* ── 정책 요약 ── */}
            {data.summary && <SummaryCard summary={data.summary} onDetail={handleDetail} />}

            {/* ── 주제 군집 BarChart ── */}
            {data.themes.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
                  {t("주제별 질문 분포")}
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={data.themes}
                    margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#78716c" }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-18}
                      textAnchor="end"
                      height={48}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#78716c" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e7e5e4",
                        fontSize: 12,
                      }}
                      formatter={(v) => [`${Number(v ?? 0)}${t("건(추정)")}`, t("질문 수")]}
                      labelFormatter={(label) => {
                        const thm = data.themes.find((thm) => thm.name === label);
                        return thm ? `${label}\n${t("예시: ")}${thm.example}` : label;
                      }}
                    />
                    <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} maxBarSize={56} />
                  </BarChart>
                </ResponsiveContainer>

                {/* 주제별 예시 질문 */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.themes.map((thm) => (
                    <div
                      key={thm.name}
                      className="bg-stone-50 rounded-xl px-3 py-2.5 flex gap-2 items-start"
                    >
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-ink)]">{thm.name}</p>
                        <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                          &ldquo;{thm.example}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── 미충족 수요 ── */}
            {data.unmetNeeds.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
                  {t("미충족 수요 — 관광 정보 보완 필요 항목")}
                </h2>
                <ul className="flex flex-col gap-3">
                  {data.unmetNeeds.map((need, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-[var(--color-ink)] leading-relaxed">{need}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── 분석 샘플 질문 ── */}
            {data.samples.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
                  {t("최근 질문 샘플 (익명, 상위 5개)")}
                </h2>
                <ul className="flex flex-col gap-2">
                  {data.samples.map((q, i) => (
                    <li
                      key={i}
                      className="text-sm text-[var(--color-charcoal)] bg-stone-50 rounded-xl px-4 py-2.5"
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
