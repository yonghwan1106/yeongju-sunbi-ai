"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Tag } from "lucide-react";
import { Heritage } from "@/types";

interface HeritageCardProps {
  heritage: Heritage;
}

const categoryConfig: Record<
  Heritage["category"],
  { label: string; bgClass: string; textClass: string; gradientClass: string }
> = {
  유네스코: {
    label: "유네스코",
    bgClass: "bg-amber-100",
    textClass: "text-amber-800",
    gradientClass: "from-amber-400 to-yellow-600",
  },
  국보: {
    label: "국보",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
    gradientClass: "from-red-400 to-rose-600",
  },
  보물: {
    label: "보물",
    bgClass: "bg-orange-100",
    textClass: "text-orange-800",
    gradientClass: "from-orange-400 to-amber-600",
  },
  사적: {
    label: "사적",
    bgClass: "bg-stone-100",
    textClass: "text-stone-700",
    gradientClass: "from-stone-400 to-stone-600",
  },
  명승: {
    label: "명승",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-800",
    gradientClass: "from-emerald-400 to-green-600",
  },
  천연기념물: {
    label: "천연기념물",
    bgClass: "bg-teal-100",
    textClass: "text-teal-800",
    gradientClass: "from-teal-400 to-cyan-600",
  },
  민속문화재: {
    label: "민속문화재",
    bgClass: "bg-violet-100",
    textClass: "text-violet-800",
    gradientClass: "from-violet-400 to-purple-600",
  },
};

export default function HeritageCard({ heritage }: HeritageCardProps) {
  const router = useRouter();
  const config = categoryConfig[heritage.category] ?? categoryConfig["사적"];
  const imageSrc = heritage.images[0];

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 40px -8px rgb(139 90 43 / 0.22)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => router.push(`/heritage/${heritage.id}`)}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/heritage/${heritage.id}`)}
    >
      {/* Card-news cover image */}
      <div
        className={`relative h-48 bg-gradient-to-br ${config.gradientClass} flex items-center justify-center overflow-hidden`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${heritage.name} 카드뉴스 이미지`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20 pattern-bg" />
            <span className="text-white text-5xl font-bold opacity-30 select-none">
              {heritage.name.charAt(0)}
            </span>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${config.bgClass} ${config.textClass}`}
        >
          {config.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-primary-600)] transition-colors line-clamp-1">
          {heritage.name}
        </h3>
        <p className="text-sm text-[var(--color-charcoal)] opacity-75 line-clamp-2 leading-relaxed">
          {heritage.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-1">
          {heritage.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs rounded-full"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-xs text-[var(--color-charcoal)] opacity-60">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{heritage.location.address}</span>
        </div>
      </div>
    </motion.div>
  );
}
