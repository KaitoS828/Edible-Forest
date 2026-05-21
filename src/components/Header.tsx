"use client";
import { useState, useCallback } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

type NavLink = { label: string; href: string };

type NavGroup = {
  label: string;
  href: string;
  links: NavLink[];
};

const MEGA_NAV: NavGroup[] = [
  {
    label: "食べられる森について",
    href: "/concept",
    links: [
      { label: "コンセプト", href: "/concept" },
      { label: "食べられる森とは", href: "/#about" },
    ],
  },
  {
    label: "各地の拠点",
    href: "/#events",
    links: [
      { label: "LC（ローカルコミュニティ）", href: "/#events" },
      { label: "地図から探す", href: "/#search" },
      { label: "拠点一覧", href: "/ensembles" },
    ],
  },
  {
    label: "宿泊する",
    href: "/spots",
    links: [
      { label: "宿泊拠点一覧", href: "/spots" },
      { label: "LS（ローカルステイ）", href: "/#stays" },
    ],
  },
  {
    label: "倶楽部に参加",
    href: "/join",
    links: [
      { label: "参加・入会", href: "/join" },
      { label: "会員ログイン", href: "/login" },
    ],
  },
  {
    label: "活動レポート",
    href: "/reports",
    links: [
      { label: "活動レポート一覧", href: "/reports" },
      { label: "お問い合わせ", href: "/contact" },
    ],
  },
];

function MegaPanel({ group, onNavigate }: { group: NavGroup; onNavigate: () => void }) {
  return (
    <div className="py-2 min-w-[160px]">
      <a
        href={group.href}
        onClick={onNavigate}
        className="block text-base font-bold mb-4 hover:text-[#3C6B4F] transition-colors"
        style={{ color: "#1A2B1E", fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        {group.label}
      </a>
      <ul className="space-y-3">
        {group.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={onNavigate}
              className="text-sm hover:text-[#3C6B4F] transition-colors inline-flex items-center gap-1"
              style={{ color: "rgba(26,43,30,0.75)", fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const { user, loading, signOut } = useAuth();

  const closeAll = useCallback(() => {
    setOpen(false);
    setActiveIndex(null);
    setMobileExpanded(null);
  }, []);

  const megaOpen = activeIndex !== null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      onMouseLeave={() => setActiveIndex(null)}
    >
      <div
        className="border-b"
        style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div className="max-w-[1400px] mx-auto px-5 lg:px-12 h-[72px] flex items-center justify-between gap-8">
          <a href="/" className="shrink-0" onClick={closeAll}>
            <Logo size="sm" />
          </a>

          <nav
            className="hidden lg:flex items-center gap-8 flex-1 justify-center"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {MEGA_NAV.map((group, i) => (
              <button
                key={group.label}
                type="button"
                className="text-sm font-medium tracking-wide transition-colors py-2 border-0 bg-transparent cursor-pointer whitespace-nowrap"
                style={{
                  color: activeIndex === i ? "#3C6B4F" : "#1A2B1E",
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => (window.location.href = group.href)}
              >
                {group.label}
              </button>
            ))}
          </nav>

          {!loading && (
            <div
              className="hidden lg:flex items-center gap-5 shrink-0"
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
                    href="/join"
                    className="text-sm font-bold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#3C6B4F" }}
                  >
                    参加する
                  </a>
                </>
              )}
            </div>
          )}

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

      {/* デスクトップ：メガメニュー */}
      <div
        className="hidden lg:block border-b overflow-hidden transition-all duration-300 ease-out"
        style={{
          backgroundColor: "#F4F4F2",
          borderColor: "rgba(0,0,0,0.06)",
          maxHeight: megaOpen ? "320px" : "0",
          opacity: megaOpen ? 1 : 0,
        }}
      >
        <div className="max-w-[1400px] mx-auto px-5 lg:px-12 py-10">
          {activeIndex !== null && (
            <div
              className="grid gap-10"
              style={{
                gridTemplateColumns: `repeat(${MEGA_NAV.length}, minmax(0, 1fr))`,
              }}
            >
              {MEGA_NAV.map((group, i) => (
                <div
                  key={group.label}
                  className="transition-opacity duration-200"
                  style={{ opacity: activeIndex === i ? 1 : 0.35 }}
                >
                  <MegaPanel group={group} onNavigate={closeAll} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div
          className="lg:hidden border-b max-h-[85vh] overflow-y-auto"
          style={{ backgroundColor: "#F4F4F2", borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div className="px-5 py-6" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {MEGA_NAV.map((group, i) => (
              <div key={group.label} className="border-b last:border-b-0" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between py-4 text-left border-0 bg-transparent cursor-pointer"
                  onClick={() => setMobileExpanded(mobileExpanded === i ? null : i)}
                >
                  <span className="text-base font-bold" style={{ color: "#1A2B1E" }}>
                    {group.label}
                  </span>
                  <span
                    className="text-lg font-light transition-transform duration-200"
                    style={{
                      color: "#3C6B4F",
                      transform: mobileExpanded === i ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>
                {mobileExpanded === i && (
                  <ul className="pb-4 space-y-3 pl-1">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={closeAll}
                          className="text-sm hover:text-[#3C6B4F]"
                          style={{ color: "rgba(26,43,30,0.75)" }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
                    href="/join"
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
