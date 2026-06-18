"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin/members",    label: "会員管理" },
  { href: "/admin/facilities", label: "施設審査" },
  { href: "/",                 label: "サイトを見る" },
];

export function AdminHeader() {
  const { signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 border-b"
      style={{ backgroundColor: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderColor: "rgba(0,95,2,0.15)" }}
    >
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 h-full flex items-center justify-between">

        {/* 左：管理画面ラベル */}
        <a href="/admin" className="flex items-center gap-2">
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#3C6B4F", color: "white" }}
          >
            管理画面
          </span>
        </a>

        {/* 右：デスクトップナビ */}
        <div className="hidden md:flex items-center gap-5">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-medium transition-colors hover:text-[#3C6B4F]"
              style={{ color: pathname.startsWith(item.href) && item.href !== "/" ? "#3C6B4F" : "#1A2B1E" }}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={signOut}
            className="text-xs px-4 py-1.5 rounded-full border transition-all hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F]"
            style={{ borderColor: "rgba(0,95,2,0.15)", color: "#1A2B1E" }}
          >
            ログアウト
          </button>
        </div>

        {/* 右：モバイル ハンバーガー */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="メニュー"
          aria-expanded={open}
        >
          <span className={`block w-5 h-0.5 bg-[#3C6B4F] transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#3C6B4F] transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#3C6B4F] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* モバイルドロップダウン */}
      {open && (
        <div
          className="md:hidden absolute top-14 left-0 right-0 border-b shadow-sm"
          style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,95,2,0.1)" }}
        >
          <div className="max-w-[1200px] mx-auto px-5 py-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b last:border-none transition-colors hover:text-[#3C6B4F]"
                style={{ color: "#1A2B1E", borderColor: "rgba(0,95,2,0.08)" }}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={signOut}
              className="py-3 text-sm font-medium text-left transition-colors hover:text-[#3C6B4F]"
              style={{ color: "#1A2B1E" }}
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
