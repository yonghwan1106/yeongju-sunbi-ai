"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Stamp, Trophy, Info, BookOpen } from "lucide-react";
import { heritageData } from "@/data/heritage";
import StampCard from "@/components/stamp/StampCard";
import Link from "next/link";

const STORAGE_KEY = "yeongju-collected-stamps";

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

// Map heritageData to stamp spots (first 5)
const stampSpots = heritageData.slice(0, 5).map((h) => ({
  id: h.stampId ?? h.id,
  heritageId: h.id,
  name: h.name,
  description: h.description.slice(0, 25) + "…",
  gradient: STAMP_GRADIENTS[h.id] ?? "from-gray-400 to-gray-600",
}));

export default function StampTourPage() {
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        setCollectedIds(new Set(parsed));
      }
    } catch {
      // ignore
    }
  }, []);

  // Demo: collect a stamp by clicking (for demo purposes)
  function handleCollect(stampId: string) {
    // In a real app, verify GPS visit; here we allow demo collection
    const next = new Set(collectedIds);
    next.add(stampId);
    setCollectedIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  }

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
        </div>
      </section>

      {/* Info banner */}
      <section className="max-w-2xl mx-auto px-4 pt-6">
        <div className="bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] rounded-xl px-4 py-3 flex gap-3 items-start">
          <Info className="w-4 h-4 text-[var(--color-primary-600)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--color-primary-800)] leading-relaxed">
            미수집 스탬프를 클릭하면 방문 안내를 확인할 수 있습니다. 실제 서비스에서는 현장 QR 코드
            스캔 또는 GPS 인증으로 스탬프가 수집됩니다.
            <br />
            <strong>데모 모드:</strong> 아래 &apos;수집하기&apos; 버튼으로 체험해보세요.
          </p>
        </div>
      </section>

      {/* Stamps grid */}
      <section className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-lg font-bold text-[var(--color-ink)] mb-8 text-center">
          수집 스탬프 목록
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {stampSpots.map((spot, i) => (
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
                collected={collectedIds.has(spot.id)}
                gradientClass={spot.gradient}
              />
              {/* Demo collect button */}
              {!collectedIds.has(spot.id) && (
                <button
                  onClick={() => handleCollect(spot.id)}
                  className="text-xs px-3 py-1 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)] transition-colors"
                >
                  수집하기 (데모)
                </button>
              )}
              {collectedIds.has(spot.id) && (
                <Link
                  href={`/heritage/${spot.heritageId}`}
                  className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                >
                  상세 보기
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Badge gallery */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-parchment)] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--color-primary-500)]" />
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
              >
                <span className="text-3xl">{badge.unlocked ? badge.icon : "🔒"}</span>
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
          >
            <BookOpen className="w-4 h-4" />
            문화유산 탐방하기
          </Link>
          <Link
            href="/quiz"
            className="px-5 py-3 border-2 border-[var(--color-primary-300)] text-[var(--color-primary-700)] text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-50)] transition-all flex items-center gap-2"
          >
            퀴즈 도전하기
          </Link>
        </div>
      </section>
    </main>
  );
}
