const UTILITY_LINKS = [
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "利用規約", href: "/terms" },
  { label: "運営会社", href: "/company" },
];

export function Footer() {
  return (
    <footer
      className="py-8"
      style={{ backgroundColor: "#F4F4F2", borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div
        className="max-w-[1400px] mx-auto px-5 lg:px-12 flex flex-wrap items-center gap-3 text-sm"
        style={{ color: "rgba(26,43,30,0.55)", fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        {UTILITY_LINKS.map((link, i) => (
          <span key={link.href} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden style={{ color: "rgba(0,0,0,0.2)" }}>|</span>}
            <a href={link.href} className="hover:text-[#3C6B4F] transition-colors">
              {link.label}
            </a>
          </span>
        ))}
        <span className="w-full sm:w-auto sm:ml-auto pt-2 sm:pt-0">
          © 2024 アンサンブル倶楽部～食べられる森を目指して～
        </span>
      </div>
    </footer>
  );
}
