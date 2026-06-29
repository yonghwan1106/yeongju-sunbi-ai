"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { heritageData, figuresData } from "@/data/active";
import { getActiveCity } from "@/config/city";

interface LineageTimelineProps {
  selectedFigureId: string | null;
  onSelectFigure: (id: string | null) => void;
}

const TIMELINE_START = 1200;
const TIMELINE_END = 2020;
const TIMELINE_SPAN = TIMELINE_END - TIMELINE_START;
const ROW_HEIGHT = 56;
const TOP_PAD = 56;
const BOTTOM_PAD = 64;
const LEFT_PAD = 112;
const RIGHT_PAD = 24;

export default function LineageTimeline({
  selectedFigureId,
  onSelectFigure,
}: LineageTimelineProps) {
  const city = getActiveCity();
  const [hoveredHeritage, setHoveredHeritage] = useState<string | null>(null);

  // 인물 정렬: 출생 연도 오름차순
  const figures = useMemo(
    () => [...figuresData].sort((a, b) => a.bornYear - b.bornYear),
    [],
  );

  const heritageWithYear = useMemo(
    () => heritageData.filter((h) => typeof h.year === "number"),
    [],
  );

  const width = 960;
  const innerWidth = width - LEFT_PAD - RIGHT_PAD;
  const height = TOP_PAD + figures.length * ROW_HEIGHT + BOTTOM_PAD;

  const toX = (year: number) =>
    LEFT_PAD + ((year - TIMELINE_START) / TIMELINE_SPAN) * innerWidth;

  // 세기 단위 그리드
  const centuries = [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000];

  // 선택된 인물의 관련 유산
  const highlightedHeritageIds = useMemo(() => {
    if (!selectedFigureId) return new Set<string>();
    const fig = figures.find((f) => f.id === selectedFigureId);
    return new Set(fig?.relatedHeritage ?? []);
  }, [selectedFigureId, figures]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] p-4 sm:p-6 overflow-x-auto"
    >
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[var(--color-charcoal)] opacity-70">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-2 rounded-sm bg-[var(--color-primary-500)]" />
          인물의 생애
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-0.5 h-3 bg-[var(--color-accent-500)]" />
          유산의 창건/개관
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-[var(--color-earth-500)] [mask-image:linear-gradient(to_right,#000_60%,transparent_60%)] [mask-size:6px_100%]" />
          인물 → 유산 연결
        </div>
        <span className="ml-auto text-[var(--color-charcoal)] opacity-50">
          인물 클릭 시 네트워크 그래프와 연동됩니다
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[720px] h-auto"
        role="img"
        aria-label={`${city.name} 선비 인물 계보 타임라인`}
      >
        {/* 세기 그리드 */}
        {centuries.map((y) => (
          <g key={y}>
            <line
              x1={toX(y)}
              y1={TOP_PAD - 12}
              x2={toX(y)}
              y2={height - BOTTOM_PAD + 12}
              stroke="var(--color-parchment)"
              strokeWidth={1}
              strokeDasharray="2 4"
            />
            <text
              x={toX(y)}
              y={height - BOTTOM_PAD + 28}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-charcoal)"
              opacity={0.55}
            >
              {y}
            </text>
          </g>
        ))}

        {/* 가로 베이스라인 (행마다) */}
        {figures.map((_, i) => (
          <line
            key={`base-${i}`}
            x1={LEFT_PAD}
            y1={TOP_PAD + i * ROW_HEIGHT + ROW_HEIGHT / 2}
            x2={width - RIGHT_PAD}
            y2={TOP_PAD + i * ROW_HEIGHT + ROW_HEIGHT / 2}
            stroke="var(--color-ivory)"
            strokeWidth={1}
          />
        ))}

        {/* 인물 → 유산 연결선 (선택된 인물만 강조) */}
        {figures.map((fig, i) => {
          const rowY = TOP_PAD + i * ROW_HEIGHT + ROW_HEIGHT / 2;
          const midX = toX((fig.bornYear + fig.diedYear) / 2);
          const isSelected = selectedFigureId === fig.id;
          const dim = selectedFigureId !== null && !isSelected;
          return fig.relatedHeritage.map((hid) => {
            const h = heritageWithYear.find((x) => x.id === hid);
            if (!h || h.year === undefined) return null;
            const hx = toX(h.year);
            const hy = height - BOTTOM_PAD;
            return (
              <line
                key={`link-${fig.id}-${hid}`}
                x1={midX}
                y1={rowY}
                x2={hx}
                y2={hy}
                stroke={
                  isSelected
                    ? "var(--color-primary-500)"
                    : "var(--color-earth-400)"
                }
                strokeWidth={isSelected ? 1.5 : 0.6}
                strokeDasharray="3 3"
                opacity={dim ? 0.08 : isSelected ? 0.85 : 0.32}
              />
            );
          });
        })}

        {/* 인물 생애 바 */}
        {figures.map((fig, i) => {
          const x1 = toX(fig.bornYear);
          const x2 = toX(fig.diedYear);
          const y = TOP_PAD + i * ROW_HEIGHT + ROW_HEIGHT / 2;
          const isSelected = selectedFigureId === fig.id;
          const dim = selectedFigureId !== null && !isSelected;

          return (
            <g
              key={fig.id}
              onClick={() => onSelectFigure(isSelected ? null : fig.id)}
              style={{ cursor: "pointer" }}
            >
              {/* 이름 라벨 */}
              <text
                x={LEFT_PAD - 12}
                y={y + 4}
                textAnchor="end"
                fontSize={13}
                fontWeight={isSelected ? 700 : 600}
                fill={
                  isSelected
                    ? "var(--color-primary-700)"
                    : "var(--color-charcoal)"
                }
                opacity={dim ? 0.3 : 1}
              >
                {fig.name}
              </text>
              {/* 생애 바 */}
              <rect
                x={x1}
                y={y - 8}
                width={Math.max(x2 - x1, 4)}
                height={16}
                rx={8}
                fill={
                  isSelected
                    ? "var(--color-primary-500)"
                    : "var(--color-primary-300)"
                }
                opacity={dim ? 0.25 : 1}
              />
              {/* 생몰년 텍스트 */}
              <text
                x={(x1 + x2) / 2}
                y={y - 12}
                textAnchor="middle"
                fontSize={10}
                fill="var(--color-charcoal)"
                opacity={dim ? 0.25 : 0.7}
              >
                {fig.bornYear}–{fig.diedYear}
              </text>
              {/* 역할 (오른쪽) */}
              <text
                x={x2 + 8}
                y={y + 4}
                textAnchor="start"
                fontSize={11}
                fill="var(--color-earth-600)"
                opacity={dim ? 0.2 : 0.75}
              >
                {fig.role}
              </text>
            </g>
          );
        })}

        {/* 유산 마커 (하단에 배치) */}
        {heritageWithYear.map((h) => {
          if (h.year === undefined) return null;
          const x = toX(h.year);
          const y = height - BOTTOM_PAD;
          const isHovered = hoveredHeritage === h.id;
          const isHighlighted = highlightedHeritageIds.has(h.id);
          const dim = selectedFigureId !== null && !isHighlighted;

          return (
            <g
              key={h.id}
              onMouseEnter={() => setHoveredHeritage(h.id)}
              onMouseLeave={() => setHoveredHeritage(null)}
              style={{ cursor: "pointer" }}
            >
              {/* 세로 마커 라인 */}
              <line
                x1={x}
                y1={TOP_PAD - 8}
                x2={x}
                y2={y}
                stroke={
                  isHighlighted || isHovered
                    ? "var(--color-accent-500)"
                    : "var(--color-accent-300)"
                }
                strokeWidth={isHighlighted || isHovered ? 2 : 1}
                opacity={dim ? 0.15 : 1}
              />
              {/* 점 */}
              <circle
                cx={x}
                cy={y}
                r={isHovered || isHighlighted ? 7 : 5}
                fill={
                  isHighlighted || isHovered
                    ? "var(--color-accent-500)"
                    : "var(--color-accent-400)"
                }
                stroke="white"
                strokeWidth={2}
                opacity={dim ? 0.2 : 1}
              />
              {/* 호버 툴팁 */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 60}
                    y={y + 12}
                    width={120}
                    height={32}
                    rx={6}
                    fill="var(--color-ink)"
                    opacity={0.92}
                  />
                  <text
                    x={x}
                    y={y + 27}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="white"
                  >
                    {h.name}
                  </text>
                  <text
                    x={x}
                    y={y + 40}
                    textAnchor="middle"
                    fontSize={10}
                    fill="white"
                    opacity={0.7}
                  >
                    {h.year}년
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {selectedFigureId && (
        <div className="mt-3 text-xs text-[var(--color-primary-700)] opacity-80">
          선택된 인물:{" "}
          <strong>{figures.find((f) => f.id === selectedFigureId)?.name}</strong>{" "}
          — 다시 클릭하면 선택이 해제됩니다.
        </div>
      )}
    </motion.div>
  );
}
