"use client";
import { useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { label: "倶楽部について", href: "/#about" },
  { label: "イベント",       href: "/#events" },
  { label: "拠点",           href: "/spots" },
  { label: "活動レポート",   href: "/reports" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderColor: "rgba(0,95,2,0.15)" }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
        <a href="/"><Logo size="sm" /></a>

        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: "#000000" }}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-[#005F02] transition-colors whitespace-nowrap">
              {n.label}
            </a>
          ))}

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <a
                    href="/member"
                    className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-[#005F02] hover:text-white hover:border-[#005F02]"
                    style={{ borderColor: "#005F02", color: "#000000" }}
                  >
                    マイページ
                  </a>
                  <button
                    onClick={signOut}
                    className="text-xs hover:opacity-70 transition-opacity"
                    style={{ color: "#000000" }}
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="/login"
                    className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:opacity-80"
                    style={{ borderColor: "rgba(0,95,2,0.15)", color: "#000000" }}
                  >
                    ログインする
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#005F02" }}
                  >
                    会員登録する
                  </a>
                </div>
              )}
            </>
          )}
        </nav>

        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)} aria-label="メニュー">
          <span className={`block w-6 h-0.5 bg-[#005F02] transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#005F02] transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#005F02] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-5 py-5 flex flex-col gap-4 text-sm" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,95,2,0.15)", color: "#000000" }}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="hover:text-[#005F02] transition-colors">{n.label}</a>
          ))}
          <div className="flex gap-2 pt-2">
            {user ? (
              <>
                <a href="/member" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-full font-medium border" style={{ borderColor: "#005F02", color: "#000000" }}>マイページ</a>
                <button onClick={signOut} className="px-4 py-2.5 rounded-full text-sm border" style={{ borderColor: "rgba(0,95,2,0.15)", color: "#000000" }}>ログアウト</button>
              </>
            ) : (
              <>
                <a href="/login" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-full font-medium border" style={{ borderColor: "rgba(0,95,2,0.15)", color: "#000000" }}>ログインする</a>
                <a href="/signup" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-full font-medium text-white" style={{ backgroundColor: "#005F02" }}>会員登録する</a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
