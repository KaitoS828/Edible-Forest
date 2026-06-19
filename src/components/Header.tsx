"use client";
import { useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Logo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SITE_SETTINGS_DEFAULT, type ExternalLinkSetting, type LanguageLinkSetting } from "@/data/siteSettings";

const NOTE_URL = "https://note.com/exergy_foresters";
const HEADER_BG = "#285C53";

const EXTERNAL_LINKS_FALLBACK: ExternalLinkSetting[] = [
  { label: "note", href: NOTE_URL, icon: "note" },
  { label: "Facebook", icon: "facebook" },
  { label: "X", icon: "x" },
];

const LANGUAGE_LINKS_FALLBACK: LanguageLinkSetting[] = [
  { label: "日本語", shortLabel: "JP", href: "/?lang=ja", active: true },
  { label: "English", shortLabel: "EN", href: "/?lang=en" },
];

function NoteIcon() {
  return (
    <img
      src="/brand/note-icon.svg"
      alt=""
      className="h-5 w-5 object-contain"
      aria-hidden="true"
    />
  );
}

function ExternalIcon({ icon }: { icon?: ExternalLinkSetting["icon"] }) {
  if (icon === "note") return <NoteIcon />;
  if (icon === "facebook") {
    return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px] font-bold text-[#285C53]">f</span>;
  }
  if (icon === "x") {
    return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px] font-bold text-[#285C53]">X</span>;
  }
  return <span className="inline-flex h-5 w-5 items-center justify-center text-sm">↗</span>;
}

function ChevronDown() {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinksMenu({ links }: { links: ExternalLinkSetting[] }) {
  return (
    <div className="relative group flex h-9 items-center">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1.5 border-l border-white/35 pl-3 text-[13px] font-medium leading-none text-white transition-colors group-hover:text-[#DDEB87]"
      >
        各種リンク
        <ChevronDown />
      </button>
      <div className="invisible absolute right-0 top-full z-50 min-w-[190px] translate-y-2 border border-white/10 bg-[#214D46] py-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {links.map((link) => {
          const content = (
            <>
              <ExternalIcon icon={link.icon} />
              <span>{link.label}</span>
              {!link.href && <span className="ml-auto text-[10px] text-white/45">準備中</span>}
            </>
          );
          const className = "flex w-full items-center gap-2 px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/10";

          return link.href ? (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
              {content}
            </a>
          ) : (
            <span key={link.label} className={`${className} cursor-default opacity-70`}>
              {content}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function LanguageMenu({ links }: { links: LanguageLinkSetting[] }) {
  const active = links.find((link) => link.active) ?? links[0];

  return (
    <div className="relative group hidden sm:block">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-white/90 transition-colors group-hover:text-white"
        aria-label="言語を選択"
      >
        <span>{active?.shortLabel ?? "JP"}</span>
        <ChevronDown />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[140px] translate-y-2 border border-white/10 bg-[#214D46] py-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {links.map((link) => {
          const className = `block px-4 py-2 text-sm transition-colors ${link.active ? "text-[#DDEB87]" : "text-white hover:bg-white/10"}`;
          if (link.href) {
            return (
              <a key={link.shortLabel} href={link.href} className={className}>
                {link.label}
              </a>
            );
          }
          return (
            <span key={link.shortLabel} className={`${className} cursor-default ${link.active ? "" : "opacity-60"}`}>
              {link.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading, signOut } = useAuth();
  const { navigation } = useSiteSettings();
  const externalLinks = navigation.externalLinks ?? EXTERNAL_LINKS_FALLBACK;
  const currentLang = searchParams.get("lang") === "en" ? "en" : "ja";
  const makeLanguageHref = useCallback((lang: "ja" | "en") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);
  const configuredLanguageLinks = navigation.languageLinks?.length ? navigation.languageLinks : LANGUAGE_LINKS_FALLBACK;
  const languageLinks: LanguageLinkSetting[] = configuredLanguageLinks.map((link) => {
    const lang = link.shortLabel.toLowerCase() === "en" ? "en" : "ja";
    return {
      ...link,
      href: makeLanguageHref(lang),
      active: currentLang === lang,
    };
  });
  const headerItems = navigation.headerItems.length > 0 ? navigation.headerItems : SITE_SETTINGS_DEFAULT.navigation.headerItems;

  const closeAll = useCallback(() => setOpen(false), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="border-b"
        style={{ backgroundColor: HEADER_BG, borderColor: "rgba(255,255,255,0.28)" }}
      >
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12 h-[72px] flex items-center gap-5">
          <div className="flex items-center gap-5 shrink-0">
            <a href="/" className="shrink-0" onClick={closeAll}>
              <Logo size="sm" tone="light" />
            </a>
            <LanguageMenu links={languageLinks} />
          </div>

          <nav
            className="hidden lg:flex h-9 items-center justify-end gap-3 xl:gap-4 flex-1 min-w-0"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {headerItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex h-9 items-center text-[13px] font-medium leading-none tracking-wide text-white transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
            <ExternalLinksMenu links={externalLinks} />
          </nav>

          {!loading && (
            <div
              className="hidden lg:flex h-9 items-center gap-3 shrink-0"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {user ? (
                <>
                  <a
                    href="/member/dashboard"
                    className="inline-flex h-9 items-center text-[13px] font-medium leading-none text-white/90 transition-colors hover:text-white"
                  >
                    {navigation.myPageLabel}
                  </a>
                  <button
                    type="button"
                    onClick={signOut}
                    className="inline-flex h-9 items-center border-0 bg-transparent text-[13px] leading-none text-white/75 transition-colors hover:text-white cursor-pointer"
                  >
                    {navigation.logoutLabel}
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="inline-flex h-9 items-center text-[13px] font-medium leading-none text-white/90 transition-colors hover:text-white"
                  >
                    {navigation.loginLabel}
                  </a>
                  <a
                    href="/signup"
                    className="inline-flex h-9 items-center border border-white/65 px-4 text-[13px] font-bold leading-none text-white transition-colors hover:bg-white hover:text-[#285C53]"
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
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div
          className="lg:hidden border-b"
          style={{ backgroundColor: "#214D46", borderColor: "rgba(255,255,255,0.18)" }}
        >
          <div className="px-5 py-6" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {headerItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeAll}
                className="block py-4 text-base font-medium border-b text-white transition-colors hover:text-[#DDEB87]"
                style={{ borderColor: "rgba(255,255,255,0.16)" }}
              >
                {item.label}
              </a>
            ))}
            <div className="border-b py-4" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-white/55">各種リンク</p>
              <div className="grid grid-cols-1 gap-2">
                {externalLinks.map((link) => (
                  link.href ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeAll}
                      className="flex items-center gap-2 py-1.5 text-base font-medium text-white"
                    >
                      <ExternalIcon icon={link.icon} />
                      {link.label}
                    </a>
                  ) : (
                    <span key={link.label} className="flex items-center gap-2 py-1.5 text-base font-medium text-white/55">
                      <ExternalIcon icon={link.icon} />
                      {link.label}
                      <span className="text-xs">準備中</span>
                    </span>
                  )
                ))}
              </div>
            </div>
            <div className="flex gap-2 border-b py-4" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
              {languageLinks.map((link) => {
                const className = `px-3 py-1.5 text-sm ${link.active ? "bg-white text-[#285C53]" : "border border-white/30 text-white/65"}`;
                if (link.href) {
                  return (
                    <a key={link.shortLabel} href={link.href} onClick={closeAll} className={className}>
                      {link.shortLabel}
                    </a>
                  );
                }
                return (
                  <span key={link.shortLabel} className={className}>
                    {link.shortLabel}
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2 pt-6">
              {user ? (
                <>
                  <a
                    href="/member/dashboard"
                    onClick={closeAll}
                    className="flex-1 text-center px-4 py-3 text-sm font-medium border text-white"
                    style={{ borderColor: "rgba(255,255,255,0.5)" }}
                  >
                    {navigation.myPageLabel}
                  </a>
                  <button
                    type="button"
                    onClick={() => { signOut(); closeAll(); }}
                    className="px-4 py-3 text-sm border bg-transparent cursor-pointer text-white/80"
                    style={{ borderColor: "rgba(255,255,255,0.3)" }}
                  >
                    {navigation.logoutLabel}
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    onClick={closeAll}
                    className="flex-1 text-center px-4 py-3 text-sm font-medium border text-white"
                    style={{ borderColor: "rgba(255,255,255,0.35)" }}
                  >
                    {navigation.loginLabel}
                  </a>
                  <a
                    href="/signup"
                    onClick={closeAll}
                    className="flex-1 text-center px-4 py-3 text-sm font-bold"
                    style={{ backgroundColor: "#FFFFFF", color: "#285C53" }}
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
