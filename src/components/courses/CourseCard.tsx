"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Clock, Tag, X, MapPin, Bus } from "lucide-react";
import { CourseRecommendation } from "@/types";

interface CourseCardProps {
  course: CourseRecommendation;
}

const themeConfig: Record<
  CourseRecommendation["theme"],
  { bgClass: string; textClass: string; gradientClass: string }
> = {
  역사탐방: {
    bgClass: "bg-amber-100",
    textClass: "text-amber-800",
    gradientClass: "from-amber-500 to-orange-600",
  },
  건축감상: {
    bgClass: "bg-stone-100",
    textClass: "text-stone-700",
    gradientClass: "from-stone-500 to-amber-700",
  },
  선비체험: {
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
    gradientClass: "from-emerald-500 to-teal-700",
  },
  자연힐링: {
    bgClass: "bg-teal-100",
    textClass: "text-teal-800",
    gradientClass: "from-teal-500 to-cyan-700",
  },
  가족나들이: {
    bgClass: "bg-violet-100",
    textClass: "text-violet-800",
    gradientClass: "from-violet-500 to-purple-700",
  },
};

export default function CourseCard({ course }: CourseCardProps) {
  const [open, setOpen] = useState(false);
  const config = themeConfig[course.theme];
  const coverImage = course.spots[0]?.images[0];

  return (
    <>
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 20px 40px -8px rgb(139 90 43 / 0.22)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => setOpen(true)}
        className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] group flex flex-col h-full"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        aria-label={`${course.name} 자세히 보기`}
      >
        {/* Cover */}
        <div
          className={`relative h-48 bg-gradient-to-br ${config.gradientClass} flex items-center justify-center overflow-hidden`}
        >
          {coverImage ? (
            <Image
              src={coverImage}
              alt={`${course.name} 표지 이미지`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-white text-5xl font-bold opacity-30 select-none">
              {course.name.charAt(0)}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

          {/* Duration badge */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[var(--color-primary-700)] text-xs font-semibold shadow-sm">
            <Clock className="w-3 h-3" />
            {course.duration}
          </span>

          {/* Theme tag */}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${config.bgClass} ${config.textClass}`}
          >
            {course.theme}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-primary-600)] transition-colors line-clamp-1">
            {course.name}
          </h3>
          <p className="text-sm text-[var(--color-charcoal)] opacity-75 line-clamp-3 leading-relaxed">
            {course.description}
          </p>

          {/* Spots quick list */}
          <div className="flex flex-wrap gap-1 mt-1">
            {course.spots.slice(0, 4).map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs rounded-full"
              >
                <Tag className="w-2.5 h-2.5" />
                {s.name}
              </span>
            ))}
          </div>

          {/* Transport footer */}
          {course.transport && (
            <div className="flex items-center gap-1.5 mt-auto pt-2 text-xs text-[var(--color-charcoal)] opacity-70">
              <Bus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{course.transport}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`course-${course.id}-title`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[var(--color-cream)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto"
            >
              {/* Header bar */}
              <div
                className={`relative h-32 bg-gradient-to-br ${config.gradientClass} px-6 py-4 flex items-end`}
              >
                <div className="absolute inset-0 pattern-bg opacity-25" />
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-[var(--color-ink)] flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="닫기"
                >
                  <X size={18} />
                </button>
                <div className="relative z-10 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {course.duration}
                    </span>
                    <span className="text-xs bg-white/25 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {course.theme}
                    </span>
                  </div>
                  <h2
                    id={`course-${course.id}-title`}
                    className="text-2xl font-bold leading-tight"
                  >
                    {course.name}
                  </h2>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                  {course.description}
                </p>

                {/* Highlights */}
                {course.highlights && course.highlights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-ink)] mb-2">
                      코스 하이라이트
                    </h3>
                    <ul className="flex flex-col gap-1.5">
                      {course.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-[var(--color-charcoal)] leading-relaxed"
                        >
                          <span className="text-[var(--color-primary-500)] mt-0.5">
                            ◆
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Spots */}
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-ink)] mb-2">
                    방문 장소 ({course.spots.length}곳)
                  </h3>
                  <ol className="flex flex-col gap-2">
                    {course.spots.map((spot, i) => (
                      <li
                        key={spot.id}
                        className="flex gap-3 p-3 bg-white rounded-xl border border-[var(--color-parchment)]"
                      >
                        <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--color-primary-500)] text-white text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="text-sm font-semibold text-[var(--color-ink)]">
                            {spot.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[var(--color-charcoal)] opacity-70">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {spot.location.address}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--color-charcoal)] opacity-80 line-clamp-2 leading-relaxed mt-0.5">
                            {spot.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Season + transport */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[var(--color-parchment)]">
                  {course.season && course.season.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--color-charcoal)] opacity-70 mb-1">
                        추천 계절
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {course.season.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {course.transport && (
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--color-charcoal)] opacity-70 mb-1">
                        교통편
                      </h4>
                      <p className="flex items-center gap-1 text-xs text-[var(--color-charcoal)] leading-relaxed">
                        <Bus className="w-3.5 h-3.5 shrink-0" />
                        <span>{course.transport}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
