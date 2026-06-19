"use client";
import { useState, useCallback } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { label: "●旅に出よう「様々な食べられる森をさがしに」", href: "/spots" },
  { label: "●「アンサンブル」イベントへの参加を選ぼう", href: "/ensembles" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const closeAll = useCallback(() => setOpen(false), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="border-b"
        style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div className="max-w-[1400px] mx-auto px-5 lg:px-12 h-[72px] flex items-center gap-6 lg:gap-10">
          <a href="/" className="shrink-0" onClick={closeAll}>
            <Logo size="sm" />
          </a>

          <nav
            className="hidden lg:flex items-center gap-6 flex-1"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium tracking-wide hover:text-[#3C6B4F] transition-colors whitespace-nowrap"
                style={{ color: "#1A2B1E" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {!loading && (
            <div
              className="hidden lg:flex items-center gap-4 shrink-0 ml-auto"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {user ? (
                <>
                  <a
                    href="/member/dashboard"
                    className="text-sm font-medium hover:text-[#3C6B4F] transition-colors"
                    style={{ color: "#1A2B1E" }}
                  >
                    マイページ
                  </a>
                  <button
                    type="button"
                    onClick={signOut}
                    className="text-sm hover:opacity-70 transition-opacity border-0 bg-transparent cursor-pointer"
                    style={{ color: "#1A2B1E" }}
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-sm font-medium hover:text-[#3C6B4F] transition-colors"
                    style={{ color: "#1A2B1E" }}
                  >
                    ログイン
                  </a>
                  <a
                    href="/signup"
                    className="text-sm font-bold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#3C6B4F" }}
                  >
                    参加する
                  </a>
                </>
              )}
            </div>
          )}

          {/* モバイルハンバーガー */}
          <button
            type="button"
            className="lg:hidden flex flex-col gap-1.5 p-2 ml-auto"
            onClick={() => setOpen(!open)}
            aria-label="メニュー"
            aria-expanded={open}
          >
            <span className={`block w-6 h-0.5 bg-[#3C6B4F] transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#3C6B4F] transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#3C6B4F] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div
          className="lg:hidden border-b"
          style={{ backgroundColor: "#F4F4F2", borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div className="px-5 py-6" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeAll}
                className="block py-4 text-base font-medium border-b hover:text-[#3C6B4F] transition-colors"
                style={{ color: "#1A2B1E", borderColor: "rgba(0,0,0,0.08)" }}
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-6">
              {user ? (
                <>
                  <a
                    href="/member/dashboard"
                    onClick={closeAll}
                    className="flex-1 text-center px-4 py-3 rounded-full text-sm font-medium border"
                    style={{ borderColor: "#3C6B4F", color: "#1A2B1E" }}
                  >
                    マイページ
                  </a>
                  <button
                    type="button"
                    onClick={() => { signOut(); closeAll(); }}
                    className="px-4 py-3 rounded-full text-sm border bg-transparent cursor-pointer"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: "#1A2B1E" }}
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    onClick={closeAll}
                    className="flex-1 text-center px-4 py-3 rounded-full text-sm font-medium border"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: "#1A2B1E" }}
                  >
                    ログイン
                  </a>
                  <a
                    href="/signup"
                    onClick={closeAll}
                    className="flex-1 text-center px-4 py-3 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: "#3C6B4F" }}
                  >
                    参加する
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
