import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublishedSpots } from "@/lib/firestore";

export const revalidate = 60;

export default async function SpotsPage() {
  const spots = await getPublishedSpots();

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">
        {/* ページヘッダー */}
        <section className="bg-white py-14 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <span
              className="inline-block text-xs font-medium px-4 mb-5"
              style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}
            >
              拠点
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
            >
              全国の宿泊施設・拠点
            </h1>
            <p className="text-sm max-w-xl" style={{ color: "#1A2B1E", lineHeight: "1.9" }}>
              食べられる森アンサンブル倶楽部の会員が運営する、全国各地の宿泊施設・拠点を紹介します。
            </p>
          </div>
        </section>

        {/* 一覧 */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            {spots.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-base" style={{ color: "#1A2B1E" }}>
                  現在、公開中の拠点はありません
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {spots.map((spot) => (
                  <div
                    key={spot.id}
                    className="group block bg-white rounded-3xl overflow-hidden card-lift"
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,95,2,0.15)" }}
                  >
                    {/* 画像 */}
                    <a href={`/spots/${spot.id}`} className="block">
                      <div className="relative overflow-hidden" style={{ height: "200px", backgroundColor: "#FFFFFF" }}>
                        {spot.img ? (
                          <img src={spot.img} alt={spot.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                        ) : (
                          <div className="w-full h-full" style={{ backgroundColor: "#FFFFFF" }} />
                        )}
                        <span
                          className="absolute top-3 left-3 text-[11px] font-medium px-3"
                          style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: spot.regionColor || "#3C6B4F", color: "white" }}
                        >
                          {spot.region}
                        </span>
                      </div>
                    </a>

                    {/* テキスト */}
                    <div className="p-5">
                      <a href={`/spots/${spot.id}`} className="block mb-1">
                        <h2
                          className="text-base font-bold group-hover:text-[#3C6B4F] transition-colors"
                          style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
                        >
                          {spot.name}
                        </h2>
                      </a>
                      <p className="text-xs mb-3" style={{ color: "#1A2B1E" }}>{spot.sub}</p>
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#1A2B1E" }}>{spot.desc}</p>

                      {/* インフォ + 予約ボタン */}
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
                        <div className="flex gap-4 mb-4">
                          {spot.capacity && (
                            <div>
                              <p className="text-[10px]" style={{ color: "#1A2B1E" }}>定員</p>
                              <p className="text-xs font-medium" style={{ color: "#3C6B4F" }}>{spot.capacity}</p>
                            </div>
                          )}
                          {spot.price && (
                            <div>
                              <p className="text-[10px]" style={{ color: "#1A2B1E" }}>料金</p>
                              <p className="text-xs font-medium" style={{ color: "#3C6B4F" }}>{spot.price}</p>
                            </div>
                          )}
                        </div>
                        <a
                          href={`/contact?spot=${encodeURIComponent(spot.name)}`}
                          className="block w-full text-center py-2.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#3C6B4F" }}
                        >
                          予約する
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
