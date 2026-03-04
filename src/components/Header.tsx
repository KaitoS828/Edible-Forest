"use client";
import { useState } from "react";
import { Logo } from "./Logo";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#EEEEEE]">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
        <a href="/">
          <Logo size="sm" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#595757]">
          <a href="/#about" className="hover:text-[#E58251] transition-colors">研究会について</a>
          <a href="/#structure" className="hover:text-[#E58251] transition-colors">組織・活動</a>
          <a href="/reports" className="hover:text-[#E58251] transition-colors">活動レポート</a>
          <a href="/#themes" className="hover:text-[#E58251] transition-colors">テーマ</a>
          <a href="/#contact" className="hover:text-[#E58251] transition-colors">お問い合わせ</a>
        </nav>
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <span className={`block w-6 h-0.5 bg-[#595757] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#595757] transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#595757] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#EEEEEE] px-5 py-4 flex flex-col gap-4 text-sm text-[#595757]">
          <a href="/#about" onClick={() => setMenuOpen(false)}>研究会について</a>
          <a href="/#structure" onClick={() => setMenuOpen(false)}>組織・活動</a>
          <a href="/reports" onClick={() => setMenuOpen(false)}>活動レポート</a>
          <a href="/#themes" onClick={() => setMenuOpen(false)}>テーマ</a>
          <a href="/#contact" onClick={() => setMenuOpen(false)}>お問い合わせ</a>
        </div>
      )}
    </header>
  );
}
