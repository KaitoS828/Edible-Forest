import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function JoinSuccessPage() {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="max-w-[560px] mx-auto px-5 text-center">

          {/* アイコン */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: "#005F02" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span
            className="inline-block text-xs font-medium px-4 mb-5"
            style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#005F02", color: "white" }}
          >
            お支払い完了
          </span>

          <h1
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
          >
            ご入会ありがとうございます
          </h1>

          <p className="text-sm mb-8" style={{ color: "#000000", lineHeight: "1.9" }}>
            食べられる森アンサンブル倶楽部へのご入会が完了しました。<br />
            次のステップとして、会員アカウントを作成してください。<br />
            アカウントを作成すると、アンサンブルへの参加や<br />
            宿泊施設の予約が可能になります。
          </p>

          {/* 次のステップ */}
          <div
            className="bg-white rounded-2xl p-6 mb-8 text-left"
            style={{ border: "1px solid rgba(0,95,2,0.15)" }}
          >
            <p className="text-sm font-bold mb-4" style={{ color: "#005F02" }}>次のステップ</p>
            <ol className="space-y-3 text-sm" style={{ color: "#000000" }}>
              <li className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: "#005F02" }}
                >1</span>
                <span>下のボタンから会員アカウントを作成（メールアドレスはお支払い時と同じものをご使用ください）</span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: "#005F02" }}
                >2</span>
                <span>全国のアンサンブル・宿泊施設にアクセスできます</span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: "#005F02" }}
                >3</span>
                <span>解約はマイページからいつでも手続きできます</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#005F02" }}
            >
              アカウントを作成する →
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-medium border transition-opacity hover:opacity-70"
              style={{ borderColor: "rgba(0,95,2,0.2)", color: "#005F02" }}
            >
              トップへ戻る
            </a>
          </div>

          <p className="text-xs mt-8" style={{ color: "#000000" }}>
            ご不明な点は <a href="/contact" className="underline" style={{ color: "#005F02" }}>お問い合わせ</a> からご連絡ください。
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
