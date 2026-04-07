"use client";

import { useAuth } from "@/contexts/AuthContext";

interface Props {
  displayName: string;
  email: string;
  uid: string;
}

export default function MemberNav({ displayName, email }: Props) {
  const { signOut } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "white", borderColor: "rgba(0,95,2,0.15)" }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* ロゴ */}
        <a href="/" className="flex items-center gap-2">
          <span
            className="text-sm font-bold"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
          >
            食べられる森 アンサンブル倶楽部
          </span>
        </a>

        {/* ナビ */}
        <nav className="flex items-center gap-4">
          <a
            href="/member/dashboard"
            className="text-xs font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#555555" }}
          >
            マイページ
          </a>
          <a
            href="/member/new"
            className="text-xs font-medium px-4 py-1.5 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#3C6B4F" }}
          >
            + 新規投稿
          </a>

          {/* ユーザーメニュー */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "#3C6B4F" }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium" style={{ color: "#3C6B4F" }}>
                {displayName}
              </p>
              <p className="text-[10px]" style={{ color: "#1A2B1E" }}>
                {email}
              </p>
            </div>
            <button
              onClick={signOut}
              className="ml-2 text-xs hover:opacity-70 transition-opacity"
              style={{ color: "#1A2B1E" }}
            >
              ログアウト
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
