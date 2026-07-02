"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Bot, Target, Map, BookOpen, Globe, Award, ChevronRight, ShieldCheck, Network, Sparkles, Check, X, Triangle } from "lucide-react";
import { heritageData } from "@/data/active";
import { getActiveCity } from "@/config/city";
import { t, cityLabel } from "@/i18n/ui";
import { isEn } from "@/config/locale";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

// features는 컴포넌트 안에서 city 파생값으로 구성됩니다

const categoryColors: Record<string, string> = {
  유네스코: "bg-[var(--color-accent-100)] text-[var(--color-accent-700)]",
  민속문화재: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
  명승: "bg-emerald-100 text-emerald-700",
};

// ── 경쟁 비교(차별성) — 영주 PT 슬라이드 반영 ──
const edgeColumns = [
  "대화형 AI 해설",
  "5종 공공데이터 실시간",
  "영주 특화 콘텐츠",
  "게이미피케이션·현장유도",
];

type EdgeMarkType = "o" | "x" | "tri";
interface EdgeCell {
  mark: EdgeMarkType;
  note?: string;
}
interface EdgeRow {
  name: string;
  tag?: string;
  cells: EdgeCell[];
}

const edgeCompetitors: EdgeRow[] = [
  { name: "대한민국 구석구석", tag: "한국관광공사", cells: [{ mark: "x" }, { mark: "x" }, { mark: "tri", note: "전국 범용" }, { mark: "x" }] },
  { name: "해설이 있는 여행", tag: "오디오 가이드", cells: [{ mark: "x" }, { mark: "x" }, { mark: "x", note: "영주 미지원" }, { mark: "x" }] },
  { name: "문화재청 앱", tag: "공식 앱", cells: [{ mark: "x" }, { mark: "tri", note: "정보 열람" }, { mark: "x" }, { mark: "x" }] },
  { name: "ChatGPT 직접 질문", tag: "범용 AI", cells: [{ mark: "tri", note: "대화만" }, { mark: "x", note: "미연동" }, { mark: "x" }, { mark: "x" }] },
];

const edgeOurs: EdgeRow = {
  name: "영주선비AI",
  cells: [{ mark: "o" }, { mark: "o", note: "5종" }, { mark: "o" }, { mark: "o" }],
};

const edgeHighlights = [
  {
    icon: <ShieldCheck size={22} strokeWidth={1.8} />,
    title: "Agentic RAG · 출처 명시",
    desc: "5종 공공데이터를 도구로 자율 연쇄 호출하고 출처를 붙여, 환각을 구조적으로 차단합니다.",
  },
  {
    icon: <Network size={22} strokeWidth={1.8} />,
    title: "천 년 학맥 지식그래프",
    desc: "신라~조선 인물·유산을 도통(道統)으로 연결한 영주 고유 자산 — 코드만으로는 복제 불가.",
  },
  {
    icon: <Sparkles size={22} strokeWidth={1.8} />,
    title: "교육+관광+게이미피케이션 융합",
    desc: "해설·퀴즈·GPS 스탬프·코스를 한 곳에서 — 배우며 즐기는 체험으로 체류·재방문을 높입니다.",
  },
];

function EdgeMark({ mark }: { mark: EdgeMarkType }) {
  if (mark === "o")
    return <Check size={18} strokeWidth={3} className="text-[var(--color-primary-600)]" aria-hidden />;
  if (mark === "tri")
    return <Triangle size={13} strokeWidth={2.5} className="text-[var(--color-earth-400)]" aria-hidden />;
  return <X size={16} strokeWidth={2.4} className="text-[var(--color-earth-400)]" aria-hidden />;
}

export default function HomePage() {
  const city = getActiveCity();
  const top2 = heritageData.slice(0, 2).map((h) => h.name);
  const previewItems = heritageData.slice(0, 3);

  const features = [
    {
      icon: <Bot size={24} strokeWidth={1.8} />,
      emoji: "🤖",
      title: t("AI 선비 해설사"),
      desc: `공공데이터 기반 대화형 문화재 해설. ${top2.join("·")} 등 AI가 숨겨진 이야기를 들려드립니다.`,
      href: "/chat",
      color: "bg-[var(--color-accent-500)]",
      light: "bg-[var(--color-accent-50)] text-[var(--color-accent-600)]",
    },
    {
      icon: <Target size={24} strokeWidth={1.8} />,
      emoji: "🎯",
      title: t("선비문화 퀴즈"),
      desc: t("재미있는 퀴즈로 배우는 {city} 역사. 나의 선비 지식을 테스트해보세요."),
      href: "/quiz",
      color: "bg-[var(--color-primary-500)]",
      light: "bg-[var(--color-primary-50)] text-[var(--color-primary-600)]",
    },
    {
      icon: <Map size={24} strokeWidth={1.8} />,
      emoji: "🗺️",
      title: t("디지털 스탬프투어"),
      desc: t("대표 명소 방문 인증 & 배지 수집. {city}의 주요 명소를 모두 완주해보세요."),
      href: "/stamp-tour",
      color: "bg-[var(--color-earth-600)]",
      light: "bg-[var(--color-earth-50)] text-[var(--color-earth-700)]",
    },
    {
      icon: <BookOpen size={24} strokeWidth={1.8} />,
      emoji: "📚",
      title: t("문화유산 카드"),
      desc: t("아름다운 카드로 보는 {city} 문화재. 유네스코 세계유산부터 숨겨진 명소까지 한눈에 만나보세요."),
      href: "/heritage",
      color: "bg-[var(--color-accent-700)]",
      light: "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]",
    },
  ];

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
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
            <div className="max-w-2xl">
            {/* Contest Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-300)] bg-gradient-to-r from-[var(--color-accent-50)] to-[var(--color-primary-50)] px-4 py-1.5 text-xs font-bold text-[var(--color-accent-700)] mb-3 shadow-[var(--shadow-warm-sm)]"
            >
              <Award size={13} className="text-[var(--color-accent-600)]" aria-hidden="true" />
              {city.brand.contestLabel}
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] px-4 py-1.5 text-xs font-semibold text-[var(--color-primary-700)] mb-6 ml-0 sm:ml-2"
            >
              <Globe size={13} aria-hidden="true" />
              {t("유네스코 세계유산 2개 보유 도시")}
              <span className="ml-1 rounded-full bg-[var(--color-primary-500)] px-2 py-0.5 text-white text-[10px]">
                {cityLabel()}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.18] tracking-tight text-[var(--color-ink)] mb-6"
            >
              {isEn() ? (
                <>
                  Beyond the signboard:
                  <br />
                  an AI agent that revives
                  <br />
                  the <span className="text-[var(--color-primary-500)]">local economy</span>
                </>
              ) : (
                <>
                  {t("안내판을 넘어,")}
                  <br />
                  <span className="text-[var(--color-primary-500)]">{t("지역 경제")}</span>{t("를 살리는")}
                  <br />
                  {t("AI 에이전트")}
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[var(--color-earth-600)] leading-relaxed mb-10 max-w-xl"
            >
              {isEn() ? (
                <>
                  {cityLabel()} is home to UNESCO World Heritage, yet most visits are short. This service{" "}
                  <strong className="font-semibold text-[var(--color-charcoal)]">solves that with AI</strong>{" "}
                  — showing the completeness and scalability of the experience.
                </>
              ) : (
                <>
                  {t("유네스코 세계유산을 보유한 {city}의 짧은 관광 체류 문제를")}
                  <strong className="font-semibold text-[var(--color-charcoal)]">{t(" AI로 해결")}</strong>{t("하고,")}
                  {t("서비스의 완성도와 확장 가능성을 보여줍니다.")}
                </>
              )}
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
                {t("AI 해설사와 대화하기")}
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              <Link
                href="/heritage"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-primary-300)] bg-white/70 backdrop-blur-sm px-6 py-3.5 text-sm font-bold text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] hover:border-[var(--color-primary-400)] hover:-translate-y-0.5 active:scale-95"
              >
                {t("문화유산 둘러보기")}
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
                { value: "+30%", label: t("체류시간 향상 목표") },
                { value: isEn() ? "9" : "9개", label: t("라이브 라우트") },
                { value: isEn() ? "5" : "5종", label: t("실시간 공공데이터") },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-2xl font-black text-[var(--color-primary-500)]">{stat.value}</p>
                  <p className="text-xs text-[var(--color-earth-500)] font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
            </div>

            {/* Hero illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative hidden lg:block"
            >
              <Image
                src={isEn() ? "/ai/agentic-en.jpg" : "/ai/agentic.jpg"}
                alt={t("공공데이터를 자율로 활용하는 영주선비 AI 에이전트 일러스트")}
                width={1200}
                height={675}
                priority
                className="w-full h-auto rounded-3xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-xl)]"
              />
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-[var(--color-parchment)] px-4 py-2.5 shadow-[var(--shadow-warm-md)]">
                <p className="text-xs font-bold text-[var(--color-primary-700)]">{t("5종 공공데이터 · 7개 도구")}</p>
                <p className="text-[11px] text-[var(--color-earth-500)]">{t("Agentic RAG로 스스로 호출·답변")}</p>
              </div>
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
              {t("주요 서비스")}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] leading-tight"
            >
              {t("{city} 문화유산을 더 깊이")}<br />{t("경험하는 방법")}
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
                    {t("바로가기")} <ArrowRight size={13} strokeWidth={2.5} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 왜 다른가 · 작동 원리 (일러스트) ── */}
      <section className="bg-[var(--color-cream)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-[var(--color-primary-500)] uppercase tracking-widest mb-3">
              {t("왜 다른가")}
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] leading-tight">
              {t("단순 안내가 아니라,")}<br />{t("스스로 일하는 AI 에이전트")}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { src: "/ai/path.jpg", title: t("정해진 길이 아닌, 대화형 추론"), desc: t("정적 안내가 아니라 질문에 따라 스스로 길을 찾는 Agentic RAG. 최대 5단계 자율 추론으로 답합니다.") },
              { src: "/ai/loop.jpg", title: t("공공데이터가 시민가치로"), desc: t("국가 데이터 → AI 해설 → 시민 경험 → 익명 이용기록이 다시 데이터가 되는 공공가치 선순환.") },
              { src: "/ai/expansion.jpg", title: t("데이터팩 교체로 전국 확장"), desc: city.id === "andong" ? t("영주 1호 도시의 엔진·도구를 그대로 두고 데이터팩만 교체해 안동으로 옮겨왔습니다 — 전국 확장을 라이브로 실증.") : t("같은 엔진·도구는 그대로, 도시 데이터만 교체. 안동 2호 도시를 라이브로 실증했습니다.") },
            ].map((c, i) => (
              <motion.div
                key={c.src}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl bg-white border border-[var(--color-parchment)] overflow-hidden shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-lg)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative aspect-[16/9] bg-[var(--color-ivory)]">
                  <Image src={c.src} alt={c.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-[var(--color-ink)] mb-1.5">{c.title}</h3>
                  <p className="text-sm text-[var(--color-earth-600)] leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 차별성 · 경쟁 비교 (영주 전용) ── */}
      {city.id === "yeongju" && (
      <section id="competitive-edge" className="scroll-mt-24 bg-[var(--color-ivory)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-[var(--color-primary-500)] uppercase tracking-widest mb-3">
              차별성 · Competitive Edge
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] leading-tight">
              경쟁 서비스와의 <span className="text-[var(--color-primary-500)]">결정적 차이</span>{" "}
              <span className="text-[var(--color-earth-400)]">—</span> 왜{" "}
              <span className="rounded-md bg-[var(--color-primary-100)] px-2 py-0.5 text-[var(--color-primary-800)]">영주선비AI</span>인가
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-sm sm:text-base text-[var(--color-earth-600)] max-w-2xl mx-auto leading-relaxed">
              정해진 코스가 한 방향 안내라면, 영주선비AI는 <strong className="font-semibold text-[var(--color-charcoal)]">질문 따라 분기하는 대화</strong>입니다. 기존 넷은 각자 한계가 뚜렷합니다.
            </motion.p>
          </motion.div>

          {/* 경쟁 비교표 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-lg)] bg-white"
          >
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--color-ink)] text-white">
                  <th className="text-left font-semibold px-5 py-4 w-[26%]">서비스</th>
                  {edgeColumns.map((col) => (
                    <th key={col} className="font-semibold px-3 py-4 text-center leading-snug">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {edgeCompetitors.map((row, ri) => (
                  <tr
                    key={row.name}
                    className={`border-t border-[var(--color-parchment)] ${ri % 2 === 1 ? "bg-[var(--color-cream)]/50" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-[var(--color-charcoal)]">{row.name}</span>
                      {row.tag && <span className="ml-1.5 text-xs text-[var(--color-earth-400)]">{row.tag}</span>}
                    </td>
                    {row.cells.map((cell, ci) => (
                      <td key={ci} className="px-3 py-3.5 text-center">
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <EdgeMark mark={cell.mark} />
                          {cell.note && <span className="text-[11px] text-[var(--color-earth-500)] leading-none">{cell.note}</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                {/* 영주선비AI — 강조 행 */}
                <tr className="border-t-2 border-[var(--color-primary-300)] bg-[var(--color-primary-50)]">
                  <td className="px-5 py-4">
                    <span className="font-black text-[var(--color-primary-700)]">{edgeOurs.name}</span>
                  </td>
                  {edgeOurs.cells.map((cell, ci) => (
                    <td key={ci} className="px-3 py-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <EdgeMark mark={cell.mark} />
                        {cell.note && <span className="text-[11px] font-semibold text-[var(--color-primary-600)] leading-none">{cell.note}</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>

          {/* 범례 */}
          <p className="mt-3 text-center text-xs text-[var(--color-earth-400)]">
            <span className="font-semibold text-[var(--color-primary-600)]">✓</span> 지원 · <span className="text-[var(--color-earth-500)]">△</span> 부분 지원 · <span className="text-[var(--color-earth-500)]">✕</span> 미지원 — 공개 정보 기준 비교
          </p>

          {/* 3대 차별 포인트 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {edgeHighlights.map((h, i) => (
              <motion.div
                key={h.title}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl bg-white border border-[var(--color-parchment)] p-6 shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-lg)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
                  {h.icon}
                </div>
                <h3 className="text-base font-bold text-[var(--color-ink)] mb-2 leading-snug">{h.title}</h3>
                <p className="text-sm text-[var(--color-earth-600)] leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

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
                {t("문화유산 둘러보기")}
              </motion.p>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] leading-tight"
              >
                {t("{city}의 대표 명소")}
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/heritage"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors"
              >
                {t("전체 보기")} <ArrowRight size={14} strokeWidth={2.3} />
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
                        🏛️
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
                      {t("자세히 보기")} <ArrowRight size={12} strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 한 장으로 보는 영주선비AI (인포그래픽) — 영주 전용 ── */}
      {city.id === "yeongju" && (
      <section className="bg-[var(--color-ivory)] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-10"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-[var(--color-primary-500)] uppercase tracking-widest mb-3">
              {t("한눈에 보기")}
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] leading-tight">
              {t("한 장으로 보는 영주선비AI")}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-3 text-sm text-[var(--color-earth-600)] max-w-2xl mx-auto">
              {t("문제 정의부터 해결 방식, 기술 신뢰도, 기대효과와 전국 확장까지 — 프로젝트의 전체 그림을 한 장에 담았습니다.")}
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border border-[var(--color-parchment)] shadow-[var(--shadow-warm-xl)] bg-white"
          >
            <Image
              src={isEn() ? "/infographic-en.jpg" : "/infographic.jpg"}
              alt={t("영주선비AI 한 장 요약 인포그래픽 — 문제, 해결, 기술 신뢰도와 공공가치, 기대효과, 전국 확장")}
              width={1672}
              height={941}
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>
      )}

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
              {t("📊 공공데이터 활용")}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-3 leading-snug">
              {t("신뢰할 수 있는 공공데이터로 만든 서비스")}
            </h2>
            <p className="text-sm text-[var(--color-accent-300)] leading-relaxed max-w-2xl mx-auto">
              {t("본 서비스는")} <strong className="text-white font-semibold">{t("문화재청, 한국관광공사, 기상청, 국립중앙박물관, 한국학중앙연구원")}</strong> {t("등 5개 기관의 공공데이터를 활용합니다.")}{" "}
              {t("정확하고 최신화된 정보를 바탕으로")} {cityLabel()} {t("문화유산을 소개합니다.")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["문화재청 문화재정보", "한국관광공사 관광정보", "기상청 날씨정보", "국립중앙박물관 유물정보", "한국학중앙연구원 백과사전"].map(
                (src) => (
                  <span
                    key={src}
                    className="rounded-full border border-[var(--color-accent-600)] bg-[var(--color-accent-800)]/50 px-3 py-1 text-xs text-[var(--color-accent-300)]"
                  >
                    {t(src)}
                  </span>
                )
              )}
            </div>
            <Link
              href="/data-sources"
              className="mt-7 inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-[var(--color-accent-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              {t("공공데이터 출처 자세히 보기")} <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
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
              {t("지금 바로 AI 선비 해설사와")}<br />{t("대화를 시작해보세요")}
            </h2>
            <p className="text-sm text-[var(--color-primary-100)] mb-8">
              {top2[0]}, {top2[1]}… {t("궁금한 것은 무엇이든 물어보세요.")}
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[var(--color-primary-700)] shadow-[var(--shadow-warm-xl)] hover:bg-[var(--color-primary-50)] hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Bot size={17} strokeWidth={2} />
              {t("AI 해설사 시작하기")}
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
