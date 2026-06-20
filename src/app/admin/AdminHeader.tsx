"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin", label: "ダッシュボード", icon: "▦" },
  { href: "/admin/members", label: "会員管理", icon: "◉" },
  { href: "/admin/ensembles", label: "アンサンブル管理", icon: "▤" },
  { href: "/admin/spots", label: "宿泊施設管理", icon: "⌂" },
  { href: "/admin/reports", label: "活動レポート管理", icon: "▥" },
  { href: "/admin/site-settings", label: "サイト設定", icon: "▨" },
  { href: "/admin/facilities", label: "イベント審査", icon: "□" },
];

function activePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="管理メニュー">
      {NAV_ITEMS.map((item) => {
        const active = activePath(pathname, item.href);
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: active ? "#E8EEF5" : "transparent",
              border: active ? "1px solid #D7DEE8" : "1px solid transparent",
              color: active ? "#0F172A" : "#475569",
            }}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center text-xs" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

export function AdminHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r md:flex md:flex-col"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#DCE3EA" }}
      >
        <div className="flex h-16 items-center border-b px-5" style={{ borderColor: "#E5EAF0" }}>
          <a href="/admin" className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#64748B" }}>
              Admin Console
            </p>
            <p className="truncate text-base font-semibold" style={{ color: "#0F172A" }}>
              食べられる森
            </p>
          </a>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks pathname={pathname} />
        </div>

        <div className="border-t p-3" style={{ borderColor: "#E5EAF0" }}>
          <a
            href="/"
            className="mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100"
            style={{ color: "#475569" }}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center text-xs" aria-hidden="true">
              ↗
            </span>
            サイトを見る
          </a>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-slate-100"
            style={{ color: "#B42318" }}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center text-xs" aria-hidden="true">
              ⌁
            </span>
            ログアウト
          </button>
        </div>
      </aside>

      <header
        className="sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 md:hidden"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#DCE3EA" }}
      >
        <a href="/admin">
          <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Admin Console</p>
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium"
          style={{ borderColor: "#CBD5E1", color: "#0F172A" }}
          aria-label="管理メニュー"
          aria-expanded={open}
        >
          Menu
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-x-0 top-14 z-50 border-b p-3 shadow-sm md:hidden"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#DCE3EA" }}
        >
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          <div className="mt-3 border-t pt-3" style={{ borderColor: "#E5EAF0" }}>
            <a href="/" className="block rounded-md px-3 py-2 text-sm font-medium" style={{ color: "#475569" }}>
              サイトを見る
            </a>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium"
              style={{ color: "#B42318" }}
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </>
  );
}
