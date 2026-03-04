import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSpotDoc, getPublishedSpots } from "@/lib/firestore";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export default async function SpotDetailPage({ params }: PageProps) {
  const { id } = await params;
  const spot = await getSpotDoc(id);

  if (!spot || spot.status !== "published") notFound();

  const allSpots = await getPublishedSpots();
  const related = allSpots.filter((s) => s.id !== id).slice(0, 3);

  // gallery フィールド（SpotDoc に追加予定、なければ空配列）
  const gallery: string[] = (spot as any).gallery ?? [];

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <a
              href="/spots"
              className="inline-flex items-center gap-1.5 text-xs mb-10 transition-opacity hover:opacity-70"
              style={{ color: "#000000" }}
            >
              ← 拠点一覧に戻る
            </a>

            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
              {/* 左：テキスト */}
              <div className="flex-1 order-2 md:order-1">
                <span
                  className="inline-block text-xs font-medium px-4 mb-5"
                  style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: spot.regionColor || "#005F02", color: "white" }}
                >
                  {spot.region}
                </span>
                <h1
                  className="text-3xl md:text-4xl font-bold leading-tight mb-4"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
                >
                  {spot.name}
                </h1>
                <p className="text-sm mb-5" style={{ color: "#000000" }}>{spot.sub}</p>
                <p className="text-sm leading-[1.9]" style={{ color: "#000000" }}>{spot.desc}</p>

                {/* インフォグリッド */}
                {(spot.address || spot.capacity || spot.price || spot.access) && (
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
                    {spot.address && <InfoItem label="住所" value={spot.address} />}
                    {spot.capacity && <InfoItem label="定員" value={spot.capacity} />}
                    {spot.price && <InfoItem label="料金" value={spot.price} />}
                    {spot.access && <InfoItem label="アクセス" value={spot.access} />}
                  </div>
                )}
              </div>

              {/* 右：画像 */}
              <div className="order-1 md:order-2 flex-shrink-0">
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{ width: "320px", height: "240px", backgroundColor: "rgba(0,95,2,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
                >
                  {spot.img ? (
                    <img src={spot.img} alt={spot.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🏡</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 詳細コンテンツ ── */}
        {spot.content && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[800px] mx-auto px-5 lg:px-10">
              <span
                className="inline-block text-xs font-medium px-4 mb-6"
                style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#005F02", color: "white" }}
              >
                拠点の内容
              </span>
              <div
                className="prose prose-sm md:prose-base max-w-none"
                style={{ color: "#000000" }}
                dangerouslySetInnerHTML={{ __html: spot.content }}
              />
            </div>
          </section>
        )}

        {/* ── ギャラリービュー ── */}
        {gallery.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <span
                className="inline-block text-xs font-medium px-4 mb-5"
                style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#005F02", color: "white" }}
              >
                フォトギャラリー
              </span>
              <h2
                className="text-xl md:text-2xl font-bold mb-10"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
              >
                施設の様子
              </h2>
              {/* メイン + サブグリッド */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {gallery[0] && (
                  <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden" style={{ height: "320px" }}>
                    <img src={gallery[0]} alt={`${spot.name} 1`} className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500" />
                  </div>
                )}
                {gallery.slice(1).map((img, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ height: "155px" }}>
                    <img src={img} alt={`${spot.name} ${i + 2}`} className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA（予約・お問い合わせ → 一覧に戻る） ── */}
        <section className="py-16" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
              {spot.name}を予約する
            </h2>
            <p className="text-sm mb-8" style={{ color: "#000000" }}>
              宿泊・見学のご予約・お問い合わせはこちらから。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/contact?spot=${encodeURIComponent(spot.name)}`}
                className="inline-flex items-center justify-center px-10 py-3.5 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#005F02" }}
              >
                予約・お問い合わせ
              </a>
              <a
                href="/spots"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-medium border-2 hover:opacity-70 transition-opacity"
                style={{ borderColor: "rgba(0,95,2,0.2)", color: "#005F02" }}
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
                className="text-xl font-bold mb-10 text-center"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
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
                      {s.img
                        ? <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl">🏡</div>
                      }
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] mb-1" style={{ color: "#000000" }}>{s.region}</p>
                      <p className="text-sm font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>{s.name}</p>
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] mb-0.5" style={{ color: "#000000" }}>{label}</p>
      <p className="text-sm" style={{ color: "#005F02" }}>{value}</p>
    </div>
  );
}
