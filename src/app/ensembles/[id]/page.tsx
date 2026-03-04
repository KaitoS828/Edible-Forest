import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getEnsemble, ENSEMBLES } from "@/data/ensembles";
import { getEnsembleDoc, getPublishedEnsembles } from "@/lib/firestore";
import { JoinButton } from "./JoinButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EnsembleDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Firestoreから取得、なければ静的データにフォールバック
  let ensemble: {
    id: string; name: string; sub: string; region: string; regionColor: string;
    desc: string; img: string; tagline?: string; philosophy?: string;
    activities?: { icon: string; title: string; desc: string }[];
    stats?: { label: string; value: string }[];
    gallery?: string[]; active?: boolean;
    organizer?: { name: string; role: string; bio: string; avatar?: string };
  } | null = null;

  try {
    const fsDoc = await getEnsembleDoc(id);
    if (fsDoc && (fsDoc.status === "published" || fsDoc.active)) {
      ensemble = {
        id: fsDoc.id,
        name: fsDoc.name,
        sub: fsDoc.sub,
        region: fsDoc.region,
        regionColor: fsDoc.regionColor,
        desc: fsDoc.desc,
        img: fsDoc.img,
        tagline: fsDoc.tagline,
        philosophy: fsDoc.philosophy,
        activities: fsDoc.activities,
        stats: fsDoc.stats,
        gallery: fsDoc.gallery,
        active: fsDoc.active,
      };
    }
  } catch { /* Firestore未設定時はスキップ */ }

  if (!ensemble) {
    const staticData = getEnsemble(id);
    if (staticData) {
      ensemble = staticData;
    }
  }

  if (!ensemble) notFound();

  // 関連アンサンブル：Firestoreから取得、なければ静的データ
  let related: { id: string; name: string; sub: string; region: string; regionColor: string; img: string }[] = [];
  try {
    const fsDocs = await getPublishedEnsembles();
    related = fsDocs.filter((e) => e.id !== id).slice(0, 3).map((e) => ({
      id: e.id, name: e.name, sub: e.sub, region: e.region, regionColor: e.regionColor, img: e.img,
    }));
  } catch { /* fallback */ }
  if (related.length === 0) {
    related = ENSEMBLES.filter((e) => e.active && e.id !== id).slice(0, 3);
  }

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            {/* パンくず */}
            <a
              href="/#activities"
              className="inline-flex items-center gap-1.5 text-xs mb-10 transition-opacity hover:opacity-70"
              style={{ color: "#000000" }}
            >
              <span>←</span>
              <span>アンサンブル一覧に戻る</span>
            </a>

            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
              {/* 左：テキスト */}
              <div className="flex-1 order-2 md:order-1">
                {/* 地域バッジ */}
                <span
                  className="inline-block text-xs font-medium px-4 mb-5"
                  style={{
                    height: "24px",
                    lineHeight: "24px",
                    borderRadius: "12px",
                    backgroundColor: ensemble.regionColor,
                    color: "white",
                  }}
                >
                  {ensemble.region}
                </span>

                {/* アンサンブル名 */}
                <h1
                  className="text-3xl md:text-4xl font-bold leading-tight mb-4"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
                >
                  {ensemble.name}
                </h1>

                {/* サブタイトル */}
                <p className="text-sm mb-5" style={{ color: "#000000" }}>
                  {ensemble.sub}
                </p>

                {/* タグライン */}
                {ensemble.tagline && (
                  <p
                    className="text-base md:text-lg font-medium mb-6 leading-relaxed"
                    style={{ color: ensemble.regionColor }}
                  >
                    {ensemble.tagline}
                  </p>
                )}

                {/* 説明文 */}
                <p className="text-sm leading-[1.9] mb-8" style={{ color: "#000000" }}>
                  {ensemble.desc}
                </p>

                {/* 参加ボタン */}
                <JoinButton ensembleName={ensemble.name} />
              </div>

              {/* 右：円形画像 */}
              <div className="order-1 md:order-2 flex-shrink-0">
                <div
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "300px",
                    height: "300px",
                    boxShadow: `0 0 0 6px white, 0 0 0 9px ${ensemble.regionColor}50`,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <img
                    src={ensemble.img}
                    alt={ensemble.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── アンサンブルの内容 ── */}
        {ensemble.philosophy && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[800px] mx-auto px-5 lg:px-10">
              <span
                className="inline-block text-xs font-medium px-4 mb-6"
                style={{
                  height: "24px",
                  lineHeight: "24px",
                  borderRadius: "12px",
                  backgroundColor: "#005F02",
                  color: "white",
                }}
              >
                アンサンブルの内容
              </span>
              <div
                className="prose prose-sm md:prose-base max-w-none"
                style={{ color: "#000000" }}
                dangerouslySetInnerHTML={{ __html: ensemble.philosophy }}
              />
            </div>
          </section>
        )}

        {/* ── ギャラリー ── */}
        {ensemble.gallery && ensemble.gallery.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <span
                className="inline-block text-xs font-medium px-4 mb-5"
                style={{
                  height: "24px",
                  lineHeight: "24px",
                  borderRadius: "12px",
                  backgroundColor: "#005F02",
                  color: "white",
                }}
              >
                フォトギャラリー
              </span>
              <h2
                className="text-xl md:text-2xl font-bold mb-10"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
              >
                活動の様子
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ensemble.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl"
                    style={{ height: "220px", backgroundColor: "rgba(0,95,2,0.06)" }}
                  >
                    <img
                      src={img}
                      alt={`${ensemble.name} ギャラリー ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA（参加ボタン → 一覧に戻る） ── */}
        <section className="py-16" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
            <h2
              className="text-xl md:text-2xl font-bold mb-4"
              style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
            >
              {ensemble.name}に参加してみませんか？
            </h2>
            <p className="text-sm mb-8" style={{ color: "#000000" }}>
              体験参加・見学のお問い合わせはこちらから。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <JoinButton ensembleName={ensemble.name} />
              <a
                href="/ensembles"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-medium border transition-all hover:opacity-70"
                style={{ borderColor: "rgba(0,95,2,0.2)", color: "#005F02" }}
              >
                ← 一覧に戻る
              </a>
            </div>
          </div>
        </section>

        {/* ── 関連アンサンブル（CTAの後） ── */}
        {related.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "rgba(0,95,2,0.03)" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <h2
                className="text-xl md:text-2xl font-bold mb-10 text-center"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
              >
                他のアンサンブルを見る
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {related.map((r) => (
                  <a
                    key={r.id}
                    href={`/ensembles/${r.id}`}
                    className="flex flex-col items-center text-center group"
                  >
                    <div
                      className="rounded-full overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-[1.04]"
                      style={{
                        width: "160px",
                        height: "160px",
                        boxShadow: `0 0 0 4px white, 0 0 0 6px ${r.regionColor}40`,
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <img
                        src={r.img}
                        alt={r.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className="inline-block text-[11px] font-medium px-3 mb-2"
                      style={{
                        height: "20px",
                        lineHeight: "20px",
                        borderRadius: "10px",
                        backgroundColor: r.regionColor,
                        color: "white",
                      }}
                    >
                      {r.region}
                    </span>
                    <h3
                      className="text-sm font-bold mb-1 transition-colors group-hover:text-[#005F02]"
                      style={{ color: "#005F02" }}
                    >
                      {r.name}
                    </h3>
                    <p className="text-xs" style={{ color: "#000000" }}>
                      {r.sub}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
