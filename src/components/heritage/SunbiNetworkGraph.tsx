"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { heritageData, figuresData } from "@/data/active";
import type { HistoricalFigure } from "@/data/active";
import { Heritage } from "@/types";
import { t as tr, cityLabel } from "@/i18n/ui";

const CITY_NAME = cityLabel();

interface SunbiNetworkGraphProps {
  selectedFigureId: string | null;
  onSelectFigure: (id: string | null) => void;
}

const SVG_W = 960;
const SVG_H = 600;

// 시대별 색 — 왕조 정체성
const ERA_COLOR: Record<string, string> = {
  신라: "#B8862B", // 금(불교)
  고려: "#2E8C76", // 청자
  조선: "#355C8A", // 성리학 남빛
  근현대: "#6B7280",
};
function eraColor(f: HistoricalFigure): string {
  if (f.era && ERA_COLOR[f.era]) return ERA_COLOR[f.era];
  return f.bornYear < 935 ? ERA_COLOR.신라 : f.bornYear < 1392 ? ERA_COLOR.고려 : ERA_COLOR.조선;
}

// 영주 전용 큐레이션 좌표 — 천 년(좌→우) 학맥의 강. 성리학 도통(안향→주세붕→이황)이 중심 동맥.
const FIG_POS: Record<string, { x: number; y: number }> = {
  uisang: { x: 150, y: 150 },
  seonmyo: { x: 120, y: 300 },
  gongminwang: { x: 320, y: 470 },
  anhyang: { x: 400, y: 280 },
  juseboong: { x: 610, y: 220 },
  yihwang: { x: 800, y: 300 },
  parksu: { x: 820, y: 500 },
};
const HER_POS: Record<string, { x: number; y: number }> = {
  buseoksa: { x: 250, y: 230 },
  "yeongju-hyanggyo": { x: 300, y: 560 },
  sosuseowon: { x: 560, y: 380 },
  "sosu-museum": { x: 660, y: 440 },
  sunbichon: { x: 740, y: 160 },
  "punggi-ginseng": { x: 560, y: 110 },
  museom: { x: 880, y: 560 },
  sobaeksan: { x: 470, y: 560 },
};

interface PNode { x: number; y: number }

export default function SunbiNetworkGraph({
  selectedFigureId,
  onSelectFigure,
}: SunbiNetworkGraphProps) {
  const [hoveredFigure, setHoveredFigure] = useState<string | null>(null);
  const [hoveredHeritage, setHoveredHeritage] = useState<string | null>(null);

  const figures = useMemo(
    () => [...figuresData].sort((a, b) => a.bornYear - b.bornYear),
    [],
  );

  // 좌표: 큐레이션 우선, 없으면(예: 안동) 원형 배치로 폴백
  const figPos = useMemo<Record<string, PNode>>(() => {
    const out: Record<string, PNode> = {};
    const missing = figures.filter((f) => !FIG_POS[f.id]);
    figures.forEach((f) => {
      if (FIG_POS[f.id]) out[f.id] = FIG_POS[f.id];
    });
    missing.forEach((f, i) => {
      const a = (i / Math.max(missing.length, 1)) * Math.PI * 2 - Math.PI / 2;
      out[f.id] = { x: SVG_W / 2 + Math.cos(a) * 200, y: SVG_H / 2 + Math.sin(a) * 180 };
    });
    return out;
  }, [figures]);

  const herPos = useMemo<Record<string, PNode>>(() => {
    const out: Record<string, PNode> = {};
    const missing = heritageData.filter((h) => !HER_POS[h.id]);
    heritageData.forEach((h) => {
      if (HER_POS[h.id]) out[h.id] = HER_POS[h.id];
    });
    missing.forEach((h, i) => {
      const a = (i / Math.max(missing.length, 1)) * Math.PI * 2;
      out[h.id] = { x: SVG_W / 2 + Math.cos(a) * 330, y: SVG_H / 2 + Math.sin(a) * 250 };
    });
    return out;
  }, []);

  // 인물 간 학맥 간선
  const figureLinks = useMemo(() => {
    const links: { from: HistoricalFigure; to: HistoricalFigure; label: string; kind: string }[] = [];
    figures.forEach((f) => {
      (f.links ?? []).forEach((lk) => {
        const target = figures.find((x) => x.id === lk.to);
        if (target) links.push({ from: f, to: target, label: lk.label, kind: lk.kind });
      });
    });
    return links;
  }, [figures]);

  // 학맥/계승 간선에 등장하는 인물 = 기본 강조 spine (도시 무관, 하드코딩 없음)
  const SPINE = useMemo(() => {
    const s = new Set<string>();
    figureLinks.forEach((l) => {
      if (l.kind === "학맥" || l.kind === "계승") {
        s.add(l.from.id);
        s.add(l.to.id);
      }
    });
    return s;
  }, [figureLinks]);
  const spineCaption = useMemo(() => {
    const names = figures.filter((f) => SPINE.has(f.id)).map((f) => f.name);
    return names.length >= 2 ? `${tr("기본 강조 — 학맥 계승")}: ${names.join(" → ")}` : "";
  }, [figures, SPINE]);

  const activeFigureId = hoveredFigure ?? selectedFigureId;
  const activeHeritageId = hoveredHeritage;
  const anyActive = !!(activeFigureId || activeHeritageId);

  const highlightedHeritageIds = useMemo(() => {
    if (activeFigureId) {
      const fig = figures.find((f) => f.id === activeFigureId);
      return new Set(fig?.relatedHeritage ?? []);
    }
    if (activeHeritageId) return new Set([activeHeritageId]);
    return new Set<string>();
  }, [activeFigureId, activeHeritageId, figures]);

  // 활성 인물과 학맥으로 직접 연결된 인물(양방향)
  const highlightedFigureIds = useMemo(() => {
    if (activeFigureId) {
      const s = new Set([activeFigureId]);
      figureLinks.forEach((l) => {
        if (l.from.id === activeFigureId) s.add(l.to.id);
        if (l.to.id === activeFigureId) s.add(l.from.id);
      });
      return s;
    }
    if (activeHeritageId) {
      return new Set(
        figures.filter((f) => f.relatedHeritage.includes(activeHeritageId)).map((f) => f.id),
      );
    }
    return new Set<string>();
  }, [activeFigureId, activeHeritageId, figures, figureLinks]);

  // 곡선 경로(약간 위로 휘는 베지어)
  function arc(a: PNode, b: PNode, bend = 0.18) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const nx = -dy;
    const ny = dx;
    const len = Math.hypot(nx, ny) || 1;
    const cx = mx + (nx / len) * len * bend;
    const cy = my + (ny / len) * len * bend;
    return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
  }

  const activeFig = activeFigureId ? figures.find((f) => f.id === activeFigureId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] p-4 sm:p-6"
    >
      {/* 모바일: 학맥 흐름 칩 리스트 */}
      <div className="block md:hidden">
        <p className="text-xs text-[var(--color-charcoal)] opacity-60 mb-3">
          {tr("네트워크 그래프는 데스크탑에서 가장 잘 보입니다. 모바일에서는 인물의 학맥과 연결 유산을 카드로 확인하세요.")}
        </p>
        <div className="flex flex-col gap-2.5">
          {figures.map((f) => (
            <div
              key={f.id}
              className={`p-3 rounded-xl border transition-colors ${
                selectedFigureId === f.id
                  ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)]"
                  : "border-[var(--color-parchment)] bg-[var(--color-ivory)]"
              }`}
              onClick={() => onSelectFigure(selectedFigureId === f.id ? null : f.id)}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: eraColor(f) }}
                >
                  {f.hanja ? f.hanja.slice(0, 1) : f.name.slice(0, 1)}
                </span>
                <strong className="text-sm text-[var(--color-ink)]">{f.name}</strong>
                {f.ho && <span className="text-[11px] text-[var(--color-charcoal)] opacity-55">{f.ho}</span>}
                <span className="ml-auto text-[10px] text-[var(--color-charcoal)] opacity-55">
                  {tr(f.era ?? "")} · {f.bornYear}–{f.diedYear}
                </span>
              </div>
              {f.contribution && (
                <p className="mt-1.5 text-[12px] text-[var(--color-charcoal)] opacity-80 leading-snug">
                  {f.contribution}
                </p>
              )}
              {(f.links ?? []).length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {(f.links ?? []).map((lk) => {
                    const t = figures.find((x) => x.id === lk.to);
                    if (!t) return null;
                    return (
                      <span key={lk.to} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                        {t.name}{tr("에게")} {tr(lk.kind)}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 데스크탑: SVG 학맥 네트워크 */}
      <div className="hidden md:block">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--color-charcoal)] opacity-75">
          <span className="font-semibold text-[var(--color-ink)] opacity-100">{tr("시대")}</span>
          {(["신라", "고려", "조선"] as const).map((e) => (
            <span key={e} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-md" style={{ backgroundColor: ERA_COLOR[e] }} />
              {tr(e)}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--color-earth-500)]" />
            {tr("문화유산")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg,#2E8C76,#355C8A)" }} />
            {tr("학맥 계승")}
          </span>
          <span className="ml-auto text-[var(--color-charcoal)] opacity-55">
            {tr("노드를 클릭/호버하면 학맥과 연결 유산이 강조됩니다")}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label={`${CITY_NAME} ${tr("선비 학맥 지식그래프")}`}
        >
          <defs>
            <radialGradient id="hanjiBg" cx="50%" cy="42%" r="75%">
              <stop offset="0%" stopColor="#FBF7EE" />
              <stop offset="100%" stopColor="#F1E8D6" />
            </radialGradient>
            <linearGradient id="spineFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E8C76" />
              <stop offset="55%" stopColor="#355C8A" />
              <stop offset="100%" stopColor="#355C8A" />
            </linearGradient>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrowSpine" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#355C8A" />
            </marker>
            <marker id="arrowDim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#9C8866" />
            </marker>
          </defs>

          {/* 한지 배경 */}
          <rect x="0" y="0" width={SVG_W} height={SVG_H} rx="18" fill="url(#hanjiBg)" />
          {/* 워터마크 */}
          <text x={SVG_W - 28} y="58" textAnchor="end" fontSize="34" fontWeight={800} fill="#000" opacity={0.05}>
            千年學脈
          </text>
          {spineCaption && (
            <text x="28" y={SVG_H - 22} textAnchor="start" fontSize="12" fill="var(--color-charcoal)" opacity={0.5}>
              {spineCaption}
            </text>
          )}

          {/* 인물 → 유산 간선(은은) */}
          {figures.map((f) =>
            f.relatedHeritage.map((hid) => {
              const a = figPos[f.id];
              const b = herPos[hid];
              if (!a || !b) return null;
              const on = highlightedFigureIds.has(f.id) && highlightedHeritageIds.has(hid);
              const dim = anyActive && !on;
              return (
                <path
                  key={`fh-${f.id}-${hid}`}
                  d={arc(a, b, 0.12)}
                  fill="none"
                  stroke={on ? eraColor(f) : "#B6A88A"}
                  strokeWidth={on ? 2 : 1}
                  strokeDasharray="2 5"
                  opacity={dim ? 0.05 : on ? 0.8 : 0.28}
                />
              );
            }),
          )}

          {/* 인물 → 인물 학맥 간선(굵게·방향성·흐름) */}
          {figureLinks.map((l) => {
            const a = figPos[l.from.id];
            const b = figPos[l.to.id];
            if (!a || !b) return null;
            const isSpine = SPINE.has(l.from.id) && SPINE.has(l.to.id);
            const touched = activeFigureId && (l.from.id === activeFigureId || l.to.id === activeFigureId);
            const baseOn = touched || (!anyActive && isSpine);
            const dim = anyActive && !touched;
            return (
              <g key={`ff-${l.from.id}-${l.to.id}`}>
                <path
                  d={arc(b, a, 0.2)}
                  fill="none"
                  stroke={isSpine ? "url(#spineFlow)" : "#9C8866"}
                  strokeWidth={baseOn ? 3.5 : isSpine ? 2.5 : 1.6}
                  markerEnd={isSpine ? "url(#arrowSpine)" : "url(#arrowDim)"}
                  opacity={dim ? 0.12 : baseOn ? 1 : 0.5}
                  filter={baseOn ? "url(#softGlow)" : undefined}
                  strokeLinecap="round"
                >
                  {(baseOn || isSpine) && (
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.1s" repeatCount="indefinite" />
                  )}
                </path>
                {(baseOn || isSpine) && (
                  <path d={arc(b, a, 0.2)} fill="none" stroke="white" strokeWidth={1} strokeDasharray="1 11" opacity={0.85}>
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.1s" repeatCount="indefinite" />
                  </path>
                )}
              </g>
            );
          })}

          {/* 유산 노드 */}
          {heritageData.map((h) => {
            const p = herPos[h.id];
            if (!p) return null;
            const on = highlightedHeritageIds.has(h.id);
            const dim = anyActive && !on;
            return (
              <g
                key={h.id}
                onMouseEnter={() => setHoveredHeritage(h.id)}
                onMouseLeave={() => setHoveredHeritage(null)}
                style={{ cursor: "pointer" }}
                opacity={dim ? 0.3 : 1}
              >
                <circle cx={p.x} cy={p.y} r={on ? 13 : 10} fill={on ? "var(--color-earth-600)" : "var(--color-earth-500)"} stroke="white" strokeWidth={2.5} />
                <text x={p.x} y={p.y + (on ? 28 : 24)} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-earth-700)">
                  {h.name}
                </text>
                {typeof h.year === "number" && (
                  <text x={p.x} y={p.y + (on ? 41 : 37)} textAnchor="middle" fontSize={9.5} fill="var(--color-charcoal)" opacity={0.6}>
                    {h.year}{tr("년")}
                  </text>
                )}
              </g>
            );
          })}

          {/* 인물 노드 — 시대 인장(印章) */}
          {figures.map((f, i) => {
            const p = figPos[f.id];
            if (!p) return null;
            const col = eraColor(f);
            const on = highlightedFigureIds.has(f.id);
            const isActive = activeFigureId === f.id;
            const dim = anyActive && !on;
            const r = isActive ? 33 : 28;
            return (
              <motion.g
                key={f.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: dim ? 0.28 : 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                onMouseEnter={() => setHoveredFigure(f.id)}
                onMouseLeave={() => setHoveredFigure(null)}
                onClick={() => onSelectFigure(isActive ? null : f.id)}
                style={{ cursor: "pointer" }}
              >
                {/* 인장 외곽(둥근 사각) */}
                <rect
                  x={p.x - r} y={p.y - r} width={r * 2} height={r * 2} rx={10}
                  fill={col}
                  stroke="white" strokeWidth={3}
                  filter={isActive ? "url(#softGlow)" : undefined}
                />
                <rect x={p.x - r + 4} y={p.y - r + 4} width={r * 2 - 8} height={r * 2 - 8} rx={7} fill="none" stroke="white" strokeWidth={1} opacity={0.5} />
                {/* 한자(크게) */}
                <text x={p.x} y={p.y + (f.hanja && f.hanja.length <= 2 ? 7 : 5)} textAnchor="middle" fontSize={f.hanja && f.hanja.length <= 2 ? 22 : 13} fontWeight={800} fill="white">
                  {f.hanja && f.hanja.length <= 3 ? f.hanja : f.name}
                </text>
                {/* 한글 이름 */}
                <text x={p.x} y={p.y + r + 15} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
                  {f.name}
                </text>
                {/* 호/역할 */}
                <text x={p.x} y={p.y + r + 29} textAnchor="middle" fontSize={10} fill="var(--color-charcoal)" opacity={0.65}>
                  {f.ho ?? f.role}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* 활성 인물 상세 카드 */}
        {activeFig && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 rounded-xl border text-sm"
            style={{ borderColor: eraColor(activeFig) + "55", background: eraColor(activeFig) + "0E" }}
          >
            <div className="flex items-baseline flex-wrap gap-2">
              <strong className="text-base" style={{ color: eraColor(activeFig) }}>
                {activeFig.name}
              </strong>
              {activeFig.hanja && <span className="text-[var(--color-charcoal)] opacity-70">{activeFig.hanja}</span>}
              {activeFig.ho && <span className="text-xs text-[var(--color-charcoal)] opacity-60">{activeFig.ho}</span>}
              <span className="text-xs text-[var(--color-charcoal)] opacity-60">
                {activeFig.era ? `${tr(activeFig.era)} · ` : ""}{activeFig.bornYear}–{activeFig.diedYear} · {activeFig.role}
              </span>
            </div>
            <p className="mt-1.5 text-[var(--color-charcoal)] opacity-85 leading-relaxed">
              {activeFig.description}
            </p>
            {(activeFig.links ?? []).length > 0 && (
              <p className="mt-2 text-xs text-[var(--color-charcoal)] opacity-75">
                {tr("학맥")}:{" "}
                {(activeFig.links ?? []).map((lk, idx) => {
                  const t = figures.find((x) => x.id === lk.to);
                  return t ? (
                    <span key={lk.to}>
                      {idx > 0 ? " · " : ""}
                      <strong>{t.name}</strong>{tr("에게")} {tr(lk.label)}({tr(lk.kind)})
                    </span>
                  ) : null;
                })}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
