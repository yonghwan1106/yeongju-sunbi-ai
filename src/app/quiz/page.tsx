"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  RotateCcw,
  Map,
  ChevronRight,
  Clock,
  BookOpen,
  Star,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { quizData, getQuizByDifficulty, getRandomQuiz } from "@/data/quiz";
import { QuizQuestion } from "@/types";
import QuizCard from "@/components/quiz/QuizCard";
import Link from "next/link";

type Screen = "start" | "playing" | "results";
type Difficulty = "all" | "easy" | "medium" | "hard";
type QuestionCount = 5 | 10 | "all";

interface AnswerRecord {
  question: QuizQuestion;
  selectedIndex: number;
  correct: boolean;
}

const TIMER_SECONDS = 30;

export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>("start");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5);

  // Playing state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);

  // Results state
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  // Timer
  const handleTimeUp = useCallback(() => {
    if (!showAnswer) {
      setTimerActive(false);
      setShowAnswer(true);
      setAnswers((prev) => [
        ...prev,
        {
          question: questions[currentIndex],
          selectedIndex: -1,
          correct: false,
        },
      ]);
    }
  }, [showAnswer, questions, currentIndex]);

  useEffect(() => {
    if (!timerActive || showAnswer) return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerActive, showAnswer, handleTimeUp]);

  function buildQuestions(): QuizQuestion[] {
    let pool: QuizQuestion[];
    if (difficulty === "all") {
      pool = [...quizData];
    } else {
      pool = getQuizByDifficulty(difficulty);
    }
    pool = pool.sort(() => Math.random() - 0.5);
    if (questionCount === "all") return pool;
    return pool.slice(0, Math.min(questionCount, pool.length));
  }

  function handleStart() {
    const qs = buildQuestions();
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setShowAnswer(false);
    setAnswers([]);
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(true);
    setScreen("playing");
  }

  function handleSelect(index: number) {
    if (showAnswer) return;
    setSelectedIndex(index);
    setTimerActive(false);
    setShowAnswer(true);
    setAnswers((prev) => [
      ...prev,
      {
        question: questions[currentIndex],
        selectedIndex: index,
        correct: index === questions[currentIndex].correctIndex,
      },
    ]);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setScreen("results");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setShowAnswer(false);
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(true);
  }

  function handleRestart() {
    setScreen("start");
    setAnswers([]);
  }

  const correctCount = answers.filter((a) => a.correct).length;
  const totalAnswered = answers.length;
  const pct = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  function getBadgeInfo() {
    if (pct === 100) return { label: "선비 대학자", icon: "🏆", color: "text-amber-600" };
    if (pct >= 80) return { label: "선비 학자", icon: "⭐", color: "text-yellow-600" };
    if (pct >= 60) return { label: "선비 수료생", icon: "📜", color: "text-blue-600" };
    return { label: "선비 입문자", icon: "📖", color: "text-gray-600" };
  }

  const badge = getBadgeInfo();

  // Timer color
  const timerColor =
    timeLeft > 15 ? "text-emerald-600" : timeLeft > 7 ? "text-amber-500" : "text-red-500";

  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      <AnimatePresence mode="wait">
        {/* ── START SCREEN ── */}
        {screen === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl mx-auto px-4 py-16 flex flex-col gap-8"
          >
            {/* Title */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-primary-100)] rounded-2xl mb-4">
                <BookOpen className="w-8 h-8 text-[var(--color-primary-600)]" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--color-ink)] mb-2">
                선비문화 퀴즈 챌린지
              </h1>
              <p className="text-[var(--color-charcoal)] opacity-70 text-sm leading-relaxed">
                영주의 문화유산과 선비 정신을 퀴즈로 배워보세요.
                <br />
                문제를 풀고 나만의 선비 등급을 받아보세요!
              </p>
            </div>

            {/* Settings card */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] flex flex-col gap-5">
              {/* Difficulty */}
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)] mb-2">
                  난이도 선택
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { value: "all", label: "전체" },
                      { value: "easy", label: "쉬움" },
                      { value: "medium", label: "보통" },
                      { value: "hard", label: "어려움" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDifficulty(opt.value)}
                      className={`py-2 rounded-xl text-sm font-medium transition-all ${
                        difficulty === opt.value
                          ? "bg-[var(--color-primary-600)] text-white shadow-sm"
                          : "bg-[var(--color-ivory)] text-[var(--color-charcoal)] hover:bg-[var(--color-primary-50)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question count */}
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)] mb-2">
                  문제 수
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: 5, label: "5문제" },
                      { value: 10, label: "10문제" },
                      { value: "all", label: "전체" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setQuestionCount(opt.value)}
                      className={`py-2 rounded-xl text-sm font-medium transition-all ${
                        questionCount === opt.value
                          ? "bg-[var(--color-accent-600)] text-white shadow-sm"
                          : "bg-[var(--color-ivory)] text-[var(--color-charcoal)] hover:bg-[var(--color-accent-50)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={handleStart}
              className="w-full py-4 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white font-bold text-base rounded-2xl shadow-[var(--shadow-warm-md)] transition-all flex items-center justify-center gap-2"
            >
              퀴즈 시작하기
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Info */}
            <p className="text-center text-xs text-[var(--color-charcoal)] opacity-50">
              <Clock className="w-3 h-3 inline mr-1" />
              문제당 30초 제한이 있습니다
            </p>
          </motion.div>
        )}

        {/* ── PLAYING SCREEN ── */}
        {screen === "playing" && questions.length > 0 && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-charcoal)] opacity-70">
                {currentIndex + 1} / {questions.length}
              </span>
              <div className={`flex items-center gap-1.5 font-mono font-bold text-base ${timerColor}`}>
                <Clock className="w-4 h-4" />
                {String(timeLeft).padStart(2, "0")}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-[var(--color-parchment)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--color-primary-500)] rounded-full"
                animate={{ width: `${((currentIndex + (showAnswer ? 1 : 0)) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Quiz card */}
            <QuizCard
              question={questions[currentIndex]}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
              showAnswer={showAnswer}
            />

            {/* Next button */}
            <AnimatePresence>
              {showAnswer && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full py-3.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white font-semibold rounded-xl shadow-[var(--shadow-warm-sm)] transition-all flex items-center justify-center gap-2"
                >
                  {currentIndex + 1 >= questions.length ? "결과 보기" : "다음 문제"}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── RESULTS SCREEN ── */}
        {screen === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-6"
          >
            {/* Score card */}
            <div className="bg-gradient-to-br from-[var(--color-primary-700)] to-[var(--color-primary-900)] text-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-[var(--shadow-warm-xl)]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="text-5xl"
              >
                {badge.icon}
              </motion.div>
              <div className="text-center">
                <p className="text-white/70 text-sm mb-1">획득 등급</p>
                <p className="text-2xl font-bold">{badge.label}</p>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-6xl font-bold tabular-nums">{pct}</span>
                <span className="text-2xl font-medium text-white/70 mb-2">%</span>
              </div>
              <p className="text-white/80 text-sm">
                {totalAnswered}문제 중 {correctCount}개 정답
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "총 문제", value: totalAnswered, icon: <BookOpen className="w-4 h-4" /> },
                { label: "정답", value: correctCount, icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
                { label: "오답", value: totalAnswered - correctCount, icon: <XCircle className="w-4 h-4 text-red-400" /> },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl p-4 border border-[var(--color-parchment)] flex flex-col items-center gap-1 shadow-[var(--shadow-warm-sm)]"
                >
                  {stat.icon}
                  <span className="text-xl font-bold text-[var(--color-ink)]">{stat.value}</span>
                  <span className="text-xs text-[var(--color-charcoal)] opacity-60">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Answer review */}
            <div className="bg-white rounded-2xl border border-[var(--color-parchment)] overflow-hidden shadow-[var(--shadow-warm-sm)]">
              <div className="px-4 py-3 border-b border-[var(--color-parchment)] flex items-center gap-2">
                <Star className="w-4 h-4 text-[var(--color-primary-500)]" />
                <span className="text-sm font-semibold text-[var(--color-ink)]">답안 확인</span>
              </div>
              <div className="divide-y divide-[var(--color-parchment)]">
                {answers.map((record, i) => (
                  <div key={record.question.id} className="px-4 py-3">
                    <button
                      onClick={() =>
                        setExpandedReview(
                          expandedReview === record.question.id ? null : record.question.id
                        )
                      }
                      className="w-full flex items-center gap-3 text-left"
                    >
                      <span className="text-xs text-[var(--color-charcoal)] opacity-50 w-5 shrink-0">
                        {i + 1}
                      </span>
                      {record.correct ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <p className="flex-1 text-sm text-[var(--color-charcoal)] line-clamp-1">
                        {record.question.question}
                      </p>
                      <ChevronDown
                        className={`w-4 h-4 text-[var(--color-charcoal)] opacity-40 shrink-0 transition-transform ${
                          expandedReview === record.question.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedReview === record.question.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 ml-12 text-xs text-[var(--color-charcoal)] opacity-75 leading-relaxed bg-[var(--color-primary-50)] rounded-lg p-3">
                            <p className="font-semibold mb-1">
                              정답:{" "}
                              <span className="text-emerald-700">
                                {record.question.options[record.question.correctIndex]}
                              </span>
                            </p>
                            <p>{record.question.explanation}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3.5 border-2 border-[var(--color-primary-300)] text-[var(--color-primary-700)] font-semibold rounded-xl hover:bg-[var(--color-primary-50)] transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                다시 도전
              </button>
              <Link
                href="/stamp-tour"
                className="flex-1 py-3.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white font-semibold rounded-xl shadow-[var(--shadow-warm-sm)] transition-all flex items-center justify-center gap-2"
              >
                <Map className="w-4 h-4" />
                스탬프투어
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
