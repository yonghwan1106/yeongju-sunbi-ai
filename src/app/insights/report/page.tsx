"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Sparkles,
  Signal as SignalIcon,
  ListChecks,
  Zap,
  Database,
  AlertTriangle,
  Target,
} from "lucide-react";
import { getActiveCity } from "@/config/city";
import { t } from "@/i18n/ui";

const city = getActiveCity();

interface Recommendation {
  title: string;
  priority: string;
  horizon: string;
  rationale: string;
  actions: string[];
  expectedEffect: string;
  kpi: string;
}
interface DemandSignal {
  signal: string;
  evidence: string;
  interpretation: string;
}
interface PolicyReport {
  headline: string;
  executiveSummary: string;
  demandSignals: DemandSignal[];
  recommendations: Recommendation[];
  quickWins: string[];
  dataOpportunities: string[];
  risks: string[];
  closing: string;
}
interface ReportResponse {
  ok: boolean;
  configured: boolean;
  count: number;
  report: PolicyReport | null;
  samples: string[];
  generatedWith?: string;
}

function priorityStyle(priority: string): string {
  if (priority.includes("높")) return "bg-red-100 text-red-700 border-red-200";
  if (priority.includes("중")) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-stone-100 text-stone-600 border-stone-200";
}
function horizonStyle(horizon: string): string {
  if (horizon.includes("즉시")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (horizon.includes("단기")) return "bg-sky-100 text-sky-700 border-sky-200";
  return "bg-violet-100 text-violet-700 border-violet-200";
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-bold text-[var(--color-ink)] mb-4">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 text-white">
        {icon}
      </span>
      {children}
    </h2>
  );
}

export default function InsightsReportPage() {
  const [resp, setResp] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let base: unknown = undefined;
    try {
      const raw = sessionStorage.getItem(`insights:base:${city.id}`);
      if (raw) base = JSON.parse(raw);
    } catch {
      /* sessionStorage 접근 불가 시 무시 */
    }

    (async () => {
      try {
        const res = await fetch("/api/insights/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city: city.id, base }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ReportResponse = await res.json();
        setResp(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const report = resp?.report ?? null;

  return (
    <main className="min-h-screen bg-[var(--color-cream)] pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 text-white print:bg-white print:text-black">
        <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 print:hidden">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={15} strokeWidth={2.2} />
              {t("인사이트로 돌아가기")}
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              <Printer size={13} />
              {t("인쇄 · PDF 저장")}
            </button>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/15 print:bg-stone-100 rounded-full px-4 py-1.5 text-sm font-medium w-fit">
            <Sparkles size={14} className="text-amber-300 print:text-amber-600" />
            {t("지자체 담당자용 심층 정책 리포트 · Claude Sonnet 5 분석")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            {t("{city} 관광 수요 심층 리포트")}
          </h1>
          {resp && resp.count > 0 && (
            <p className="text-white/70 print:text-stone-500 text-sm">
              {t("분석 근거: 익명 질문 ")}
              <strong className="text-white print:text-black">{resp.count.toLocaleString("ko-KR")}</strong>
              {t("건 · 공공데이터 5종 연동 도슨트 · 개인정보 미수집")}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pt-8 flex flex-col gap-6">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="w-10 h-10 border-[3px] border-stone-300 border-t-stone-700 rounded-full animate-spin" />
            <p className="text-[var(--color-ink)] font-semibold">
              {t("Claude Sonnet 5가 심층 분석 중입니다…")}
            </p>
            <p className="text-stone-400 text-sm">{t("수요 신호 해석과 정책 제언 생성에 최대 30초가 걸릴 수 있습니다.")}</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {t("리포트 생성 실패: ")}{error}
            <Link href="/insights" className="ml-2 underline hover:text-red-900">
              {t("돌아가기")}
            </Link>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && !report && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-3xl">📄</div>
            <p className="text-[var(--color-ink)] font-semibold text-lg">
              {t("리포트를 생성할 데이터가 아직 부족합니다")}
            </p>
            <p className="text-stone-400 text-sm max-w-xs leading-relaxed">
              {t("먼저 인사이트 페이지에서 리포트를 생성한 뒤 [상세보기]로 진입하면 더 정확합니다.")}
            </p>
            <Link
              href="/insights"
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
            >
              <ArrowLeft size={14} /> {t("인사이트로 돌아가기")}
            </Link>
          </div>
        )}

        {/* Report */}
        {!loading && report && (
          <>
            {/* Headline + Executive summary */}
            <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <p className="text-lg sm:text-xl font-bold text-[var(--color-ink)] leading-snug">
                {report.headline}
              </p>
              <p className="mt-3 text-sm text-[var(--color-charcoal)] leading-relaxed">
                {report.executiveSummary}
              </p>
            </section>

            {/* Demand signals */}
            {report.demandSignals?.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <SectionTitle icon={<SignalIcon size={16} />}>{t("데이터 기반 수요 신호")}</SectionTitle>
                <div className="flex flex-col gap-3">
                  {report.demandSignals.map((s, i) => (
                    <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                      <p className="text-sm font-bold text-[var(--color-ink)]">{s.signal}</p>
                      <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                        <span className="font-semibold text-stone-600">{t("근거 ")}</span>{s.evidence}
                      </p>
                      <p className="mt-1 text-xs text-emerald-800 leading-relaxed bg-emerald-50 rounded-lg px-3 py-2">
                        <span className="font-semibold">{t("해석 ")}</span>{s.interpretation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommendations */}
            {report.recommendations?.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <SectionTitle icon={<ListChecks size={16} />}>{t("우선순위 정책 제언")}</SectionTitle>
                <div className="flex flex-col gap-4">
                  {report.recommendations.map((r, i) => (
                    <div key={i} className="rounded-xl border border-stone-200 p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-stone-800 text-white text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="font-bold text-[var(--color-ink)] text-sm mr-auto">{r.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${priorityStyle(r.priority)}`}>
                          {t("우선순위 ")}{r.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${horizonStyle(r.horizon)}`}>
                          {r.horizon}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed mb-3">{r.rationale}</p>
                      {r.actions?.length > 0 && (
                        <ul className="flex flex-col gap-1.5 mb-3">
                          {r.actions.map((a, j) => (
                            <li key={j} className="flex gap-2 items-start text-sm text-[var(--color-charcoal)]">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="rounded-lg bg-stone-50 px-3 py-2">
                          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">{t("기대 효과")}</p>
                          <p className="text-xs text-[var(--color-ink)] mt-0.5 leading-relaxed">{r.expectedEffect}</p>
                        </div>
                        <div className="rounded-lg bg-amber-50 px-3 py-2">
                          <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide flex items-center gap-1">
                            <Target size={11} /> KPI
                          </p>
                          <p className="text-xs text-[var(--color-ink)] mt-0.5 leading-relaxed">{r.kpi}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quick wins */}
            {report.quickWins?.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <SectionTitle icon={<Zap size={16} />}>{t("즉시 실행 가능한 퀵윈")}</SectionTitle>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {report.quickWins.map((q, i) => (
                    <li key={i} className="flex gap-2 items-start rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-sm text-emerald-900 leading-relaxed">
                      <Zap size={14} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                      {q}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Data opportunities */}
            {report.dataOpportunities?.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <SectionTitle icon={<Database size={16} />}>{t("추가 공공데이터 연계 기회")}</SectionTitle>
                <ul className="flex flex-col gap-2">
                  {report.dataOpportunities.map((d, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm text-[var(--color-charcoal)] leading-relaxed">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Risks */}
            {report.risks?.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <SectionTitle icon={<AlertTriangle size={16} />}>{t("유의사항 · 리스크")}</SectionTitle>
                <ul className="flex flex-col gap-2">
                  {report.risks.map((rk, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm text-[var(--color-charcoal)] leading-relaxed">
                      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                      {rk}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Closing */}
            {report.closing && (
              <section className="rounded-2xl bg-stone-800 text-white p-6">
                <p className="text-sm leading-relaxed">{report.closing}</p>
              </section>
            )}

            {/* Footer note */}
            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              {t("본 리포트는 익명 질문 데이터를 Claude Sonnet 5가 해석해 생성한 정책 참고자료입니다. 실제 정책 결정 시 추가 실측·검증을 권장합니다.")}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
