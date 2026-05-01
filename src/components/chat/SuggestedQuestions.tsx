"use client";

import { Sparkles } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTED_QUESTIONS = [
  "부석사 무량수전의 배흘림기둥은 왜 특별한가요?",
  "소수서원이 한국 최초의 서원인 이유는?",
  "영주의 선비문화란 무엇인가요?",
  "무섬마을 외나무다리의 역사가 궁금해요",
  "소백산 철쭉 명소와 등산 정보를 알려주세요",
  "부석사와 소수서원 하루 코스 추천해 주세요",
];

export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
        <Sparkles size={13} />
        <span>추천 질문</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
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
