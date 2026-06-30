"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, Copy, Check, Volume2, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTextToSpeech } from "@/lib/hooks/useSpeech";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

function formatTime(date?: Date): string {
  if (!date) return "";
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * 마크다운 안전 정규화 — 블록 요소가 줄 중간에 와서 '##' 등이 글자로 노출되는 것을 방지.
 * (도구 호출 전/후 텍스트가 붙거나 모델이 "문장.## 제목"처럼 inline으로 쓴 경우)
 * 정규식에 한글 리터럴을 쓰지 않는다(SWC 한글 regex 버그 회피).
 */
function normalizeMd(text: string): string {
  let out = text;

  // (1) 줄 중간에 온 ATX heading('## ') 앞에 빈 줄을 넣어 마크다운으로 파싱되게 한다.
  out = out.replace(/([^\n])(#{1,6}\s)/g, "$1\n\n$2");

  // (2) raw <details>/<summary> 평탄화 — react-markdown은 raw HTML을 렌더하지 않아
  //     태그가 글자로 노출된다(예: 퀴즈 '정답 보기'). 접힘 UI 대신
  //     구분선 + 굵은 라벨 + 본문(마크다운)으로 치환해 깔끔히 보이게 한다.
  out = out
    .replace(/<details>\s*/gi, "\n\n---\n\n")
    .replace(/<summary>\s*([\s\S]*?)\s*<\/summary>/gi, "**$1**\n\n")
    .replace(/\s*<\/details>/gi, "\n");

  // (3) 한글 'bold+조사' 깨짐 보정 — 닫는 '**'가 구두점 뒤 + 한글 앞에 오면
  //     CommonMark right-flanking 규칙에 걸려 emphasis가 닫히지 않고 '**'가 글자로 남는다
  //     (예: '**주리론(主理論)**을'). 구두점과 '**' 사이에 ZWSP(U+200B)를 넣어
  //     닫는 '**'를 right-flanking으로 만든다. (SWC 한글 regex 버그 회피: 한글은 \u 범위로만 표기)
  const _reBoldJosa = new RegExp("(\\p{P})\\*\\*(?=[^\\s])(?!\\p{P})", "gu");
  out = out.replace(_reBoldJosa, "$1" + String.fromCharCode(0x200b) + "**");

  return out;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const { speak, stop, isSpeaking, supported: ttsSupported } = useTextToSpeech();

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {/* ignore */});
  }

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
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? "bg-amber-600 text-white rounded-tr-sm"
              : "bg-stone-100 text-stone-800 rounded-tl-sm border border-stone-200"
            }`}
        >
          {!isUser && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5">
              {ttsSupported && (
                <button
                  type="button"
                  onClick={() => (isSpeaking ? stop() : speak(content))}
                  aria-label={isSpeaking ? "읽기 정지" : "응답 읽어주기"}
                  title={isSpeaking ? "읽기 정지" : "응답 읽어주기 (음성)"}
                  className="p-1 rounded-md text-stone-400 hover:text-emerald-700
                    hover:bg-stone-200 transition-colors"
                >
                  {isSpeaking ? <Square size={13} className="text-emerald-600" /> : <Volume2 size={14} />}
                </button>
              )}
              <button
                type="button"
                onClick={handleCopy}
                aria-label="응답 복사"
                className="p-1 rounded-md text-stone-400 hover:text-stone-600
                  hover:bg-stone-200 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>
          )}
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose-chat pr-12">
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
                {normalizeMd(content)}
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
