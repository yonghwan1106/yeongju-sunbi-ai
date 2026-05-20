"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export default function ShareButton() {
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "영주선비AI 에이전트",
          text: "공공데이터 기반 영주 문화유산 AI 안내 서비스",
          url,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Desktop fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(url);
      showToast("URL이 복사되었습니다");
    } catch {
      // Clipboard unavailable: open KakaoTalk share
      const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}`;
      window.open(kakaoUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        aria-label="공유"
        className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-700
          bg-stone-100 hover:bg-amber-50 border border-stone-200 hover:border-amber-300
          rounded-lg px-2.5 py-1.5 transition-colors"
      >
        <Share2 size={13} />
        공유
      </button>

      {toast && (
        <div
          className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2
            bg-stone-800 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap
            pointer-events-none"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
