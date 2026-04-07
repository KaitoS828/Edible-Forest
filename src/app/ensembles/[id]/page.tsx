import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getEnsembleDoc, getPublishedEnsembles } from "@/lib/firestore";
import { JoinButton } from "./JoinButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EnsembleDetailPage({ params }: PageProps) {
  const { id } = await params;

  const ensemble = await getEnsembleDoc(id);
  if (!ensemble || (!ensemble.active && ensemble.status !== "published")) notFound();

  const allEnsembles = await getPublishedEnsembles();
  const related = allEnsembles.filter((e) => e.id !== id).slice(0, 3);

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <a
              href="/#activities"
              className="inline-flex items-center gap-1.5 text-xs mb-10 transition-opacity hover:opacity-70"
              style={{ color: "#1A2B1E" }}
            >
              <span>←</span>
              <span>アンサンブル一覧に戻る</span>
            </a>

            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
              <div className="flex-1 order-2 md:order-1">
                <span
                  className="inline-block text-xs font-medium px-4 mb-5"
                  style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: ensemble.regionColor, color: "white" }}
                >
                  {ensemble.region}
                </span>
                <h1
                  className="text-3xl md:text-4xl font-bold leading-tight mb-4"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
                >
                  {ensemble.name}
                </h1>
                <p className="text-sm mb-5" style={{ color: "#1A2B1E" }}>{ensemble.sub}</p>
                {ensemble.tagline && (
                  <p className="text-base md:text-lg font-medium mb-6 leading-relaxed" style={{ color: ensemble.regionColor }}>
                    {ensemble.tagline}
                  </p>
                )}
                <p className="text-sm leading-[1.9] mb-8" style={{ color: "#1A2B1E" }}>{ensemble.desc}</p>
                <JoinButton ensembleName={ensemble.name} />
              </div>

              <div className="order-1 md:order-2 flex-shrink-0">
                <div
                  className="rounded-full overflow-hidden"
                  style={{ width: "300px", height: "300px", boxShadow: `0 0 0 6px white, 0 0 0 9px ${ensemble.regionColor}50`, backgroundColor: "#FFFFFF" }}
                >
                  <img src={ensemble.img} alt={ensemble.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 実績・統計 ── */}
        {ensemble.stats && ensemble.stats.length > 0 && (
          <section className="py-10 md:py-14" style={{ backgroundColor: "rgba(0,95,2,0.03)" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <div className="flex flex-wrap justify-center gap-10 md:gap-20">
                {ensemble.stats.map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <span className="text-4xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>{s.value}</span>
                    <span className="text-xs" style={{ color: "#1A2B1E", opacity: 0.55 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── アンサンブルの内容 ── */}
        {ensemble.philosophy && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[800px] mx-auto px-5 lg:px-10">
              <span className="inline-block text-xs font-medium px-4 mb-6" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}>
                アンサンブルの内容
              </span>
              <div
                className="prose prose-sm md:prose-base max-w-none"
                style={{ color: "#1A2B1E" }}
                dangerouslySetInnerHTML={{ __html: ensemble.philosophy }}
              />
            </div>
          </section>
        )}

        {/* ── アクティビティ ── */}
        {ensemble.activities && ensemble.activities.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <span className="inline-block text-xs font-medium px-4 mb-6" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}>
                アクティビティ
              </span>
              <h2 className="text-xl md:text-2xl font-bold mb-10" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                体験できること
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {ensemble.activities.map((a, i) => (
                  <div key={i} className="rounded-3xl overflow-hidden" style={{ backgroundColor: "rgba(0,95,2,0.04)", border: "1px solid rgba(0,95,2,0.1)" }}>
                    {a.img ? (
                      <div className="relative" style={{ height: "180px" }}>
                        <img src={a.img} alt={a.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-3 left-3 text-3xl bg-white/80 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">{a.icon}</div>
                      </div>
                    ) : (
                      <div className="pt-6 px-6">
                        <div className="text-4xl mb-4">{a.icon}</div>
                      </div>
                    )}
                    <div className="p-6 pt-4">
                      <h3 className="text-sm font-bold mb-2" style={{ color: "#3C6B4F" }}>{a.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "#1A2B1E", opacity: 0.75 }}>{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── オーガナイザー ── */}
        {ensemble.organizer && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "rgba(0,95,2,0.03)" }}>
            <div className="max-w-[800px] mx-auto px-5 lg:px-10">
              <span className="inline-block text-xs font-medium px-4 mb-6" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}>
                オーガナイザー
              </span>
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="rounded-full overflow-hidden" style={{ width: "120px", height: "120px", boxShadow: `0 0 0 4px white, 0 0 0 6px ${ensemble.regionColor}50` }}>
                    {ensemble.organizer.avatar ? (
                      <img src={ensemble.organizer.avatar} alt={ensemble.organizer.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: ensemble.regionColor }}>
                        {ensemble.organizer.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: "#3C6B4F", opacity: 0.7 }}>{ensemble.organizer.role}</p>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>{ensemble.organizer.name}</h3>
                  <p className="text-sm leading-[1.9]" style={{ color: "#1A2B1E" }}>{ensemble.organizer.bio}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── ギャラリー ── */}
        {ensemble.gallery && ensemble.gallery.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <span className="inline-block text-xs font-medium px-4 mb-5" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}>
                フォトギャラリー
              </span>
              <h2 className="text-xl md:text-2xl font-bold mb-10" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                活動の様子
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ensemble.gallery.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl" style={{ height: "220px", backgroundColor: "rgba(0,95,2,0.06)" }}>
                    <img src={img} alt={`${ensemble.name} ギャラリー ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="py-16" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              {ensemble.name}に参加してみませんか？
            </h2>
            <p className="text-sm mb-8" style={{ color: "#1A2B1E" }}>体験参加・見学のお問い合わせはこちらから。</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <JoinButton ensembleName={ensemble.name} />
              <a href="/ensembles" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-medium border transition-all hover:opacity-70" style={{ borderColor: "rgba(0,95,2,0.2)", color: "#3C6B4F" }}>
                ← 一覧に戻る
              </a>
            </div>
          </div>
        </section>

        {/* ── 関連アンサンブル ── */}
        {related.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "rgba(0,95,2,0.03)" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <h2 className="text-xl md:text-2xl font-bold mb-10 text-center" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                他のアンサンブルを見る
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {related.map((r) => (
                  <a key={r.id} href={`/ensembles/${r.id}`} className="flex flex-col items-center text-center group">
                    <div className="rounded-full overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-[1.04]" style={{ width: "160px", height: "160px", boxShadow: `0 0 0 4px white, 0 0 0 6px ${r.regionColor}40`, backgroundColor: "#FFFFFF" }}>
                      <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="inline-block text-[11px] font-medium px-3 mb-2" style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: r.regionColor, color: "white" }}>
                      {r.region}
                    </span>
                    <h3 className="text-sm font-bold mb-1 transition-colors group-hover:text-[#3C6B4F]" style={{ color: "#3C6B4F" }}>{r.name}</h3>
                    <p className="text-xs" style={{ color: "#1A2B1E" }}>{r.sub}</p>
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
