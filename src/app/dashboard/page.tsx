"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { getActiveCity } from "@/config/city";
import { getClassCode, setClassCode } from "@/lib/utils/session";

const city = getActiveCity();
const POLL_INTERVAL_MS = 10_000;

interface DashboardData {
  ok: boolean;
  configured: boolean;
  totals: {
    participants: number;
    stamps: number;
    quizAttempts: number;
    overallAccuracy: number;
  };
  heritage: { id: string; name: string; checkins: number; participants: number }[];
  quiz: { id: string; question: string; correct: number; total: number; accuracy: number }[];
}

const EMPTY_DATA: DashboardData = {
  ok: true,
  configured: false,
  totals: { participants: 0, stamps: 0, quizAttempts: 0, overallAccuracy: 0 },
  heritage: [],
  quiz: [],
};

// 차트 색상 팔레트 (amber/emerald/stone 토큰 계열)
const HERITAGE_COLOR = "#d97706"; // amber-600
const QUIZ_CORRECT_COLOR = "#059669"; // emerald-600
const RADIAL_COLOR = "#d97706";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col gap-1">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-[var(--color-ink)]">{value}</p>
      {sub && <p className="text-xs text-stone-400">{sub}</p>}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl">
        📊
      </div>
      <p className="text-[var(--color-ink)] font-semibold text-lg">아직 집계된 데이터가 없습니다</p>
      <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
        학생들이 스탬프투어·퀴즈를 진행하면
        <br />
        익명 집계가 실시간으로 쌓입니다.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [classInput, setClassInput] = useState("");
  const [data, setData] = useState<DashboardData>(EMPTY_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const activeClassRef = useRef("");

  // localStorage에서 기본 교실코드 초기화
  useEffect(() => {
    const saved = getClassCode();
    setClassInput(saved);
    activeClassRef.current = saved;
  }, []);

  const fetchData = useCallback(async (classCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ city: city.id });
      if (classCode.trim()) params.set("class", classCode.trim());
      const res = await fetch(`/api/dashboard?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: DashboardData = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  function handleLoad() {
    setClassCode(classInput);
    activeClassRef.current = classInput;
    void fetchData(classInput);
  }

  // 10초 폴링 — 교실코드 변경 시 재시작
  useEffect(() => {
    void fetchData(activeClassRef.current);
    const id = setInterval(() => {
      void fetchData(activeClassRef.current);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasData =
    data.heritage.length > 0 ||
    data.quiz.length > 0 ||
    data.totals.stamps > 0 ||
    data.totals.quizAttempts > 0;

  const radialData = [
    {
      name: "정답률",
      value: data.totals.overallAccuracy,
      fill: RADIAL_COLOR,
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-cream)] pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-4">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            교사 대시보드 · 익명 집계 · 개인정보 미수집
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            {city.name} 선비AI
            <br />
            학습 현황 대시보드
          </h1>
          <p className="text-white/70 text-sm">
            교실코드를 입력하면 해당 수업의 스탬프 · 퀴즈 현황을 집계합니다.
            <br />
            모든 데이터는 익명 세션 ID 기준이며 실명·연락처는 수집하지 않습니다.
          </p>

          {/* 교실코드 입력 */}
          <div className="flex gap-2 mt-2 max-w-md">
            <input
              type="text"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLoad();
              }}
              placeholder="교실코드 입력 (예: ENG-2A)"
              maxLength={20}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/20 text-white placeholder:text-white/50 text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={handleLoad}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-semibold text-sm hover:bg-emerald-50 disabled:opacity-50 transition-colors"
            >
              {loading ? "로딩…" : "불러오기"}
            </button>
          </div>
          {lastUpdated && (
            <p className="text-white/40 text-xs">
              마지막 업데이트: {lastUpdated.toLocaleTimeString("ko-KR")} (10초 자동 갱신)
            </p>
          )}
        </div>
      </section>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 pt-8 flex flex-col gap-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            데이터 불러오기 실패: {error}
          </div>
        )}

        {!hasData ? (
          <EmptyState />
        ) : (
          <>
            {/* ── 요약 카드 ── */}
            <section>
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
                종합 현황
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="참여 학생 (익명)" value={data.totals.participants} sub="고유 세션" />
                <StatCard label="스탬프 체크인" value={data.totals.stamps} sub="누적" />
                <StatCard label="퀴즈 도전" value={data.totals.quizAttempts} sub="누적" />
                <StatCard
                  label="전체 정답률"
                  value={`${data.totals.overallAccuracy}%`}
                  sub={`${data.totals.quizAttempts}문항 기준`}
                />
              </div>
            </section>

            {/* ── 전체 정답률 RadialBar ── */}
            {data.totals.quizAttempts > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
                  전체 정답률
                </h2>
                <div className="flex items-center gap-8">
                  <div className="w-36 h-36 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={90 - (data.totals.overallAccuracy / 100) * 360}
                        data={radialData}
                      >
                        <RadialBar dataKey="value" background={{ fill: "#f5f5f4" }} cornerRadius={8} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-5xl font-bold text-amber-600">
                      {data.totals.overallAccuracy}
                      <span className="text-2xl font-normal text-stone-400">%</span>
                    </p>
                    <p className="text-stone-500 text-sm mt-1">
                      {data.totals.quizAttempts}문항 중 {Math.round(data.totals.quizAttempts * data.totals.overallAccuracy / 100)}개 정답
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ── 유산별 스탬프 BarChart ── */}
            {data.heritage.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
                  유산별 스탬프 체크인
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={data.heritage}
                    margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#78716c" }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={44}
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
                      formatter={(v) => [`${Number(v ?? 0)}회`, "체크인"]}
                    />
                    <Bar dataKey="checkins" fill={HERITAGE_COLOR} radius={[6, 6, 0, 0]} maxBarSize={56} />
                  </BarChart>
                </ResponsiveContainer>
              </section>
            )}

            {/* ── 문항별 정답률 BarChart ── */}
            {data.quiz.length > 0 && (
              <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
                  문항별 정답률 (%)
                </h2>
                <ResponsiveContainer width="100%" height={Math.max(220, data.quiz.length * 36)}>
                  <BarChart
                    data={data.quiz.map((q) => ({
                      ...q,
                      label: q.question.slice(0, 18) + (q.question.length > 18 ? "…" : ""),
                    }))}
                    layout="vertical"
                    margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#78716c" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={130}
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
                      formatter={(v, _name, item) => {
                        const pct = Number(v ?? 0);
                        const p = item.payload as { correct?: number; total?: number };
                        return [`${pct}% (${p?.correct ?? 0}/${p?.total ?? 0})`, "정답률"];
                      }}
                    />
                    <Bar dataKey="accuracy" fill={QUIZ_CORRECT_COLOR} radius={[0, 6, 6, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
