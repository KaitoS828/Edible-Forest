"use client";

import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { footer } = useSiteSettings();

  return (
    <footer
      className="py-8"
      style={{ backgroundColor: "#F4F4F2", borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div
        className="max-w-[1400px] mx-auto px-5 lg:px-12 flex flex-wrap items-center gap-3 text-sm"
        style={{ color: "rgba(26,43,30,0.55)", fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        {footer.links.map((link, i) => (
          <span key={link.href} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden style={{ color: "rgba(0,0,0,0.2)" }}>|</span>}
            <a href={link.href} className="hover:text-[#3C6B4F] transition-colors">
              {link.label}
            </a>
          </span>
        ))}
        <span className="w-full sm:w-auto sm:ml-auto pt-2 sm:pt-0">
          {footer.copyright}
        </span>
      </div>
    </footer>
  );
}
