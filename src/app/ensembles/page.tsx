import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublishedEnsembles } from "@/lib/firestore";
import EnsembleList from "./EnsembleList";

export const dynamic = "force-dynamic";

export default async function EnsemblesPage() {
  const raw = await getPublishedEnsembles();
  const ensembles = raw.map(({ createdAt, updatedAt, ...rest }) => rest);

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">
        {/* ページヘッダー */}
        <section className="bg-white py-12 md:py-16 border-b" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <div className="text-xs mb-4" style={{ color: "#1A2B1E" }}>
              <a href="/" className="hover:underline">トップ</a>
              <span className="mx-2">›</span>
              <span>アンサンブル一覧</span>
            </div>
            <span className="inline-block text-xs font-medium px-3 mb-3" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
              イベント
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              アンサンブル一覧
            </h1>
            <p className="text-sm" style={{ color: "#1A2B1E" }}>
              全国各地のローカルコミュニティ（LC）をご紹介します。
            </p>
          </div>
        </section>

        <EnsembleList ensembles={ensembles} />

        {/* 下部CTA */}
        <section className="py-12 bg-white border-t" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
            <p className="text-base font-bold mb-2" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              あなたもアンサンブルに参加しませんか？
            </p>
            <p className="text-sm mb-6" style={{ color: "#1A2B1E" }}>
              月会費 ¥1,000 で、全国の拠点・イベントへアクセスできます。
            </p>
            <a
              href="/join"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#3C6B4F" }}
            >
              倶楽部に参加する →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
