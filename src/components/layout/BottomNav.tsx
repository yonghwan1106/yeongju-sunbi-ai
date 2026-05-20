"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Landmark, Bot, Target, Map } from "lucide-react";

const tabs = [
  { href: "/", label: "홈", icon: Home },
  { href: "/heritage", label: "문화재", icon: Landmark },
  { href: "/chat", label: "챗", icon: Bot },
  { href: "/quiz", label: "퀴즈", icon: Target },
  { href: "/stamp-tour", label: "스탬프", icon: Map },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-cream)] border-t border-[var(--color-parchment)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="하단 탐색"
    >
      <ul className="flex h-16 items-stretch">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="flex flex-1">
              <Link
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors rounded-lg mx-0.5 my-1 ${
                  isActive
                    ? "text-[var(--color-primary-600)] bg-[var(--color-primary-50)]"
                    : "text-[var(--color-charcoal)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] active:bg-[var(--color-primary-100)]"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
