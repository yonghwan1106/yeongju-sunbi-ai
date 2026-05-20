"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { heritageData } from "@/data/heritage";
import { figuresData, HistoricalFigure } from "@/data/figures";
import { Heritage } from "@/types";

interface SunbiNetworkGraphProps {
  selectedFigureId: string | null;
  onSelectFigure: (id: string | null) => void;
}

const SVG_W = 880;
const SVG_H = 640;
const CENTER = { x: SVG_W / 2, y: SVG_H / 2 };

interface PositionedFigure extends HistoricalFigure {
  x: number;
  y: number;
}

interface PositionedHeritage extends Heritage {
  x: number;
  y: number;
}

export default function SunbiNetworkGraph({
  selectedFigureId,
  onSelectFigure,
}: SunbiNetworkGraphProps) {
  const [hoveredFigure, setHoveredFigure] = useState<string | null>(null);
  const [hoveredHeritage, setHoveredHeritage] = useState<string | null>(null);

  // 인물을 원형으로 배치
  const figures: PositionedFigure[] = useMemo(() => {
    const radius = 170;
    const sorted = [...figuresData].sort((a, b) => a.bornYear - b.bornYear);
    return sorted.map((f, i) => {
      const angle = (i / sorted.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...f,
        x: CENTER.x + Math.cos(angle) * radius,
        y: CENTER.y + Math.sin(angle) * radius,
      };
    });
  }, []);

  // 유산을 인물의 평균 각도 기준 바깥쪽에 배치
  const heritage: PositionedHeritage[] = useMemo(() => {
    const radius = 290;
    return heritageData.map((h, idx) => {
      // 이 유산과 연결된 인물들의 평균 각도 산출
      const linkedFigures = figures.filter((f) =>
        f.relatedHeritage.includes(h.id),
      );
      let angle: number;
      if (linkedFigures.length > 0) {
        // 평균 각도 (벡터 평균으로 -π/+π 경계 안전)
        let sumX = 0;
        let sumY = 0;
        linkedFigures.forEach((f) => {
          const a = Math.atan2(f.y - CENTER.y, f.x - CENTER.x);
          sumX += Math.cos(a);
          sumY += Math.sin(a);
        });
        angle = Math.atan2(sumY, sumX);
      } else {
        // 연결 인물이 없으면 인덱스 기반 균등 배치 (소백산 등)
        angle = (idx / heritageData.length) * Math.PI * 2;
      }
      return {
        ...h,
        x: CENTER.x + Math.cos(angle) * radius,
        y: CENTER.y + Math.sin(angle) * radius,
      };
    });
  }, [figures]);

  // 강조 대상 결정
  const activeFigureId = hoveredFigure ?? selectedFigureId;
  const activeHeritageId = hoveredHeritage;

  const highlightedHeritageIds = useMemo(() => {
    if (activeFigureId) {
      const fig = figures.find((f) => f.id === activeFigureId);
      return new Set(fig?.relatedHeritage ?? []);
    }
    if (activeHeritageId) {
      return new Set([activeHeritageId]);
    }
    return new Set<string>();
  }, [activeFigureId, activeHeritageId, figures]);

  const highlightedFigureIds = useMemo(() => {
    if (activeFigureId) return new Set([activeFigureId]);
    if (activeHeritageId) {
      const linked = figures
        .filter((f) => f.relatedHeritage.includes(activeHeritageId))
        .map((f) => f.id);
      return new Set(linked);
    }
    return new Set<string>();
  }, [activeFigureId, activeHeritageId, figures]);

  const anyActive = highlightedFigureIds.size > 0 || highlightedHeritageIds.size > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] p-4 sm:p-6"
    >
      {/* 모바일: 칩 리스트로 대체 */}
      <div className="block md:hidden">
        <p className="text-xs text-[var(--color-charcoal)] opacity-60 mb-3">
          네트워크 그래프는 데스크탑 환경에서 가장 잘 표시됩니다. 모바일에서는
          인물–유산 연결을 칩 리스트로 확인할 수 있습니다.
        </p>
        <div className="flex flex-col gap-3">
          {figures.map((f) => (
            <div
              key={f.id}
              className={`p-3 rounded-xl border transition-colors ${
                selectedFigureId === f.id
                  ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)]"
                  : "border-[var(--color-parchment)] bg-[var(--color-ivory)]"
              }`}
              onClick={() =>
                onSelectFigure(selectedFigureId === f.id ? null : f.id)
              }
              role="button"
              tabIndex={0}
            >
              <div className="flex items-baseline justify-between gap-2">
                <strong className="text-sm text-[var(--color-ink)]">
                  {f.name}
                </strong>
                <span className="text-[10px] text-[var(--color-charcoal)] opacity-60">
                  {f.bornYear}–{f.diedYear} · {f.role}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {f.relatedHeritage.map((hid) => {
                  const h = heritageData.find((x) => x.id === hid);
                  if (!h) return null;
                  return (
                    <span
                      key={hid}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-700)]"
                    >
                      {h.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 데스크탑: SVG 네트워크 */}
      <div className="hidden md:block">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[var(--color-charcoal)] opacity-70">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--color-primary-500)]" />
            인물
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--color-accent-500)]" />
            문화유산
          </div>
          <span className="ml-auto text-[var(--color-charcoal)] opacity-50">
            노드를 호버하면 연결된 항목이 강조됩니다
          </span>
        </div>

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="영주 선비 인물과 유산의 네트워크 그래프"
        >
          {/* 중앙 후광 */}
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-primary-200)" stopOpacity={0.55} />
              <stop offset="100%" stopColor="var(--color-primary-200)" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={CENTER.x} cy={CENTER.y} r={130} fill="url(#centerGlow)" />

          {/* 연결선: 인물 → 유산 */}
          {figures.map((f) =>
            f.relatedHeritage.map((hid) => {
              const h = heritage.find((x) => x.id === hid);
              if (!h) return null;
              const isHighlighted =
                highlightedFigureIds.has(f.id) &&
                highlightedHeritageIds.has(h.id);
              const dim = anyActive && !isHighlighted;
              return (
                <motion.line
                  key={`${f.id}-${h.id}`}
                  x1={f.x}
                  y1={f.y}
                  x2={h.x}
                  y2={h.y}
                  stroke={
                    isHighlighted
                      ? "var(--color-primary-500)"
                      : "var(--color-earth-400)"
                  }
                  strokeWidth={isHighlighted ? 2 : 1}
                  opacity={dim ? 0.06 : isHighlighted ? 0.85 : 0.35}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: dim ? 0.06 : isHighlighted ? 0.85 : 0.35,
                  }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              );
            }),
          )}

          {/* 중앙 라벨 */}
          <motion.g
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={52}
              fill="var(--color-primary-600)"
              stroke="white"
              strokeWidth={4}
            />
            <text
              x={CENTER.x}
              y={CENTER.y - 4}
              textAnchor="middle"
              fontSize={16}
              fontWeight={800}
              fill="white"
            >
              영주
            </text>
            <text
              x={CENTER.x}
              y={CENTER.y + 16}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill="white"
              opacity={0.9}
            >
              선비 학맥
            </text>
          </motion.g>

          {/* 인물 노드 */}
          {figures.map((f, i) => {
            const isHighlighted = highlightedFigureIds.has(f.id);
            const dim = anyActive && !isHighlighted;
            return (
              <motion.g
                key={f.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: dim ? 0.25 : 1,
                  scale: 1,
                }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                onMouseEnter={() => setHoveredFigure(f.id)}
                onMouseLeave={() => setHoveredFigure(null)}
                onClick={() =>
                  onSelectFigure(selectedFigureId === f.id ? null : f.id)
                }
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={f.x}
                  cy={f.y}
                  r={isHighlighted ? 30 : 26}
                  fill={
                    isHighlighted
                      ? "var(--color-primary-600)"
                      : "var(--color-primary-500)"
                  }
                  stroke="white"
                  strokeWidth={3}
                />
                <text
                  x={f.x}
                  y={f.y + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill="white"
                >
                  {f.name}
                </text>
                {/* 역할 라벨 */}
                <text
                  x={f.x}
                  y={f.y + 46}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--color-earth-700)"
                  opacity={dim ? 0.3 : 0.85}
                >
                  {f.role}
                </text>
              </motion.g>
            );
          })}

          {/* 유산 노드 */}
          {heritage.map((h, i) => {
            const isHighlighted = highlightedHeritageIds.has(h.id);
            const dim = anyActive && !isHighlighted;
            return (
              <motion.g
                key={h.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: dim ? 0.25 : 1,
                  scale: 1,
                }}
                transition={{ duration: 0.4, delay: 0.05 * i + 0.3 }}
                onMouseEnter={() => setHoveredHeritage(h.id)}
                onMouseLeave={() => setHoveredHeritage(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={isHighlighted ? 22 : 18}
                  fill={
                    isHighlighted
                      ? "var(--color-accent-600)"
                      : "var(--color-accent-500)"
                  }
                  stroke="white"
                  strokeWidth={2.5}
                />
                <text
                  x={h.x}
                  y={h.y + 3}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="white"
                >
                  {h.name.length > 5 ? h.name.slice(0, 5) : h.name}
                </text>
                {/* 연도 라벨 */}
                {typeof h.year === "number" && (
                  <text
                    x={h.x}
                    y={h.y + 36}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--color-earth-700)"
                    opacity={dim ? 0.3 : 0.75}
                  >
                    {h.year}년
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* 활성 인물 설명 */}
        {activeFigureId && (
          <div className="mt-3 p-3 rounded-xl bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] text-sm">
            {(() => {
              const fig = figures.find((f) => f.id === activeFigureId);
              if (!fig) return null;
              return (
                <>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-[var(--color-primary-700)]">
                      {fig.name}
                    </strong>
                    <span className="text-xs text-[var(--color-charcoal)] opacity-60">
                      {fig.bornYear}–{fig.diedYear} · {fig.role}
                    </span>
                  </div>
                  <p className="mt-1 text-[var(--color-charcoal)] opacity-85 leading-relaxed">
                    {fig.description}
                  </p>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
