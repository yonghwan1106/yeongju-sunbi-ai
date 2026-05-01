"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";
import { QuizQuestion } from "@/types";

interface QuizCardProps {
  question: QuizQuestion;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  showAnswer: boolean;
}

const optionLabels = ["A", "B", "C", "D"];

export default function QuizCard({
  question,
  selectedIndex,
  onSelect,
  showAnswer,
}: QuizCardProps) {
  function getOptionStyle(index: number): string {
    const base =
      "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-3";

    if (!showAnswer) {
      if (selectedIndex === index) {
        return `${base} border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-800)]`;
      }
      return `${base} border-[var(--color-parchment)] bg-white hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] text-[var(--color-charcoal)]`;
    }

    // Show answer state
    if (index === question.correctIndex) {
      return `${base} border-emerald-400 bg-emerald-50 text-emerald-800`;
    }
    if (selectedIndex === index && index !== question.correctIndex) {
      return `${base} border-red-400 bg-red-50 text-red-800`;
    }
    return `${base} border-[var(--color-parchment)] bg-white text-[var(--color-charcoal)] opacity-50`;
  }

  function getLabelStyle(index: number): string {
    const base =
      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0";

    if (!showAnswer) {
      if (selectedIndex === index) {
        return `${base} bg-[var(--color-primary-500)] text-white`;
      }
      return `${base} bg-[var(--color-primary-100)] text-[var(--color-primary-700)]`;
    }

    if (index === question.correctIndex) {
      return `${base} bg-emerald-500 text-white`;
    }
    if (selectedIndex === index && index !== question.correctIndex) {
      return `${base} bg-red-500 text-white`;
    }
    return `${base} bg-gray-200 text-gray-500`;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Question */}
      <div className="bg-[var(--color-primary-50)] rounded-2xl p-5 border border-[var(--color-primary-100)]">
        <p className="text-base font-semibold text-[var(--color-ink)] leading-relaxed">
          {question.question}
        </p>
        <div className="mt-2 flex gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
            {question.category}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-700)]">
            {question.difficulty === "easy" ? "쉬움" : question.difficulty === "medium" ? "보통" : "어려움"}
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionStyle(index)}
            onClick={() => !showAnswer && onSelect(index)}
            disabled={showAnswer}
          >
            <span className={getLabelStyle(index)}>{optionLabels[index]}</span>
            <span className="flex-1">{option}</span>
            {showAnswer && index === question.correctIndex && (
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            )}
            {showAnswer && selectedIndex === index && index !== question.correctIndex && (
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl p-4 border flex gap-3 ${
              selectedIndex === question.correctIndex
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <BookOpen
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                selectedIndex === question.correctIndex ? "text-emerald-600" : "text-amber-600"
              }`}
            />
            <div>
              <p
                className={`text-xs font-bold mb-1 ${
                  selectedIndex === question.correctIndex ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {selectedIndex === question.correctIndex ? "정답입니다!" : "아쉽네요!"}
              </p>
              <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
