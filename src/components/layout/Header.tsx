"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Landmark } from "lucide-react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/heritage", label: "문화유산" },
  { href: "/chat", label: "AI 해설사" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/stamp-tour", label: "스탬프투어" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-cream)]/95 backdrop-blur-md shadow-[var(--shadow-warm-md)]"
          : "bg-[var(--color-cream)]/80 backdrop-blur-sm"
      }`}
      style={{ borderBottom: scrolled ? "1px solid rgb(200 130 42 / 0.18)" : "1px solid transparent" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-500)] text-white shadow-[var(--shadow-warm-sm)] group-hover:bg-[var(--color-primary-600)] transition-colors">
              <Landmark size={18} strokeWidth={1.8} />
            </span>
            <span className="text-lg font-bold tracking-tight text-[var(--color-ink)]">
              영주<span className="text-[var(--color-primary-500)]">선비</span>AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[var(--color-primary-600)]"
                      : "text-[var(--color-charcoal)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)]"
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-[var(--color-primary-500)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/chat"
              className="ml-3 inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary-500)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-warm-sm)] hover:bg-[var(--color-primary-600)] hover:shadow-[var(--shadow-warm-md)] active:scale-95"
            >
              🤖 AI 해설사
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg text-[var(--color-charcoal)] hover:bg-[var(--color-primary-100)] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-[var(--color-parchment)]"
          >
            <nav className="flex flex-col gap-1 px-4 py-3 bg-[var(--color-cream)]">
              {navLinks.map(({ href, label }, i) => {
                const isActive = pathname === href;
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={href}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] font-semibold"
                          : "text-[var(--color-charcoal)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)]"
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-1 pb-2"
              >
                <Link
                  href="/chat"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--color-primary-500)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-600)] active:scale-95"
                >
                  🤖 AI 해설사와 대화하기
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
