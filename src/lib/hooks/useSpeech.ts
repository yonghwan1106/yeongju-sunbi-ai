"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * 음성 출력(TTS)을 위해 마크다운/출처 블록을 평문으로 정리한다.
 * 한글 리터럴을 정규식에 직접 넣으면 SWC가 손상시킬 수 있어(출처 절단은 indexOf 사용),
 * Korean은 string 매칭으로만 처리하고 정규식은 마크다운 기호에만 적용한다.
 */
export function stripForSpeech(md: string): string {
  if (!md) return "";
  let t = md;

  // 출처(citation) 블록 이후 절단 — 한글은 indexOf로(정규식 회피)
  const citationMarkers = ["**출처", "\n출처:", "출처:"];
  for (const m of citationMarkers) {
    const idx = t.indexOf(m);
    if (idx > 0) {
      t = t.slice(0, idx);
      break;
    }
  }

  // 마크다운 기호 제거 (한글 없음 → 안전)
  t = t.replace(/```[\s\S]*?```/g, " ");
  t = t.replace(/`([^`]+)`/g, "$1");
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  t = t.replace(/^#{1,6}\s+/gm, "");
  t = t.replace(/^\s*[-*+]\s+/gm, "");
  t = t.replace(/^\s*\d+\.\s+/gm, "");
  t = t.replace(/^\s*>\s?/gm, "");
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/\*([^*]+)\*/g, "$1");
  t = t.replace(/__([^_]+)__/g, "$1");
  t = t.replace(/_([^_]+)_/g, "$1");
  t = t.replace(/~~([^~]+)~~/g, "$1");
  t = t.replace(/^[\s|:-]+$/gm, "");
  t = t.replace(/\|/g, " ");
  t = t.replace(/\n{2,}/g, ". ");
  t = t.replace(/[ \t]{2,}/g, " ");

  return t.trim();
}

/**
 * 답변 읽어주기 (Web Speech API · SpeechSynthesis).
 * 전 브라우저에서 대체로 온디바이스로 동작하며 외부 전송이 없다.
 */
export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const stop = useCallback(() => {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      /* ignore */
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((raw: string) => {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const text = stripForSpeech(raw);
      if (!text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ko-KR";
      u.rate = 1.0;
      u.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const ko = voices.find((v) => v.lang === "ko-KR" || v.lang?.startsWith("ko"));
      if (ko) u.voice = ko;
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(u);
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch {
        /* ignore */
      }
    };
  }, []);

  return { speak, stop, isSpeaking, supported };
}

// --- Web Speech API (음성 입력) 최소 타입 (TS DOM lib 미포함) ---
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

/**
 * 음성 입력(STT · Web Speech API).
 * Chrome·Edge·Safari 지원(Firefox 미지원). 음성이 브라우저 STT 엔진으로 전송되는
 * 한계가 있어 라이브 센터피스로는 쓰지 않고 보조 입력 수단으로만 제공한다.
 */
export function useSpeechToText(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const w = window as unknown as {
        SpeechRecognition?: SpeechRecognitionCtor;
        webkitSpeechRecognition?: SpeechRecognitionCtor;
      };
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (!SR) return;
      const rec = new SR();
      rec.lang = "ko-KR";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      rec.onresult = (e: SpeechRecognitionEventLike) => {
        let transcript = "";
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0]?.transcript ?? "";
        }
        if (transcript.trim()) onResult(transcript.trim());
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      recRef.current = rec;
      setIsListening(true);
      rec.start();
    } catch {
      setIsListening(false);
    }
  }, [onResult]);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return { start, stop, isListening, supported };
}
