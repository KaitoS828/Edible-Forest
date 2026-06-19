"use client";
import { useState, useCallback } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const NOTE_URL = "https://note.com/nitobasuyounakatatide";

function NoteIcon() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-[10px] font-bold leading-none"
      style={{ backgroundColor: "#41C9B4", color: "#FFFFFF", fontFamily: "Arial, sans-serif" }}
      aria-hidden="true"
    >
      n
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { navigation } = useSiteSettings();

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
            {navigation.headerItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium tracking-wide hover:text-[#3C6B4F] transition-colors whitespace-nowrap"
                style={{ color: "#1A2B1E" }}
              >
                {item.label}
              </a>
            ))}
            <a
              href={NOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium tracking-wide hover:text-[#3C6B4F] transition-colors whitespace-nowrap"
              style={{ color: "#1A2B1E" }}
            >
              <NoteIcon />
              note
            </a>
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
                    {navigation.myPageLabel}
                  </a>
                  <button
                    type="button"
                    onClick={signOut}
                    className="text-sm hover:opacity-70 transition-opacity border-0 bg-transparent cursor-pointer"
                    style={{ color: "#1A2B1E" }}
                  >
                    {navigation.logoutLabel}
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-sm font-medium hover:text-[#3C6B4F] transition-colors"
                    style={{ color: "#1A2B1E" }}
                  >
                    {navigation.loginLabel}
                  </a>
                  <a
                    href="/signup"
                    className="text-sm font-bold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#3C6B4F" }}
                  >
                    {navigation.joinLabel}
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
            {navigation.headerItems.map((item) => (
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
            <a
              href={NOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeAll}
              className="flex items-center gap-2 py-4 text-base font-medium border-b hover:text-[#3C6B4F] transition-colors"
              style={{ color: "#1A2B1E", borderColor: "rgba(0,0,0,0.08)" }}
            >
              <NoteIcon />
              note
            </a>
            <div className="flex gap-2 pt-6">
              {user ? (
                <>
                  <a
                    href="/member/dashboard"
                    onClick={closeAll}
                    className="flex-1 text-center px-4 py-3 rounded-full text-sm font-medium border"
                    style={{ borderColor: "#3C6B4F", color: "#1A2B1E" }}
                  >
                    {navigation.myPageLabel}
                  </a>
                  <button
                    type="button"
                    onClick={() => { signOut(); closeAll(); }}
                    className="px-4 py-3 rounded-full text-sm border bg-transparent cursor-pointer"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: "#1A2B1E" }}
                  >
                    {navigation.logoutLabel}
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
                    {navigation.loginLabel}
                  </a>
                  <a
                    href="/signup"
                    onClick={closeAll}
                    className="flex-1 text-center px-4 py-3 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: "#3C6B4F" }}
                  >
                    {navigation.joinLabel}
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
