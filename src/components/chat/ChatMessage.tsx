"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

/** Minimal markdown: bold (**text**), line breaks, bullet lists */
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const isBullet = /^[-*•]\s+/.test(line);
    const trimmed = isBullet ? line.replace(/^[-*•]\s+/, "") : line;

    // Bold: **text**
    const parts = trimmed.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} className="font-semibold">
          {part}
        </strong>
      ) : (
        <span key={j}>{part}</span>
      )
    );

    if (isBullet) {
      return (
        <li key={i} className="ml-4 list-disc">
          {rendered}
        </li>
      );
    }

    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }

    return (
      <div key={i} className="leading-relaxed">
        {rendered}
      </div>
    );
  });
}

function formatTime(date?: Date): string {
  if (!date) return "";
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
          ${isUser ? "bg-amber-600" : "bg-emerald-700"}`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <span className="text-xs text-stone-500 font-medium px-1">선비AI 해설사</span>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? "bg-amber-600 text-white rounded-tr-sm"
              : "bg-stone-100 text-stone-800 rounded-tl-sm border border-stone-200"
            }`}
        >
          <ul className={`space-y-0.5 ${isUser ? "" : ""}`}>
            {renderMarkdown(content)}
          </ul>
        </div>

        {timestamp && (
          <span className="text-xs text-stone-400 px-1">{formatTime(timestamp)}</span>
        )}
      </div>
    </motion.div>
  );
}
