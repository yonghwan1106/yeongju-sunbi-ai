"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle, MapPin } from "lucide-react";
import { useState } from "react";

interface StampCardProps {
  id: string;
  name: string;
  description: string;
  collected: boolean;
  gradientClass: string;
  onVisitPrompt?: () => void;
}

export default function StampCard({
  id,
  name,
  description,
  collected,
  gradientClass,
  onVisitPrompt,
}: StampCardProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  function handleClick() {
    if (!collected) {
      setShowPrompt(true);
      onVisitPrompt?.();
      setTimeout(() => setShowPrompt(false), 2500);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 relative">
      {/* Stamp circle */}
      <motion.button
        whileHover={{ scale: collected ? 1.05 : 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        className={`relative w-28 h-28 rounded-full flex items-center justify-center overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] ${
          collected ? "cursor-default" : "cursor-pointer"
        }`}
        aria-label={collected ? `${name} 수집 완료` : `${name} - 미수집`}
      >
        {collected ? (
          <>
            {/* Collected: colorful stamp */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
            />
            {/* Stamp border ring */}
            <div className="absolute inset-1 rounded-full border-4 border-white/40" />
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/60" />
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <CheckCircle className="w-8 h-8 text-white drop-shadow" />
              <span className="text-white text-xs font-bold drop-shadow leading-tight text-center px-2">
                {name.length > 4 ? name.slice(0, 4) : name}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Uncollected: gray dashed */}
            <div className="absolute inset-0 bg-gray-100 rounded-full" />
            <div className="absolute inset-1 rounded-full border-4 border-dashed border-gray-300" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <Lock className="w-7 h-7 text-gray-400" />
              <span className="text-gray-400 text-xs font-medium">미수집</span>
            </div>
          </>
        )}
      </motion.button>

      {/* Name & description */}
      <div className="text-center">
        <p
          className={`text-sm font-semibold ${
            collected ? "text-[var(--color-ink)]" : "text-gray-400"
          }`}
        >
          {name}
        </p>
        <p
          className={`text-xs mt-0.5 leading-snug max-w-[7rem] ${
            collected ? "text-[var(--color-charcoal)] opacity-70" : "text-gray-400"
          }`}
        >
          {description}
        </p>
      </div>

      {/* Visit prompt tooltip */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[var(--color-ink)] text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-20 flex items-center gap-1.5"
          >
            <MapPin className="w-3 h-3 shrink-0" />
            이 문화유산을 방문하세요!
            {/* Arrow */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--color-ink)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
