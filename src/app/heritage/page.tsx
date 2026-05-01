"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Search } from "lucide-react";
import { heritageData } from "@/data/heritage";
import { Heritage } from "@/types";
import HeritageCard from "@/components/heritage/HeritageCard";

type FilterCategory = "전체" | Heritage["category"];

const FILTER_TABS: { label: string; value: FilterCategory }[] = [
  { label: "전체", value: "전체" },
  { label: "유네스코", value: "유네스코" },
  { label: "국보/보물", value: "국보" },
  { label: "민속문화재", value: "민속문화재" },
  { label: "명승", value: "명승" },
];

export default function HeritagePage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = heritageData.filter((h) => {
    const matchesFilter =
      activeFilter === "전체" ||
      h.category === activeFilter ||
      (activeFilter === "국보" && (h.category === "국보" || h.category === "보물"));
    const matchesSearch =
      searchQuery.trim() === "" ||
      h.name.includes(searchQuery) ||
      h.description.includes(searchQuery) ||
      h.tags.some((t) => t.includes(searchQuery));
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero banner */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary-800)] via-[var(--color-primary-700)] to-[var(--color-earth-700)] text-white overflow-hidden">
        <div className="absolute inset-0 pattern-bg opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium">
              <Landmark className="w-4 h-4" />
              영주시 문화유산
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              영주 문화유산
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
              유네스코 세계유산부터 숨겨진 명소까지, 선비의 고장 영주가 품은
              소중한 문화유산을 만나보세요.
            </p>

            {/* Search */}
            <div className="relative w-full max-w-md mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="문화유산 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/15 border border-white/25 rounded-full text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="sticky top-0 z-20 bg-[var(--color-cream)] border-b border-[var(--color-parchment)] shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === tab.value
                    ? "bg-[var(--color-primary-600)] text-white shadow-sm"
                    : "bg-[var(--color-ivory)] text-[var(--color-charcoal)] hover:bg-[var(--color-primary-100)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-charcoal)] opacity-50">
            <Landmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--color-charcoal)] opacity-60 mb-6">
              총 {filtered.length}개의 문화유산
            </p>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((heritage, i) => (
                <motion.div
                  key={heritage.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                >
                  <HeritageCard heritage={heritage} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
}
