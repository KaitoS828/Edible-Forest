import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getEnsemble, getEnsembles } from "@/lib/microcms";
import { JoinButton } from "./JoinButton";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EnsembleDetailPage({ params }: PageProps) {
  const { id } = await params;

  const ensemble = await getEnsemble(id).catch(() => null);
  if (!ensemble) notFound();

  const allEnsembles = await getEnsembles().catch(() => []);
  const related = allEnsembles.filter((e) => e.id !== id).slice(0, 3);
  const galleryUrls = ensemble.gallery?.map((g) => g.url) ?? [];

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">

        {/* ── Hero Image Grid ── */}
        <div className="w-full overflow-hidden" style={{ height: "520px", backgroundColor: "rgba(0,95,2,0.06)" }}>
          {galleryUrls.length >= 2 ? (
            <div className="h-full flex gap-1">
              <div className="flex-[3] overflow-hidden">
                <img src={ensemble.heroImage?.url ?? ""} alt={ensemble.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {galleryUrls.slice(0, 2).map((url, i) => (
                  <div key={i} className="flex-1 overflow-hidden">
                    <img src={url} alt={`${ensemble.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <img src={ensemble.heroImage?.url ?? ""} alt={ensemble.title} className="w-full h-full object-cover" />
          )}
        </div>

        {/* ── Breadcrumb + Title ── */}
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pt-8 pb-6">
          <nav className="text-sm mb-6" style={{ color: "#1A2B1E" }}>
            <a href="/" className="opacity-50 hover:opacity-80 transition-opacity">ホーム</a>
            <span className="mx-2 opacity-30">›</span>
            <a href="/ensembles" className="opacity-50 hover:opacity-80 transition-opacity">アンサンブル一覧</a>
            <span className="mx-2 opacity-30">›</span>
            <span className="opacity-80">{ensemble.title}</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-4">
            {ensemble.forestType && (
              <span
                className="inline-block text-sm font-medium px-3"
                style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: "#3C6B4F", color: "white" }}
              >
                {ensemble.forestType}
              </span>
            )}
            {ensemble.tags?.split(/[,、]/).map((tag, i) => (
              <span
                key={i}
                className="inline-block text-sm px-3"
                style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: "rgba(60,107,79,0.08)", color: "#3C6B4F" }}
              >
                {tag.trim()}
              </span>
            ))}
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
          >
            {ensemble.title}
          </h1>
          {ensemble.sub && (
            <p className="text-base flex items-center gap-1.5" style={{ color: "#1A2B1E", opacity: 0.6 }}>
              <span>📍</span>
              <span>{ensemble.sub}</span>
            </p>
          )}
        </div>

        {/* ── 2-Column Main Layout ── */}
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pb-24 lg:pb-16">
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">

            {/* ── Left: Main Content ── */}
            <div className="flex-1 min-w-0">

              {/* Philosophy */}
              {ensemble.philosophy && (
                <section className="mb-12 pt-6 border-t" style={{ borderColor: "rgba(0,95,2,0.1)" }}>
                  <div
                    className="prose prose-sm md:prose-base max-w-none"
                    style={{ color: "#1A2B1E" }}
                    dangerouslySetInnerHTML={{ __html: ensemble.philosophy }}
                  />
                </section>
              )}

              {/* 注意事項 + 旅行条件 */}
              {(ensemble.caution || ensemble.travelConditions) && (
                <section className="mb-12">
                  <div
                    className="rounded-2xl p-5"
                    style={{ backgroundColor: "rgba(255,200,0,0.05)", border: "1px solid rgba(200,150,0,0.2)" }}
                  >
                    {ensemble.caution && (
                      <>
                        <p className="text-base font-bold mb-3" style={{ color: "#1A2B1E" }}>注意事項</p>
                        <pre className="text-sm leading-[1.9] whitespace-pre-wrap font-sans mb-4" style={{ color: "#1A2B1E", opacity: 0.8 }}>
                          {ensemble.caution}
                        </pre>
                      </>
                    )}
                    {ensemble.travelConditions && (
                      <div className={ensemble.caution ? "pt-4 border-t" : ""} style={{ borderColor: "rgba(200,150,0,0.2)" }}>
                        <p className="text-base font-bold mb-3" style={{ color: "#1A2B1E" }}>旅行条件等</p>
                        <pre className="text-sm leading-[1.9] whitespace-pre-wrap font-sans" style={{ color: "#1A2B1E", opacity: 0.8 }}>
                          {ensemble.travelConditions}
                        </pre>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Activities */}
              {ensemble.activity && ensemble.activity.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                    体験できること
                  </h2>
                  <div className="flex flex-col gap-4">
                    {ensemble.activity.map((a, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-5 rounded-2xl"
                        style={{ backgroundColor: "rgba(0,95,2,0.03)", border: "1px solid rgba(0,95,2,0.09)" }}
                      >
                        {a.image?.[0] ? (
                          <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: "88px", height: "88px" }}>
                            <img src={a.image[0].url} alt={a.name ?? a.title ?? ""} className="w-full h-full object-cover" />
                          </div>
                        ) : a.icon ? (
                          <div className="flex-shrink-0 text-4xl leading-none pt-0.5">{a.icon}</div>
                        ) : null}
                        <div className="flex-1">
                          <h3 className="text-base font-bold mb-1.5" style={{ color: "#3C6B4F" }}>{a.name ?? a.title}</h3>
                          <p className="text-sm leading-relaxed" style={{ color: "#1A2B1E", opacity: 0.72 }}>{a.description ?? a.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Gallery */}
              {galleryUrls.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                    活動の様子
                  </h2>
                  {galleryUrls.length === 1 ? (
                    <div className="overflow-hidden rounded-2xl" style={{ height: "360px" }}>
                      <img src={galleryUrls[0]} alt={ensemble.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {galleryUrls.map((url, i) => (
                        <div
                          key={i}
                          className="overflow-hidden rounded-2xl"
                          style={{ height: i === 0 ? "300px" : "220px", gridColumn: i === 0 ? "1 / -1" : undefined }}
                        >
                          <img src={url} alt={`${ensemble.title} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* ── Right: Sticky Sidebar ── */}
            <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0">
              <div className="sticky top-24 flex flex-col gap-4">
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{ border: "1.5px solid rgba(0,95,2,0.15)", boxShadow: "0 4px 24px rgba(0,95,2,0.07)" }}
                >
                  <div className="px-6 py-4" style={{ backgroundColor: "#3C6B4F" }}>
                    <p className="text-white text-base font-semibold">{ensemble.title}</p>
                    <p className="text-white text-sm mt-0.5 opacity-75">体験参加・お問い合わせ</p>
                  </div>

                  <div className="px-6 pt-5 pb-2 bg-white">
                    {ensemble.stats?.map((s) => (
                      <div key={s.fieldId} className="flex gap-3 py-3 border-b" style={{ borderColor: "rgba(0,95,2,0.08)" }}>
                        <span className="text-sm w-20 flex-shrink-0 font-medium" style={{ color: "#1A2B1E", opacity: 0.5 }}>
                          {s.label}
                        </span>
                        <span className="text-sm font-bold" style={{ color: "#3C6B4F" }}>{s.value}</span>
                      </div>
                    ))}
                    {(!ensemble.stats || ensemble.stats.length === 0) && ensemble.sub && (
                      <div className="py-3 border-b" style={{ borderColor: "rgba(0,95,2,0.08)" }}>
                        <span className="text-sm font-medium" style={{ color: "#1A2B1E", opacity: 0.5 }}>開催地</span>
                        <span className="text-sm ml-3" style={{ color: "#1A2B1E" }}>{ensemble.sub}</span>
                      </div>
                    )}
                  </div>

                  {/* 集合場所マップ */}
                  {(() => {
                    const addr = ensemble.stats?.find((s) => s.label === "集合場所")?.value ?? ensemble.sub;
                    if (!addr) return null;
                    return (
                      <div className="overflow-hidden" style={{ height: "300px" }}>
                        <iframe
                          title="集合場所"
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          loading="lazy"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(addr)}&output=embed&hl=ja`}
                        />
                      </div>
                    );
                  })()}

                  <div className="px-6 pt-4 pb-6 bg-white flex flex-col gap-3">
                    <JoinButton ensembleName={ensemble.title} fullWidth />
                  </div>
                </div>

                <a
                  href="/ensembles"
                  className="flex items-center gap-1.5 text-sm px-2 transition-opacity hover:opacity-70"
                  style={{ color: "#3C6B4F" }}
                >
                  ← アンサンブル一覧に戻る
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 関連アンサンブル ── */}
        {related.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "rgba(0,95,2,0.03)" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                他のアンサンブルを見る
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {related.map((r) => (
                  <a key={r.id} href={`/ensembles/${r.id}`} className="flex flex-col items-center text-center group">
                    <div
                      className="rounded-full overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-[1.04]"
                      style={{ width: "160px", height: "160px", boxShadow: "0 0 0 4px white, 0 0 0 6px rgba(60,107,79,0.25)", backgroundColor: "#F0F6F2" }}
                    >
                      {r.heroImage ? (
                        <img src={r.heroImage.url} alt={r.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                      )}
                    </div>
                    <h3 className="text-base font-bold mb-1" style={{ color: "#3C6B4F" }}>{r.title}</h3>
                    {r.sub && <p className="text-sm" style={{ color: "#1A2B1E", opacity: 0.65 }}>{r.sub}</p>}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />

      {/* ── Sticky Mobile CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:hidden z-40 px-4 py-3"
        style={{ backgroundColor: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(0,95,2,0.12)" }}
      >
        <JoinButton ensembleName={ensemble.title} fullWidth />
      </div>
    </div>
  );
}
