import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ENSEMBLES } from "@/data/ensembles";
import { getPublishedSpots } from "@/lib/firestore";

export const revalidate = 60;

export default async function MemberPage() {
  const spots = await getPublishedSpots();
  const ensembles = ENSEMBLES.filter((e) => e.active);

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">

        {/* ページヘッダー */}
        <section className="py-12 md:py-16 border-b" style={{ borderColor: "rgba(0,95,2,0.1)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span
                  className="inline-block text-xs font-medium px-4 mb-4"
                  style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#005F02", color: "white" }}
                >
                  メンバーエリア
                </span>
                <h1
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
                >
                  アンサンブルと宿泊拠点
                </h1>
                <p className="text-sm" style={{ color: "#000000", lineHeight: "1.8" }}>
                  全国各地のアンサンブル（活動拠点）と宿泊施設を一覧でご覧いただけます。
                </p>
              </div>
              <a
                href="/member/dashboard"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#005F02" }}
              >
                マイページ →
              </a>
            </div>
          </div>
        </section>

        {/* アンサンブル一覧 */}
        <section className="py-14 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <div className="flex items-baseline gap-3 mb-10">
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
              >
                アンサンブル一覧
              </h2>
              <span className="text-xs" style={{ color: "#000000" }}>{ensembles.length} 拠点</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-10">
              {ensembles.map((e) => (
                <a key={e.id} href={"/ensembles/" + e.id} className="group flex flex-col items-center text-center">
                  <div
                    className="relative overflow-hidden rounded-full mb-4 transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{
                      width: "140px",
                      height: "140px",
                      boxShadow: "0 0 0 4px white, 0 0 0 6px rgba(0,95,2,0.2)",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <img src={e.img} alt={e.name} className="w-full h-full object-cover" />
                  </div>
                  <span
                    className="inline-block text-[11px] font-medium px-3 mb-2"
                    style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: "#005F02", color: "white" }}
                  >
                    {e.region}
                  </span>
                  <h3 className="text-sm font-bold mb-1 transition-opacity group-hover:opacity-70" style={{ color: "#005F02" }}>
                    {e.name}
                  </h3>
                  <p className="text-xs" style={{ color: "#000000" }}>{e.sub}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 区切り線 */}
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <hr style={{ borderColor: "rgba(0,95,2,0.1)" }} />
        </div>

        {/* 宿泊施設一覧 */}
        <section className="py-14 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <div className="flex items-baseline gap-3 mb-10">
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
              >
                宿泊施設・拠点一覧
              </h2>
              <span className="text-xs" style={{ color: "#000000" }}>{spots.length} 件</span>
            </div>
            {spots.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm" style={{ color: "#000000" }}>現在、公開中の宿泊拠点はありません</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {spots.map((spot) => (
                  <div
                    key={spot.id}
                    className="group block bg-white rounded-3xl overflow-hidden card-lift"
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,95,2,0.12)" }}
                  >
                    <a href={"/spots/" + spot.id} className="block">
                      <div className="relative overflow-hidden" style={{ height: "200px", backgroundColor: "#FFFFFF" }}>
                        {spot.img ? (
                          <img src={spot.img} alt={spot.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                        ) : (
                          <div className="w-full h-full" style={{ backgroundColor: "#f5f5f5" }} />
                        )}
                        <span
                          className="absolute top-3 left-3 text-[11px] font-medium px-3"
                          style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: spot.regionColor || "#005F02", color: "white" }}
                        >
                          {spot.region}
                        </span>
                      </div>
                    </a>
                    <div className="p-5">
                      <a href={"/spots/" + spot.id} className="block mb-1">
                        <h3
                          className="text-base font-bold group-hover:opacity-70 transition-opacity"
                          style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
                        >
                          {spot.name}
                        </h3>
                      </a>
                      <p className="text-xs mb-3" style={{ color: "#000000" }}>{spot.sub}</p>
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#000000" }}>{spot.desc}</p>
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(0,95,2,0.1)" }}>
                        <div className="flex gap-4 mb-4">
                          {spot.capacity && (
                            <div>
                              <p className="text-[10px]" style={{ color: "#000000" }}>定員</p>
                              <p className="text-xs font-medium" style={{ color: "#005F02" }}>{spot.capacity}</p>
                            </div>
                          )}
                          {spot.price && (
                            <div>
                              <p className="text-[10px]" style={{ color: "#000000" }}>料金</p>
                              <p className="text-xs font-medium" style={{ color: "#005F02" }}>{spot.price}</p>
                            </div>
                          )}
                        </div>
                        <a
                          href={"/contact?spot=" + encodeURIComponent(spot.name)}
                          className="block w-full text-center py-2.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#005F02" }}
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

        {/* CTA */}
        <section className="py-14 border-t" style={{ borderColor: "rgba(0,95,2,0.1)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
            <p className="text-base font-bold mb-2" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
              アンサンブルを管理・投稿する
            </p>
            <p className="text-sm mb-6" style={{ color: "#000000" }}>
              メンバーとしてログインすると、アンサンブルや宿泊施設を投稿・管理できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/member/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#005F02" }}
              >
                マイページへ
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-medium border transition-all hover:opacity-70"
                style={{ borderColor: "rgba(0,95,2,0.3)", color: "#005F02" }}
              >
                ログイン
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
