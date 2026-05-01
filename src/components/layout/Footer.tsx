import Link from "next/link";
import { Landmark, ExternalLink } from "lucide-react";

const publicDataSources = [
  { name: "문화재청", url: "https://www.cha.go.kr" },
  { name: "한국관광공사", url: "https://www.visitkorea.or.kr" },
  { name: "기상청", url: "https://www.kma.go.kr" },
  { name: "영주시청", url: "https://www.yeongju.go.kr" },
  { name: "국토교통부", url: "https://www.molit.go.kr" },
];

const footerLinks = [
  { href: "/heritage", label: "문화유산" },
  { href: "/chat", label: "AI 해설사" },
  { href: "/quiz", label: "선비 퀴즈" },
  { href: "/stamp", label: "스탬프투어" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-earth-900)] text-[var(--color-earth-200)]">
      {/* Public data notice bar */}
      <div className="border-b border-[var(--color-earth-700)] bg-[var(--color-earth-800)]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-[var(--color-earth-300)] text-center">
            📊 본 서비스는{" "}
            {publicDataSources.map((src, i) => (
              <span key={src.name}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-[var(--color-primary-300)] transition-colors"
                >
                  {src.name}
                </a>
                {i < publicDataSources.length - 1 && ", "}
              </span>
            ))}{" "}
            등 5개 기관의 공공데이터를 활용합니다.
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-500)]/20 text-[var(--color-primary-300)] group-hover:bg-[var(--color-primary-500)]/30 transition-colors">
                <Landmark size={18} strokeWidth={1.8} />
              </span>
              <span className="text-lg font-bold text-white">
                영주<span className="text-[var(--color-primary-400)]">선비</span>AI
              </span>
            </Link>
            <p className="text-sm text-[var(--color-earth-300)] leading-relaxed max-w-xs">
              유네스코 세계유산의 도시 영주의 천년 문화유산을 AI가 생생하게 해설해드립니다.
            </p>
            <p className="text-xs text-[var(--color-earth-400)] font-medium">
              🏆 2026 영주시 공공데이터 활용 창업경진대회 출품작
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">서비스</h3>
            <ul className="space-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--color-earth-300)] hover:text-[var(--color-primary-300)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data sources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">공공데이터 출처</h3>
            <ul className="space-y-2">
              {publicDataSources.map((src) => (
                <li key={src.name}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[var(--color-earth-300)] hover:text-[var(--color-primary-300)] transition-colors"
                  >
                    {src.name}
                    <ExternalLink size={11} className="opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-earth-700)] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[var(--color-earth-500)]">
          <p>© 2026 영주선비AI. 본 서비스의 콘텐츠는 공공데이터 활용 목적으로 제작되었습니다.</p>
          <p className="flex items-center gap-1">
            <span>공공데이터포털</span>
            <a
              href="https://www.data.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-primary-300)] transition-colors"
            >
              data.go.kr
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
