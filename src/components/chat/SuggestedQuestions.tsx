"use client";

import { Sparkles } from "lucide-react";
import { getActiveCity } from "@/config/city";
import { t } from "@/i18n/ui";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTED_QUESTIONS = getActiveCity().suggestedQuestions;

export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
        <Sparkles size={13} />
        <span>{t("추천 질문")}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            aria-label={`${t("추천 질문")}: ${q}`}
            className="text-left text-sm px-3 py-2.5 rounded-xl border border-stone-200 bg-white
              text-stone-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800
              transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
