import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer id="contact" className="pt-14 pb-8 border-t" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,95,2,0.15)" }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-10">
          <div>
            <div className="mb-4"><Logo size="lg" /></div>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: "#000000" }}>
              自然界の仕組みを人間社会とテクノロジーに応用し、
              新しい生き方を実践・発信するコミュニティです。
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm" style={{ color: "#000000" }}>
            <div>
              <p className="font-medium mb-3" style={{ color: "#005F02" }}>倶楽部について</p>
              <ul className="space-y-2 text-xs">
                <li><a href="/#about"     className="hover:text-[#005F02] transition-colors">コンセプト</a></li>
                <li><a href="/#pillars"   className="hover:text-[#005F02] transition-colors">4つの柱</a></li>
                <li><a href="/#locations" className="hover:text-[#005F02] transition-colors">活動拠点（LC）</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-3" style={{ color: "#005F02" }}>サービス</p>
              <ul className="space-y-2 text-xs">
                <li><a href="/#activities" className="hover:text-[#005F02] transition-colors">活動・体験</a></li>
                <li><a href="/#membership" className="hover:text-[#005F02] transition-colors">会員プラン</a></li>
                <li><a href="/reports"     className="hover:text-[#005F02] transition-colors">活動レポート</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-3" style={{ color: "#005F02" }}>お問い合わせ</p>
              <ul className="space-y-2 text-xs">
                <li><a href="/#join"                         className="hover:text-[#005F02] transition-colors">参加・入会</a></li>
                <li><a href="mailto:info@edible-forest.jp"   className="hover:text-[#005F02] transition-colors break-all">info@edible-forest.jp</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-xs border-t pt-6 text-center" style={{ color: "#000000", borderColor: "rgba(0,95,2,0.15)" }}>
          © 2024 食べられる森アンサンブル倶楽部. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
