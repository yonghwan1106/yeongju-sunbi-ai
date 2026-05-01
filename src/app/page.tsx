"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Bot, Target, Map, BookOpen, Globe, Award, ChevronRight } from "lucide-react";
import { heritageData } from "@/data/heritage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const features = [
  {
    icon: <Bot size={24} strokeWidth={1.8} />,
    emoji: "🤖",
    title: "AI 선비 해설사",
    desc: "공공데이터 기반 대화형 문화재 해설. 부석사부터 소수서원까지 AI가 숨겨진 이야기를 들려드립니다.",
    href: "/chat",
    color: "bg-[var(--color-accent-500)]",
    light: "bg-[var(--color-accent-50)] text-[var(--color-accent-600)]",
  },
  {
    icon: <Target size={24} strokeWidth={1.8} />,
    emoji: "🎯",
    title: "선비문화 퀴즈",
    desc: "재미있는 퀴즈로 배우는 영주 역사. 의상대사부터 퇴계 이황까지, 나의 선비 지식을 테스트해보세요.",
    href: "/quiz",
    color: "bg-[var(--color-primary-500)]",
    light: "bg-[var(--color-primary-50)] text-[var(--color-primary-600)]",
  },
  {
    icon: <Map size={24} strokeWidth={1.8} />,
    emoji: "🗺️",
    title: "디지털 스탬프투어",
    desc: "5대 명소 방문 인증 & 배지 수집. 부석사·소수서원·선비촌·무섬마을·소백산을 모두 완주해보세요.",
    href: "/stamp-tour",
    color: "bg-[var(--color-earth-600)]",
    light: "bg-[var(--color-earth-50)] text-[var(--color-earth-700)]",
  },
  {
    icon: <BookOpen size={24} strokeWidth={1.8} />,
    emoji: "📚",
    title: "문화유산 카드",
    desc: "아름다운 카드로 보는 영주 문화재. 유네스코 세계유산부터 숨겨진 명소까지 한눈에 만나보세요.",
    href: "/heritage",
    color: "bg-[var(--color-accent-700)]",
    light: "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]",
  },
];

const categoryColors: Record<string, string> = {
  유네스코: "bg-[var(--color-accent-100)] text-[var(--color-accent-700)]",
  민속문화재: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
  명승: "bg-emerald-100 text-emerald-700",
};

const previewIds = ["buseoksa", "sosuseowon", "museom"];

export default function HomePage() {
  const previewItems = heritageData.filter((h) => previewIds.includes(h.id));

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center pattern-bg">
        {/* Warm gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgb(200 130 42 / 0.08) 0%, transparent 70%), linear-gradient(180deg, transparent 60%, rgb(250 246 239 / 0.9) 100%)",
          }}
        />

        {/* Decorative circles */}
        <div className="absolute top-20 right-[8%] w-72 h-72 rounded-full bg-[var(--color-primary-200)]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-[6%] w-96 h-96 rounded-full bg-[var(--color-accent-200)]/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] px-4 py-1.5 text-xs font-semibold text-[var(--color-primary-700)] mb-6"
            >
              <Globe size={13} />
              유네스코 세계유산 2개 보유 도시
              <span className="ml-1 rounded-full bg-[var(--color-primary-500)] px-2 py-0.5 text-white text-[10px]">
                영주
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.18] tracking-tight text-[var(--color-ink)] mb-6"
            >
              영주의 천년 문화유산,
              <br />
              <span className="text-[var(--color-primary-500)]">AI</span>가 들려주는
              <br />
              숨겨진 이야기
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[var(--color-earth-600)] leading-relaxed mb-10 max-w-xl"
            >
              부석사·소수서원 등 유네스코 세계유산과 선비 문화의 고장 영주를
              <strong className="font-semibold text-[var(--color-charcoal)]"> 공공데이터 기반 AI 해설사</strong>가
              생생하게 안내합니다.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-500)] px-6 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-warm-lg)] hover:bg-[var(--color-primary-600)] hover:shadow-[var(--shadow-warm-xl)] hover:-translate-y-0.5 active:scale-95"
              >
                <Bot size={17} strokeWidth={2} />
                AI 해설사와 대화하기
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              <Link
                href="/heritage"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-primary-300)] bg-white/70 backdrop-blur-sm px-6 py-3.5 text-sm font-bold text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] hover:border-[var(--color-primary-400)] hover:-translate-y-0.5 active:scale-95"
              >
                문화유산 둘러보기
                <ChevronRight size={15} strokeWidth={2.2} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-6"
            >
              {[
                { value: "2개", label: "유네스코 세계유산" },
                { value: "5개소", label: "스탬프투어 명소" },
                { value: "5개", label: "공공데이터 기관" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-2xl font-black text-[var(--color-primary-500)]">{stat.value}</p>
                  <p className="text-xs text-[var(--color-earth-500)] font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[var(--color-ivory)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-[var(--color-primary-500)] uppercase tracking-widest mb-3"
            >
              주요 서비스
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] leading-tight"
            >
              영주 문화유산을 더 깊이<br />경험하는 방법
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i}>
                <Link
                  href={f.href}
                  className="group flex flex-col h-full rounded-2xl bg-white border border-[var(--color-parchment)] p-6 shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-lg)] hover:-translate-y-1.5 transition-all duration-200"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.light}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-primary-600)] transition-colors">
                    {f.emoji} {f.title}
                  </h3>
                  <p className="text-sm text-[var(--color-earth-600)] leading-relaxed flex-1">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--color-primary-500)] group-hover:gap-2 transition-all">
                    바로가기 <ArrowRight size={13} strokeWidth={2.5} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Heritage Preview ── */}
      <section className="py-20 sm:py-28 pattern-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <motion.p
                variants={fadeUp}
                custom={0}
                className="text-sm font-semibold text-[var(--color-primary-500)] uppercase tracking-widest mb-3"
              >
                문화유산 둘러보기
              </motion.p>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] leading-tight"
              >
                영주의 대표 명소
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/heritage"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors"
              >
                전체 보기 <ArrowRight size={14} strokeWidth={2.3} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {previewItems.map((h, i) => (
              <motion.div key={h.id} variants={fadeUp} custom={i}>
                <Link
                  href={`/heritage/${h.id}`}
                  className="group block rounded-2xl bg-white border border-[var(--color-parchment)] overflow-hidden shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-xl)] hover:-translate-y-1.5 transition-all duration-200"
                >
                  {/* Card-news cover image */}
                  <div className="relative h-44 bg-gradient-to-br from-[var(--color-primary-100)] via-[var(--color-earth-100)] to-[var(--color-accent-100)] flex items-center justify-center overflow-hidden">
                    {h.images[0] ? (
                      <Image
                        src={h.images[0]}
                        alt={`${h.name} 카드뉴스 이미지`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-300">
                        {h.id === "buseoksa" ? "🛕" : h.id === "sosuseowon" ? "📜" : "🌉"}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                    <span
                      className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        categoryColors[h.category] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {h.category}
                    </span>
                    {h.category === "유네스코" && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[var(--color-accent-600)]/90 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        <Award size={10} /> UNESCO
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-primary-600)] transition-colors mb-1">
                      {h.name}
                    </h3>
                    <p className="text-xs text-[var(--color-earth-500)] mb-2">{h.nameEn}</p>
                    <p className="text-sm text-[var(--color-earth-600)] leading-relaxed line-clamp-2">{h.description}</p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {h.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[var(--color-primary-50)] px-2 py-0.5 text-[11px] text-[var(--color-primary-600)] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--color-primary-500)] group-hover:gap-2 transition-all">
                      자세히 보기 <ArrowRight size={12} strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Public Data Banner ── */}
      <section className="bg-[var(--color-accent-900)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-700)]/60 px-4 py-1.5 text-xs font-semibold text-[var(--color-accent-200)] mb-5">
              📊 공공데이터 활용
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-3 leading-snug">
              신뢰할 수 있는 공공데이터로 만든 서비스
            </h2>
            <p className="text-sm text-[var(--color-accent-300)] leading-relaxed max-w-2xl mx-auto">
              본 서비스는 <strong className="text-white font-semibold">문화재청, 한국관광공사, 기상청, 영주시청, 국토교통부</strong> 등
              5개 기관의 공공데이터를 활용합니다. 정확하고 최신화된 정보를 바탕으로 영주 문화유산을 소개합니다.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["문화재청 문화재정보", "한국관광공사 관광정보", "기상청 날씨정보", "영주시 지역정보", "국토교통부 지도정보"].map(
                (src) => (
                  <span
                    key={src}
                    className="rounded-full border border-[var(--color-accent-600)] bg-[var(--color-accent-800)]/50 px-3 py-1 text-xs text-[var(--color-accent-300)]"
                  >
                    {src}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[var(--color-primary-500)] py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-4xl mb-4">🏛️</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
              지금 바로 AI 선비 해설사와<br />대화를 시작해보세요
            </h2>
            <p className="text-sm text-[var(--color-primary-100)] mb-8">
              부석사의 무량수전, 소수서원의 선비정신… 궁금한 것은 무엇이든 물어보세요.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[var(--color-primary-700)] shadow-[var(--shadow-warm-xl)] hover:bg-[var(--color-primary-50)] hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Bot size={17} strokeWidth={2} />
              AI 해설사 시작하기
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
