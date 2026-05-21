import { Logo } from "./Logo";

const FOOTER_NAV = [
  {
    title: "食べられる森について",
    links: [
      { label: "コンセプト", href: "/concept" },
      { label: "食べられる森とは", href: "/#about" },
    ],
  },
  {
    title: "各地の拠点",
    links: [
      { label: "LC（ローカルコミュニティ）", href: "/#events" },
      { label: "地図から探す", href: "/#search" },
      { label: "拠点一覧", href: "/ensembles" },
    ],
  },
  {
    title: "宿泊・参加",
    links: [
      { label: "宿泊拠点一覧", href: "/spots" },
      { label: "倶楽部に参加", href: "/join" },
      { label: "ログイン", href: "/login" },
    ],
  },
  {
    title: "活動・お知らせ",
    links: [
      { label: "活動レポート", href: "/reports" },
      { label: "お問い合わせ", href: "/contact" },
    ],
  },
];

const UTILITY_LINKS = [
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "利用規約", href: "/terms" },
  { label: "お問い合わせ", href: "/contact" },
];

export function Footer() {
  return (
    <footer
      id="contact"
      className="pt-16 pb-8"
      style={{ backgroundColor: "#F4F4F2", borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-[1400px] mx-auto px-5 lg:px-12">
        <div className="mb-12">
          <Logo size="lg" />
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-14"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <p className="text-lg font-bold mb-5" style={{ color: "#1A2B1E" }}>
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-base hover:text-[#3C6B4F] transition-colors"
                      style={{ color: "rgba(26,43,30,0.75)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-3 pt-8 border-t text-sm"
          style={{ borderColor: "rgba(0,0,0,0.1)", color: "rgba(26,43,30,0.55)", fontFamily: "'Noto Sans JP', sans-serif" }}
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
            © 2024 食べられる森アンサンブル倶楽部
          </span>
        </div>
      </div>
    </footer>
  );
}
