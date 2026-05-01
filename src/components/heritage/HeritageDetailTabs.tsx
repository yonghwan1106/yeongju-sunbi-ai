"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heritage } from "@/types";

interface Tab {
  id: string;
  label: string;
  content: string | undefined;
}

interface HeritageDetailTabsProps {
  heritage: Heritage;
}

export default function HeritageDetailTabs({ heritage }: HeritageDetailTabsProps) {
  const tabs: Tab[] = [
    { id: "intro", label: "소개", content: heritage.description },
    { id: "history", label: "역사", content: heritage.history },
    { id: "architecture", label: "건축", content: heritage.architecture },
    { id: "hidden", label: "숨겨진 이야기", content: heritage.hiddenStory },
  ].filter((t) => !!t.content);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "intro");
  const activeContent = tabs.find((t) => t.id === activeTab)?.content ?? "";

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] overflow-hidden">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-[var(--color-parchment)] scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-5 py-3 text-sm font-medium relative transition-colors ${
              activeTab === tab.id
                ? "text-[var(--color-primary-700)]"
                : "text-[var(--color-charcoal)] opacity-50 hover:opacity-80"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-500)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="p-5"
        >
          <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
            {activeContent}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
