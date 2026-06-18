"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { href: "/member/dashboard", label: "マイページ" },
  { href: "/events", label: "イベント" },
  { href: "/spots", label: "スポット" },
];

export default function MemberNav() {
  const { signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,95,2,0.12)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-[72px] flex items-center gap-4 sm:gap-6">

        {/* ロゴ */}
        <a href="/" className="flex-shrink-0 flex flex-col leading-tight">
          <span
            className="text-base font-bold tracking-wide"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
          >
            食べられる森
          </span>
          <span className="text-[11px]" style={{ color: "#1A2B1E", opacity: 0.6 }}>
            アンサンブル倶楽部
          </span>
        </a>

        {/* 区切り */}
        <div className="hidden sm:block h-6 w-px flex-shrink-0" style={{ backgroundColor: "rgba(60,107,79,0.2)" }} />

        {/* メインナビ */}
        <nav className="hidden sm:flex items-end gap-5 flex-1 h-full">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex flex-col justify-center h-full text-sm transition-opacity hover:opacity-70"
                style={{
                  color: active ? "#3C6B4F" : "#555555",
                  fontWeight: active ? 700 : 500,
                  borderBottom: active ? "2px solid #3C6B4F" : "2px solid transparent",
                  marginBottom: "-1px",
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* ユーザーエリア */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">

          {/* プロフィール編集ボタン */}
          <a
            href="/member/setup"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all hover:opacity-70"
            style={{ borderColor: "rgba(60,107,79,0.3)", color: "#3C6B4F" }}
          >
            <PencilIcon />
            プロフィール編集
          </a>

          {/* ログアウト */}
          <button
            type="button"
            onClick={signOut}
            className="text-xs px-3 py-1.5 rounded-full border transition-opacity hover:opacity-70"
            style={{ borderColor: "rgba(0,0,0,0.12)", color: "#777777" }}
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}

function PencilIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
