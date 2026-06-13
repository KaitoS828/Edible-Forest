import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getEnsemble, getSpots } from "@/lib/microcms";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpotDetailPage({ params }: PageProps) {
  const { id } = await params;

  const spot = await getEnsemble(id).catch(() => null);
  if (!spot) notFound();

  const allSpots = await getSpots().catch(() => []);
  const related = allSpots.filter((s) => s.id !== id).slice(0, 3);
  const galleryUrls = spot.gallery?.map((g) => g.url) ?? [];

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">

        {/* ── Hero ── */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <a
              href="/spots"
              className="inline-flex items-center gap-1.5 text-sm mb-10 transition-opacity hover:opacity-70"
              style={{ color: "#1A2B1E" }}
            >
              ← 拠点一覧に戻る
            </a>

            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
              {/* 左：テキスト */}
              <div className="flex-1 order-2 md:order-1">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  {spot.sub && (
                    <span
                      className="inline-block text-sm font-medium px-4"
                      style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}
                    >
                      {spot.sub}
                    </span>
                  )}
                  {spot.forestType && (
                    <span
                      className="inline-block text-sm font-medium px-4"
                      style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "rgba(26,43,30,0.85)", color: "white" }}
                    >
                      🌳 {spot.forestType}
                    </span>
                  )}
                </div>
                <h1
                  className="text-4xl md:text-5xl font-bold leading-tight mb-4"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
                >
                  {spot.title}
                </h1>
                {spot.caution && (
                  <p className="text-base leading-[1.9]" style={{ color: "#1A2B1E" }}>{spot.caution}</p>
                )}

                {/* インフォグリッド */}
                {spot.stats && spot.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
                    {spot.stats.map((s) => (
                      <div key={s.fieldId}>
                        <p className="text-xs mb-0.5" style={{ color: "#1A2B1E" }}>{s.label}</p>
                        <p className="text-base" style={{ color: "#3C6B4F" }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 右：画像 */}
              <div className="order-1 md:order-2 flex-shrink-0">
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{ width: "320px", height: "240px", backgroundColor: "rgba(0,95,2,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
                >
                  {spot.heroImage ? (
                    <img src={spot.heroImage.url} alt={spot.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🏡</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 詳細コンテンツ ── */}
        {spot.philosophy && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[800px] mx-auto px-5 lg:px-10">
              <span
                className="inline-block text-sm font-medium px-4 mb-6"
                style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}
              >
                拠点の内容
              </span>
              <div
                className="prose prose-sm md:prose-base max-w-none"
                style={{ color: "#1A2B1E" }}
                dangerouslySetInnerHTML={{ __html: spot.philosophy }}
              />
            </div>
          </section>
        )}

        {/* ── ギャラリービュー ── */}
        {galleryUrls.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <span
                className="inline-block text-sm font-medium px-4 mb-5"
                style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}
              >
                フォトギャラリー
              </span>
              <h2
                className="text-2xl md:text-3xl font-bold mb-10"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
              >
                施設の様子
              </h2>
              {/* メイン + サブグリッド */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {galleryUrls[0] && (
                  <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden" style={{ height: "320px" }}>
                    <img src={galleryUrls[0]} alt={`${spot.title} 1`} className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500" />
                  </div>
                )}
                {galleryUrls.slice(1).map((url, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ height: "155px" }}>
                    <img src={url} alt={`${spot.title} ${i + 2}`} className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA（予約・お問い合わせ → 一覧に戻る） ── */}
        <section className="py-16" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              {spot.title}を予約する
            </h2>
            <p className="text-base mb-8" style={{ color: "#1A2B1E" }}>
              宿泊・見学のご予約・お問い合わせはこちらから。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={spot.bookingUrl ?? `/contact?spot=${encodeURIComponent(spot.title)}`}
                target={spot.bookingUrl ? "_blank" : undefined}
                rel={spot.bookingUrl ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center px-10 py-3.5 rounded-full text-white text-base font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#3C6B4F" }}
              >
                予約・お問い合わせ
              </a>
              <a
                href="/spots"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-base font-medium border-2 hover:opacity-70 transition-opacity"
                style={{ borderColor: "rgba(0,95,2,0.2)", color: "#3C6B4F" }}
              >
                ← 一覧に戻る
              </a>
            </div>
          </div>
        </section>

        {/* ── 他の拠点（CTAの後） ── */}
        {related.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "rgba(0,95,2,0.03)" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <h2
                className="text-2xl font-bold mb-10 text-center"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
              >
                他の拠点を見る
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {related.map((s) => (
                  <a
                    key={s.id}
                    href={`/spots/${s.id}`}
                    className="group block bg-white rounded-2xl overflow-hidden border hover:-translate-y-1 transition-transform"
                    style={{ border: "1px solid rgba(0,95,2,0.15)" }}
                  >
                    <div style={{ height: "140px", backgroundColor: "rgba(0,95,2,0.06)" }} className="overflow-hidden">
                      {s.heroImage
                        ? <img src={s.heroImage.url} alt={s.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl">🏡</div>
                      }
                    </div>
                    <div className="p-4">
                      {s.sub && <p className="text-xs mb-1" style={{ color: "#1A2B1E", opacity: 0.6 }}>{s.sub}</p>}
                      <p className="text-base font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>{s.title}</p>
                    </div>
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
