"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { Send, Bot, Loader2, Database, Cpu } from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import SuggestedQuestions from "@/components/chat/SuggestedQuestions";
import ToolInvocationDisplay from "@/components/chat/ToolInvocationDisplay";

const DATA_SOURCES = [
  "문화재청 국가문화유산포털",
  "한국관광공사 Tour API",
  "기상청 단기예보 API",
  "유네스코 세계유산 자료",
];

// Tool names defined in route.ts
const TOOL_NAMES = ["searchHeritage", "getWeather", "searchTourSpots", "planTourCourse", "generateQuiz"];

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  function handleSuggestedQuestion(question: string) {
    if (isLoading) return;
    sendMessage({ text: question });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSend();
  }

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-stone-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-stone-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-stone-900 text-base leading-tight">
              AI 선비 에이전트
            </h1>
            <p className="text-xs text-stone-500">영주선비AI · Tool-Use AI Agent</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            에이전트 활성
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {showWelcome ? (
            <div className="space-y-6">
              {/* Welcome card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex-shrink-0 flex items-center justify-center text-white">
                    <Bot size={20} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-stone-800">안녕하세요! 영주선비AI 에이전트입니다.</p>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      저는 공공데이터 도구를 자율적으로 활용하는 AI 에이전트입니다.
                      문화유산 검색, 실시간 날씨 조회, 관광지·맛집 탐색, 맞춤 코스 생성까지 —
                      필요한 정보를 스스로 수집하고 종합하여 답변해 드립니다.
                    </p>
                    <p className="text-xs text-stone-400 italic">
                      "학이시습지 불역열호(學而時習之 不亦說乎)" — 배우고 때로 익히니 또한 기쁘지 아니한가
                    </p>
                  </div>
                </div>
              </div>

              {/* Agent capabilities */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "🏛️", label: "문화유산 검색", desc: "부석사·소수서원 등" },
                  { icon: "🌤️", label: "실시간 날씨", desc: "기상청 API 연동" },
                  { icon: "🍽️", label: "맛집·숙박 탐색", desc: "관광공사 API 연동" },
                  { icon: "🗺️", label: "맞춤 코스 생성", desc: "다단계 자율 추론" },
                ].map((cap) => (
                  <div
                    key={cap.label}
                    className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-lg">{cap.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-stone-700">{cap.label}</p>
                      <p className="text-[10px] text-stone-400">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested questions */}
              <SuggestedQuestions onSelect={handleSuggestedQuestion} />

              {/* Data sources */}
              <div className="flex items-start gap-2 text-xs text-stone-400 bg-stone-100 rounded-xl px-3 py-2.5">
                <Database size={13} className="mt-0.5 flex-shrink-0" />
                <span>
                  공공데이터 연동: {DATA_SOURCES.join(" · ")}
                </span>
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => {
                // Extract text parts
                const textContent = m.parts
                  ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map((p) => p.text)
                  .join("") ?? "";

                // Extract tool parts: type is "tool-{name}" in AI SDK v6
                const toolParts = (m.parts ?? [])
                  .filter((p) => {
                    const t = p.type;
                    return TOOL_NAMES.some((name) => t === `tool-${name}`);
                  })
                  .map((p) => {
                    // Extract tool name from type "tool-searchHeritage" → "searchHeritage"
                    const toolName = p.type.replace(/^tool-/, "");
                    const part = p as unknown as {
                      state: string;
                      input?: Record<string, unknown>;
                    };
                    return {
                      toolName,
                      state: part.state || "unknown",
                      input: part.input || {},
                    };
                  });

                return (
                  <div key={m.id} className="space-y-2">
                    {/* Show tool invocations for assistant messages */}
                    {m.role === "assistant" && toolParts.length > 0 && (
                      <ToolInvocationDisplay toolParts={toolParts} />
                    )}

                    {/* Show text message if there's content */}
                    {textContent && (
                      <ChatMessage
                        role={m.role as "user" | "assistant"}
                        content={textContent}
                      />
                    )}
                  </div>
                );
              })}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex-shrink-0 flex items-center justify-center text-white">
                    <Bot size={16} />
                  </div>
                  <div className="bg-stone-100 border border-stone-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Cpu size={14} className="text-amber-600 animate-pulse" />
                    <span className="text-xs text-stone-500">에이전트 추론 중...</span>
                    <Loader2 size={14} className="text-stone-400 animate-spin" />
                  </div>
                </div>
              )}

              {/* Data sources note after assistant replies */}
              {messages.some((m) => m.role === "assistant") && !isLoading && (
                <div className="flex items-start gap-2 text-xs text-stone-400 bg-stone-100 rounded-xl px-3 py-2.5">
                  <Database size={13} className="mt-0.5 flex-shrink-0" />
                  <span>출처: {DATA_SOURCES.join(" · ")}</span>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input area */}
      <footer className="flex-shrink-0 bg-white border-t border-stone-200 px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex gap-2 items-end"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="영주 문화유산에 대해 궁금한 점을 물어보세요..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5
              text-sm text-stone-800 placeholder:text-stone-400
              focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
              transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-600 text-white
              flex items-center justify-center
              hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors active:scale-95"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
        <p className="max-w-2xl mx-auto text-xs text-stone-400 mt-2 px-1">
          Enter로 전송 · Shift+Enter로 줄바꿈 · AI 에이전트가 도구를 자율 호출합니다
        </p>
      </footer>
    </div>
  );
}
