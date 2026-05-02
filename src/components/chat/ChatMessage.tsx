"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
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
      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
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
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-base font-bold mt-3 mb-2 text-stone-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2 text-emerald-800 border-b border-stone-300 pb-1">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1.5 text-stone-800">{children}</h3>,
                  p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc ml-5 my-1.5 space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-5 my-1.5 space-y-0.5">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-stone-900">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-emerald-500 bg-emerald-50/50 pl-3 pr-2 py-1.5 my-2 italic text-stone-700 rounded-r">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-stone-200 text-amber-700 px-1.5 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                  hr: () => <hr className="my-3 border-stone-300" />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="border-collapse border border-stone-300 text-xs w-full">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-stone-200">{children}</thead>,
                  th: ({ children }) => <th className="border border-stone-300 px-2 py-1 font-semibold text-left">{children}</th>,
                  td: ({ children }) => <td className="border border-stone-300 px-2 py-1">{children}</td>,
                  a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline hover:text-emerald-900">
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {timestamp && (
          <span className="text-xs text-stone-400 px-1">{formatTime(timestamp)}</span>
        )}
      </div>
    </motion.div>
  );
}
