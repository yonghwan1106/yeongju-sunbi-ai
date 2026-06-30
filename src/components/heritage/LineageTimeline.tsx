"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { heritageData, figuresData } from "@/data/active";
import type { HistoricalFigure } from "@/data/active";
import { getActiveCity } from "@/config/city";
import { t, cityLabel } from "@/i18n/ui";

interface LineageTimelineProps {
  selectedFigureId: string | null;
  onSelectFigure: (id: string | null) => void;
}

const T_START = 600;
const T_END = 2020;
const T_SPAN = T_END - T_START;
const ROW_H = 56;
const TOP_PAD = 70;
const BOTTOM_PAD = 80;
const LEFT_PAD = 124;
const RIGHT_PAD = 28;
const WIDTH = 960;

const ERA_COLOR: Record<string, string> = {
  신라: "#B8862B",
  고려: "#2E8C76",
  조선: "#355C8A",
  근현대: "#6B7280",
};
const ERAS = [
  { name: "신라", from: 600, to: 935 },
  { name: "고려", from: 935, to: 1392 },
  { name: "조선", from: 1392, to: 1897 },
  { name: "근현대", from: 1897, to: 2020 },
];
function eraOf(year: number): string {
  const e = ERAS.find((x) => year >= x.from && year < x.to);
  return e ? e.name : "근현대";
}
function figEra(f: HistoricalFigure): string {
  return f.era ?? eraOf(f.bornYear);
}

export default function LineageTimeline({ selectedFigureId, onSelectFigure }: LineageTimelineProps) {
  const city = getActiveCity();
  const [hoveredHeritage, setHoveredHeritage] = useState<string | null>(null);

  const figures = useMemo(() => [...figuresData].sort((a, b) => a.bornYear - b.bornYear), []);
  const heritageWithYear = useMemo(() => heritageData.filter((h) => typeof h.year === "number"), []);

  const innerWidth = WIDTH - LEFT_PAD - RIGHT_PAD;
  const height = TOP_PAD + figures.length * ROW_H + BOTTOM_PAD;
  const toX = (year: number) => LEFT_PAD + ((year - T_START) / T_SPAN) * innerWidth;
  const rowY = (i: number) => TOP_PAD + i * ROW_H + ROW_H / 2;

  const highlightedHeritageIds = useMemo(() => {
    if (!selectedFigureId) return new Set<string>();
    return new Set(figures.find((f) => f.id === selectedFigureId)?.relatedHeritage ?? []);
  }, [selectedFigureId, figures]);

  // 학맥/계승 간선에 등장하는 인물 = spine (도시 무관, 하드코딩 없음). 출생순.
  const spineIds = useMemo(() => {
    const s = new Set<string>();
    figures.forEach((f) =>
      (f.links ?? []).forEach((l) => {
        if (l.kind === "학맥" || l.kind === "계승") {
          s.add(f.id);
          s.add(l.to);
        }
      }),
    );
    return figures.filter((f) => s.has(f.id)).map((f) => f.id);
  }, [figures]);
  const spinePts = spineIds
    .map((id) => {
      const idx = figures.findIndex((f) => f.id === id);
      const f = figures[idx];
      return f ? { x: toX(f.bornYear), y: rowY(idx), id } : null;
    })
    .filter(Boolean) as { x: number; y: number; id: string }[];
  const spinePath =
    spinePts.length >= 2
      ? spinePts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "")
      : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] p-4 sm:p-6 overflow-x-auto"
    >
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--color-charcoal)] opacity-75">
        <span className="font-semibold text-[var(--color-ink)] opacity-100">{t("시대")}</span>
        {(["신라", "고려", "조선"] as const).map((e) => (
          <span key={e} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm" style={{ backgroundColor: ERA_COLOR[e] }} />
            {t(e)}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-earth-500)]" />
          {t("유산 창건/개관")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-5 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg,#2E8C76,#355C8A)" }} />
          {t("학맥 계승")}
        </span>
        <span className="ml-auto text-[var(--color-charcoal)] opacity-55">{t("인물 클릭 시 네트워크 보기와 연동")}</span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${height}`} className="w-full min-w-[760px] h-auto" role="img" aria-label={`${cityLabel()} ${t("선비 학맥 타임라인")}`}>
        <defs>
          <linearGradient id="tlSpine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E8C76" />
            <stop offset="100%" stopColor="#355C8A" />
          </linearGradient>
          <marker id="tlArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#355C8A" />
          </marker>
        </defs>

        {/* 시대 밴드 */}
        {ERAS.map((e) => {
          const x1 = toX(Math.max(e.from, T_START));
          const x2 = toX(Math.min(e.to, T_END));
          return (
            <g key={e.name}>
              <rect x={x1} y={TOP_PAD - 18} width={Math.max(x2 - x1, 0)} height={height - TOP_PAD - BOTTOM_PAD + 30} fill={ERA_COLOR[e.name]} opacity={0.06} />
              <line x1={x1} y1={TOP_PAD - 18} x2={x1} y2={height - BOTTOM_PAD + 12} stroke={ERA_COLOR[e.name]} strokeWidth={1} opacity={0.25} strokeDasharray="2 4" />
              <text x={(x1 + x2) / 2} y={TOP_PAD - 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={ERA_COLOR[e.name]} opacity={0.9}>
                {e.name}
              </text>
            </g>
          );
        })}

        {/* 세기 눈금(200년) */}
        {[800, 1000, 1200, 1400, 1600, 1800, 2000].map((y) => (
          <text key={y} x={toX(y)} y={height - BOTTOM_PAD + 30} textAnchor="middle" fontSize={10} fill="var(--color-charcoal)" opacity={0.45}>
            {y}
          </text>
        ))}

        {/* 행 베이스라인 */}
        {figures.map((_, i) => (
          <line key={`b-${i}`} x1={LEFT_PAD} y1={rowY(i)} x2={WIDTH - RIGHT_PAD} y2={rowY(i)} stroke="var(--color-ivory)" strokeWidth={1} />
        ))}

        {/* 인물 → 유산 연결(선택 시) */}
        {selectedFigureId &&
          figures.map((fig, i) => {
            if (fig.id !== selectedFigureId) return null;
            return fig.relatedHeritage.map((hid) => {
              const h = heritageWithYear.find((x) => x.id === hid);
              if (!h || h.year === undefined) return null;
              return (
                <line key={`l-${hid}`} x1={toX(fig.bornYear)} y1={rowY(i)} x2={toX(h.year)} y2={height - BOTTOM_PAD} stroke={ERA_COLOR[figEra(fig)]} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.7} />
              );
            });
          })}

        {/* 성리학 도통 spine */}
        {spinePath && (
          <g opacity={selectedFigureId && !spineIds.includes(selectedFigureId) ? 0.2 : 1}>
            <path d={spinePath} fill="none" stroke="url(#tlSpine)" strokeWidth={3} markerEnd="url(#tlArrow)" strokeLinecap="round" opacity={0.9} />
            {spinePts[0] && (
              <text x={spinePts[0].x} y={spinePts[0].y - 16} fontSize={10} fontWeight={700} fill="#355C8A" opacity={0.75}>
                {t("학맥")}
              </text>
            )}
          </g>
        )}

        {/* 인물 행 */}
        {figures.map((fig, i) => {
          const x1 = toX(fig.bornYear);
          const x2 = toX(fig.diedYear);
          const y = rowY(i);
          const col = ERA_COLOR[figEra(fig)];
          const isSel = selectedFigureId === fig.id;
          const dim = selectedFigureId !== null && !isSel;
          const seal = fig.hanja && fig.hanja.length <= 2 ? fig.hanja : fig.name.slice(0, 1);
          return (
            <g key={fig.id} onClick={() => onSelectFigure(isSel ? null : fig.id)} style={{ cursor: "pointer" }} opacity={dim ? 0.32 : 1}>
              {/* 이름(좌측 고정) */}
              <text x={LEFT_PAD - 40} y={y - 1} textAnchor="end" fontSize={13} fontWeight={isSel ? 800 : 700} fill={isSel ? col : "var(--color-ink)"}>
                {fig.name}
              </text>
              {fig.ho && (
                <text x={LEFT_PAD - 40} y={y + 12} textAnchor="end" fontSize={9.5} fill="var(--color-charcoal)" opacity={0.6}>
                  {fig.ho}
                </text>
              )}
              {/* 생애 바 */}
              <rect x={x1} y={y - 3} width={Math.max(x2 - x1, 3)} height={6} rx={3} fill={col} opacity={isSel ? 1 : 0.85} />
              {/* 생몰년 */}
              <text x={x2 + 6} y={y + 4} textAnchor="start" fontSize={9.5} fill="var(--color-charcoal)" opacity={0.6}>
                {fig.bornYear}–{fig.diedYear}
              </text>
              {/* 인장 seal at birth */}
              <rect x={x1 - 15} y={y - 15} width={30} height={30} rx={7} fill={col} stroke="white" strokeWidth={isSel ? 3 : 2} />
              <text x={x1} y={y + (seal.length <= 1 ? 6 : 4)} textAnchor="middle" fontSize={seal.length <= 1 ? 16 : 11} fontWeight={800} fill="white">
                {seal}
              </text>
            </g>
          );
        })}

        {/* 유산 마커(하단) */}
        {heritageWithYear.map((h) => {
          if (h.year === undefined) return null;
          const x = toX(h.year);
          const y = height - BOTTOM_PAD;
          const isHover = hoveredHeritage === h.id;
          const isHi = highlightedHeritageIds.has(h.id);
          const dim = selectedFigureId !== null && !isHi;
          const col = ERA_COLOR[eraOf(h.year)];
          return (
            <g key={h.id} onMouseEnter={() => setHoveredHeritage(h.id)} onMouseLeave={() => setHoveredHeritage(null)} style={{ cursor: "pointer" }} opacity={dim ? 0.2 : 1}>
              <line x1={x} y1={TOP_PAD - 18} x2={x} y2={y} stroke={isHi || isHover ? col : "var(--color-earth-400)"} strokeWidth={isHi || isHover ? 1.5 : 0.8} opacity={isHi || isHover ? 0.5 : 0.25} />
              <circle cx={x} cy={y} r={isHover || isHi ? 7 : 5} fill={isHi || isHover ? col : "var(--color-earth-500)"} stroke="white" strokeWidth={2} />
              {(isHover || isHi) && (
                <g>
                  <rect x={x - 62} y={y + 12} width={124} height={34} rx={6} fill="var(--color-ink)" opacity={0.92} />
                  <text x={x} y={y + 27} textAnchor="middle" fontSize={11} fontWeight={700} fill="white">{h.name}</text>
                  <text x={x} y={y + 40} textAnchor="middle" fontSize={9.5} fill="white" opacity={0.75}>{h.year}{t("년")} · {t(eraOf(h.year))}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {selectedFigureId &&
        (() => {
          const f = figures.find((x) => x.id === selectedFigureId);
          if (!f) return null;
          const col = ERA_COLOR[figEra(f)];
          return (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-4 rounded-xl border text-sm" style={{ borderColor: col + "55", background: col + "0E" }}>
              <div className="flex items-baseline flex-wrap gap-2">
                <strong className="text-base" style={{ color: col }}>{f.name}</strong>
                {f.hanja && <span className="text-[var(--color-charcoal)] opacity-70">{f.hanja}</span>}
                {f.ho && <span className="text-xs text-[var(--color-charcoal)] opacity-60">{f.ho}</span>}
                <span className="text-xs text-[var(--color-charcoal)] opacity-60">{t(figEra(f))} · {f.bornYear}–{f.diedYear} · {f.role}</span>
                <span className="ml-auto text-[11px] text-[var(--color-primary-700)] opacity-70">{t("다시 클릭하면 해제")}</span>
              </div>
              <p className="mt-1.5 text-[var(--color-charcoal)] opacity-85 leading-relaxed">{f.description}</p>
            </motion.div>
          );
        })()}
    </motion.div>
  );
}
