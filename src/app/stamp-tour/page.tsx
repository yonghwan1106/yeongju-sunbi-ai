"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stamp, Trophy, Info, BookOpen, MapPin, Navigation, FlaskConical } from "lucide-react";
import { heritageData } from "@/data/active";
import { getActiveCity } from "@/config/city";
import { getSessionId, getClassCode, setClassCode } from "@/lib/utils/session";
import StampCard from "@/components/stamp/StampCard";
import Link from "next/link";
import { haversineMeters, within, type Coord } from "@/lib/utils/geofence";

const STORAGE_KEY = `sunbi-collected-stamps-${getActiveCity().id}`;
const CHECKIN_RADIUS_M = 100;

interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredCount: number;
  unlocked: boolean;
}

const STAMP_GRADIENTS: Record<string, string> = {
  buseoksa: "from-amber-400 to-yellow-600",
  sosuseowon: "from-blue-400 to-indigo-600",
  sunbichon: "from-violet-400 to-purple-600",
  museom: "from-teal-400 to-cyan-600",
  sobaeksan: "from-emerald-400 to-green-600",
};

const BADGES: Omit<BadgeInfo, "unlocked">[] = [
  { id: "b1", name: "첫 발걸음", description: "첫 번째 스탬프 수집", icon: "🌱", requiredCount: 1 },
  { id: "b2", name: "탐방가", description: "3개 스탬프 수집", icon: "🗺️", requiredCount: 3 },
  { id: "b3", name: "영주 선비", description: "모든 스탬프 수집", icon: "🏆", requiredCount: 5 },
];

// Map heritageData to stamp spots (first 5), including coordinates
const stampSpots = heritageData.slice(0, 5).map((h) => ({
  id: h.stampId ?? h.id,
  heritageId: h.id,
  name: h.name,
  description: h.description.slice(0, 25) + "…",
  gradient: STAMP_GRADIENTS[h.id] ?? "from-gray-400 to-gray-600",
  coord: { lat: h.location.lat, lng: h.location.lng } satisfies Coord,
}));

type Mode = "gps" | "demo";

export default function StampTourPage() {
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("demo");
  const [userCoord, setUserCoord] = useState<Coord | null>(null);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [classCode, setClassCodeState] = useState("");

  // Load stamps from localStorage + attempt GPS on mount
  useEffect(() => {
    setMounted(true);
    setClassCodeState(getClassCode());

    // Restore stamps
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        setCollectedIds(new Set(parsed));
      }
    } catch {
      // ignore parse errors
    }

    // Attempt geolocation — all error paths lead to demo mode
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setMode("gps");
        },
        (_err) => {
          // Permission denied, timeout, or unavailable — graceful fallback
          setMode("demo");
          setShowFallbackModal(true);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      // geolocation not supported at all
      setMode("demo");
    }
  }, []);

  // Collect a stamp (used in both GPS-verified and demo mode)
  const handleCollect = useCallback(
    (stampId: string) => {
      const next = new Set(collectedIds);
      next.add(stampId);
      setCollectedIds(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore storage errors
      }
      // fire-and-forget 이벤트 로깅 (실패해도 앱 동작 무관)
      const spot = stampSpots.find((s) => s.id === stampId);
      if (spot) {
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "stamp",
            heritage_id: spot.heritageId,
            session_id: getSessionId(),
            class_code: getClassCode(),
          }),
        }).catch(() => {});
      }
    },
    [collectedIds]
  );

  const switchToDemo = useCallback(() => {
    setMode("demo");
    setShowFallbackModal(false);
  }, []);

  const collectedCount = collectedIds.size;
  const totalCount = stampSpots.length;
  const progressPct = (collectedCount / totalCount) * 100;

  const badges: BadgeInfo[] = BADGES.map((b) => ({
    ...b,
    unlocked: collectedCount >= b.requiredCount,
  }));

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-primary-300)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      {/* GPS Permission Denied Modal */}
      <AnimatePresence>
        {showFallbackModal && (
          <motion.div
            key="gps-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", background: "rgba(0,0,0,0.45)" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gps-modal-title"
            aria-describedby="gps-modal-desc"
          >
            <motion.div
              key="gps-modal-card"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4 text-center"
            >
              <div className="text-4xl" role="img" aria-label="체험 모드 아이콘">🧪</div>
              <h2
                id="gps-modal-title"
                className="text-lg font-bold text-[var(--color-ink)]"
              >
                체험 모드
              </h2>
              <p
                id="gps-modal-desc"
                className="text-sm text-[var(--color-charcoal)] leading-relaxed"
              >
                영주 현장에서는 GPS로 검증됩니다.
                <br />
                지금은 <strong>체험 모드</strong>로 진행합니다.
              </p>
              <button
                onClick={switchToDemo}
                className="mt-1 w-full py-3 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white font-semibold rounded-xl transition-colors text-sm"
                aria-label="체험 모드로 진행하기"
              >
                체험 모드로 진행
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[var(--color-earth-700)] via-[var(--color-primary-700)] to-[var(--color-primary-800)] text-white overflow-hidden">
        <div className="absolute inset-0 pattern-bg opacity-30" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-14 text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium">
            <Stamp className="w-4 h-4" />
            디지털 스탬프투어
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            영주 문화유산
            <br />
            디지털 스탬프투어
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-sm">
            영주의 다섯 가지 문화유산을 탐방하고 스탬프를 수집하세요.
            모든 스탬프를 모으면 특별한 배지가 주어집니다!
          </p>

          {/* Progress */}
          <div className="w-full max-w-sm bg-white/20 rounded-2xl p-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">스탬프 수집 현황</span>
              <span className="text-lg font-bold">
                {collectedCount}
                <span className="text-white/60 text-sm font-normal"> / {totalCount}</span>
              </span>
            </div>
            <div className="h-3 bg-white/25 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* 교실코드 입력 (선택) */}
          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="교실코드 입력 (선택, 예: ENG-2A)"
              value={classCode}
              onChange={(e) => {
                setClassCodeState(e.target.value);
                setClassCode(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder:text-white/50 text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              maxLength={20}
              aria-label="교실코드 (선택)"
            />
          </div>
        </div>
      </section>

      {/* Mode banner */}
      <section className="max-w-2xl mx-auto px-4 pt-6">
        <div
          className={`rounded-xl px-4 py-3 flex gap-3 items-start border ${
            mode === "gps"
              ? "bg-emerald-50 border-emerald-200"
              : "bg-[var(--color-primary-50)] border-[var(--color-primary-100)]"
          }`}
        >
          {mode === "gps" ? (
            <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <Info className="w-4 h-4 text-[var(--color-primary-600)] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs leading-relaxed ${
                mode === "gps" ? "text-emerald-800" : "text-[var(--color-primary-800)]"
              }`}
            >
              {mode === "gps"
                ? "📍 GPS 실시간 검증 모드 (영주 현장 방문 시) — 각 유산 100m 반경 진입 시 체크인이 활성화됩니다."
                : "🧪 체험 모드 — 영주 현장에서는 GPS 100m 반경으로 자동 검증됩니다. 지금은 모든 체크인 버튼을 직접 누를 수 있습니다."}
            </p>
          </div>
          {/* Always-visible toggle to demo mode */}
          {mode === "gps" && (
            <button
              onClick={switchToDemo}
              className="shrink-0 text-xs px-3 py-1 rounded-full bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap"
              aria-label="체험 모드로 전환"
            >
              <FlaskConical className="w-3 h-3 inline mr-1" aria-hidden="true" />
              체험 모드
            </button>
          )}
        </div>
      </section>

      {/* Stamps grid */}
      <section className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-lg font-bold text-[var(--color-ink)] mb-8 text-center">
          수집 스탬프 목록
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {stampSpots.map((spot, i) => {
            const isCollected = collectedIds.has(spot.id);
            const distanceM =
              mode === "gps" && userCoord
                ? Math.round(haversineMeters(userCoord, spot.coord))
                : null;
            const canCheckin =
              mode === "demo" ||
              (mode === "gps" && userCoord
                ? within(userCoord, spot.coord, CHECKIN_RADIUS_M)
                : false);

            return (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <StampCard
                  id={spot.id}
                  name={spot.name}
                  description={spot.description}
                  collected={isCollected}
                  gradientClass={spot.gradient}
                />

                {/* Distance indicator in GPS mode */}
                {mode === "gps" && distanceM !== null && !isCollected && (
                  <div className="flex items-center gap-1 text-xs text-gray-500" aria-label={`현 위치에서 ${distanceM}미터`}>
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    현 위치에서 {distanceM.toLocaleString()}m
                  </div>
                )}

                {/* Check-in / detail button */}
                {!isCollected ? (
                  <button
                    onClick={() => canCheckin && handleCollect(spot.id)}
                    disabled={!canCheckin}
                    aria-label={
                      canCheckin
                        ? `${spot.name} 체크인`
                        : `${spot.name} 체크인 — ${distanceM ?? 0}m, 100m 이내로 이동하세요`
                    }
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                      canCheckin
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)] cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {canCheckin
                      ? "체크인"
                      : `${(distanceM ?? 0).toLocaleString()}m — 100m 이내로 이동`}
                  </button>
                ) : (
                  <Link
                    href={`/heritage/${spot.heritageId}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                    aria-label={`${spot.name} 상세 보기`}
                  >
                    상세 보기
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Badge gallery */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-parchment)] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--color-primary-500)]" aria-hidden="true" />
            <h2 className="text-base font-bold text-[var(--color-ink)]">배지 갤러리</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                animate={{ scale: badge.unlocked ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.4 }}
                className={`rounded-xl p-4 text-center flex flex-col items-center gap-2 border-2 transition-all ${
                  badge.unlocked
                    ? "border-[var(--color-primary-300)] bg-[var(--color-primary-50)]"
                    : "border-[var(--color-parchment)] bg-gray-50 opacity-50"
                }`}
                aria-label={`배지: ${badge.name} — ${badge.unlocked ? "획득됨" : `${badge.requiredCount}개 수집 시 해금`}`}
              >
                <span className="text-3xl" role="img" aria-hidden="true">
                  {badge.unlocked ? badge.icon : "🔒"}
                </span>
                <p
                  className={`text-sm font-bold ${
                    badge.unlocked ? "text-[var(--color-primary-700)]" : "text-gray-400"
                  }`}
                >
                  {badge.name}
                </p>
                <p className="text-xs text-[var(--color-charcoal)] opacity-60">
                  {badge.description}
                </p>
                {!badge.unlocked && (
                  <p className="text-xs text-gray-400">
                    {badge.requiredCount}개 수집 시 해금
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href="/heritage"
            className="px-5 py-3 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white text-sm font-semibold rounded-xl shadow-[var(--shadow-warm-sm)] transition-all flex items-center gap-2"
            aria-label="문화유산 탐방하기"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            문화유산 탐방하기
          </Link>
          <Link
            href="/quiz"
            className="px-5 py-3 border-2 border-[var(--color-primary-300)] text-[var(--color-primary-700)] text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-50)] transition-all flex items-center gap-2"
            aria-label="퀴즈 도전하기"
          >
            퀴즈 도전하기
          </Link>
        </div>
      </section>
    </main>
  );
}
