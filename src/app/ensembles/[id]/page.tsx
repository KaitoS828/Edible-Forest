import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getEnsembleDoc, getPublishedEnsembles, type EnsembleDoc } from "@/lib/firestore";
import { getEnsemble, ENSEMBLES, type Ensemble } from "@/data/ensembles";
import { JoinButton } from "./JoinButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EnsembleDetailPage({ params }: PageProps) {
  const { id } = await params;

  let ensemble: Ensemble | EnsembleDoc | undefined = getEnsemble(id);
  let related: (Ensemble | EnsembleDoc)[] = [];

  if (ensemble) {
    related = ENSEMBLES.filter((e) => e.id !== id && e.active).slice(0, 3);
  } else {
    try {
      const doc = await getEnsembleDoc(id);
      if (doc && (doc.active || doc.status === "published")) {
        ensemble = doc;
        const all = await getPublishedEnsembles();
        related = all.filter((e) => e.id !== id).slice(0, 3);
      }
    } catch {
      // Firestore 未設定時は静的データのみで動作
    }
  }

  if (!ensemble) notFound();

  const galleryImages = ensemble.gallery ?? [];

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">

        {/* ── Hero Image Grid ── */}
        <div className="w-full overflow-hidden" style={{ height: "520px", backgroundColor: "rgba(0,95,2,0.06)" }}>
          {galleryImages.length >= 2 ? (
            <div className="h-full flex gap-1">
              <div className="flex-[3] overflow-hidden">
                <img src={ensemble.img} alt={ensemble.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {galleryImages.slice(0, 2).map((img, i) => (
                  <div key={i} className="flex-1 overflow-hidden">
                    <img src={img} alt={`${ensemble.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <img src={ensemble.img} alt={ensemble.name} className="w-full h-full object-cover" />
          )}
        </div>

        {/* ── Breadcrumb + Title ── */}
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pt-8 pb-6">
          <nav className="text-xs mb-6" style={{ color: "#1A2B1E" }}>
            <a href="/" className="opacity-50 hover:opacity-80 transition-opacity">ホーム</a>
            <span className="mx-2 opacity-30">›</span>
            <a href="/#activities" className="opacity-50 hover:opacity-80 transition-opacity">各地の食べられる森</a>
            <span className="mx-2 opacity-30">›</span>
            <span className="opacity-80">{ensemble.name}</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="inline-block text-xs font-medium px-3"
              style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: ensemble.regionColor, color: "white" }}
            >
              {ensemble.region}
            </span>
            {ensemble.forestType && (
              <span
                className="inline-block text-xs font-medium px-3"
                style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: "rgba(0,95,2,0.08)", color: "#3C6B4F" }}
              >
                {ensemble.forestType}
              </span>
            )}
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
          >
            {ensemble.name}
          </h1>
          <p className="text-sm flex items-center gap-1.5" style={{ color: "#1A2B1E", opacity: 0.6 }}>
            <span>📍</span>
            <span>{ensemble.sub}</span>
          </p>
        </div>

        {/* ── 2-Column Main Layout ── */}
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pb-24 lg:pb-16">
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">

            {/* ── Left: Main Content ── */}
            <div className="flex-1 min-w-0">

              {/* Philosophy / Program Content + 注意事項 + 旅行条件等 */}
              {(ensemble.philosophy || (ensemble.notes && ensemble.notes.length > 0) || ensemble.travelConditions) && (
                <section className="mb-12 pt-6 border-t" style={{ borderColor: "rgba(0,95,2,0.1)" }}>
                  {ensemble.philosophy && (
                    <div
                      className="prose prose-sm md:prose-base max-w-none"
                      style={{ color: "#1A2B1E" }}
                      dangerouslySetInnerHTML={{ __html: ensemble.philosophy }}
                    />
                  )}
                  {ensemble.notes && ensemble.notes.length > 0 && (
                    <div
                      className="mt-6 rounded-2xl p-5"
                      style={{ backgroundColor: "rgba(255,200,0,0.05)", border: "1px solid rgba(200,150,0,0.2)" }}
                    >
                      <p className="text-sm font-bold mb-3" style={{ color: "#1A2B1E" }}>注意事項</p>
                      <ul className="flex flex-col gap-2.5">
                        {ensemble.notes.map((note, i) => (
                          <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{ color: "#1A2B1E" }}>
                            <span className="flex-shrink-0" style={{ color: "#B8860B" }}>・</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                      {ensemble.travelConditions && (
                        <div className="mt-5 pt-5 border-t" style={{ borderColor: "rgba(200,150,0,0.2)" }}>
                          <p className="text-sm font-bold mb-3" style={{ color: "#1A2B1E" }}>旅行条件等</p>
                          <pre
                            className="text-xs leading-[1.9] whitespace-pre-wrap font-sans"
                            style={{ color: "#1A2B1E", opacity: 0.8 }}
                          >
                            {ensemble.travelConditions}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                  {!ensemble.notes?.length && ensemble.travelConditions && (
                    <div
                      className="mt-6 rounded-2xl p-5"
                      style={{ backgroundColor: "rgba(255,200,0,0.05)", border: "1px solid rgba(200,150,0,0.2)" }}
                    >
                      <p className="text-sm font-bold mb-3" style={{ color: "#1A2B1E" }}>旅行条件等</p>
                      <pre
                        className="text-xs leading-[1.9] whitespace-pre-wrap font-sans"
                        style={{ color: "#1A2B1E", opacity: 0.8 }}
                      >
                        {ensemble.travelConditions}
                      </pre>
                    </div>
                  )}
                </section>
              )}

              {/* Activities */}
              {ensemble.activities && ensemble.activities.length > 0 && (
                <section className="mb-12">
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
                  >
                    体験できること
                  </h2>
                  <div className="flex flex-col gap-4">
                    {ensemble.activities.map((a, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-5 rounded-2xl"
                        style={{ backgroundColor: "rgba(0,95,2,0.03)", border: "1px solid rgba(0,95,2,0.09)" }}
                      >
                        {a.img ? (
                          <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: "88px", height: "88px" }}>
                            <img src={a.img} alt={a.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 text-3xl leading-none pt-0.5">{a.icon}</div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-sm font-bold mb-1.5" style={{ color: "#3C6B4F" }}>{a.title}</h3>
                          <p className="text-xs leading-relaxed" style={{ color: "#1A2B1E", opacity: 0.72 }}>{a.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Organizer */}
              {ensemble.organizer && (
                <section
                  className="mb-12 p-6 rounded-3xl"
                  style={{ backgroundColor: "rgba(0,95,2,0.03)", border: "1px solid rgba(0,95,2,0.08)" }}
                >
                  <p className="text-xs font-bold mb-5 tracking-wide uppercase" style={{ color: "#3C6B4F", opacity: 0.6 }}>
                    Organizer
                  </p>
                  <div className="flex gap-5 items-start">
                    <div
                      className="flex-shrink-0 rounded-full overflow-hidden"
                      style={{ width: "72px", height: "72px", boxShadow: `0 0 0 3px white, 0 0 0 5px ${ensemble.regionColor}35` }}
                    >
                      {ensemble.organizer.avatar ? (
                        <img src={ensemble.organizer.avatar} alt={ensemble.organizer.name} className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                          style={{ backgroundColor: ensemble.regionColor }}
                        >
                          {ensemble.organizer.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs mb-1" style={{ color: "#3C6B4F", opacity: 0.65 }}>{ensemble.organizer.role}</p>
                      <h3
                        className="text-base font-bold mb-2"
                        style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
                      >
                        {ensemble.organizer.name}
                      </h3>
                      <p className="text-xs leading-[1.9]" style={{ color: "#1A2B1E" }}>{ensemble.organizer.bio}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* ── Gallery（大きく表示） ── */}
              {galleryImages.length > 0 && (
                <section className="mb-12">
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
                  >
                    活動の様子
                  </h2>
                  {galleryImages.length === 1 ? (
                    <div className="overflow-hidden rounded-2xl" style={{ height: "360px" }}>
                      <img src={galleryImages[0]} alt={`${ensemble.name} ギャラリー`} className="w-full h-full object-cover" />
                    </div>
                  ) : galleryImages.length === 2 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="overflow-hidden rounded-2xl" style={{ height: "300px" }}>
                          <img src={img} alt={`${ensemble.name} ギャラリー ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {galleryImages.map((img, i) => (
                        <div
                          key={i}
                          className="overflow-hidden rounded-2xl"
                          style={{ height: i === 0 ? "300px" : "220px", gridColumn: i === 0 ? "1 / -1" : undefined, backgroundColor: "rgba(0,95,2,0.05)" }}
                        >
                          <img
                            src={img}
                            alt={`${ensemble.name} ギャラリー ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
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

                {/* Info + CTA card */}
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{ border: "1.5px solid rgba(0,95,2,0.15)", boxShadow: "0 4px 24px rgba(0,95,2,0.07)" }}
                >
                  <div className="px-6 py-4" style={{ backgroundColor: "#3C6B4F" }}>
                    <p className="text-white text-sm font-semibold">{ensemble.name}</p>
                    <p className="text-white text-xs mt-0.5 opacity-75">体験参加・お問い合わせ</p>
                  </div>

                  <div className="px-6 pt-5 pb-2 bg-white">
                    {ensemble.stats?.map((s) => (
                      <div
                        key={s.label}
                        className="flex gap-3 py-3 border-b"
                        style={{ borderColor: "rgba(0,95,2,0.08)" }}
                      >
                        <span className="text-xs w-20 flex-shrink-0 font-medium" style={{ color: "#1A2B1E", opacity: 0.5 }}>
                          {s.label}
                        </span>
                        <span className="text-xs font-bold" style={{ color: "#3C6B4F" }}>{s.value}</span>
                      </div>
                    ))}
                    {(!ensemble.stats || ensemble.stats.length === 0) && (
                      <div className="py-3 border-b" style={{ borderColor: "rgba(0,95,2,0.08)" }}>
                        <span className="text-xs w-20 flex-shrink-0 font-medium" style={{ color: "#1A2B1E", opacity: 0.5 }}>
                          開催地
                        </span>
                        <span className="text-xs" style={{ color: "#1A2B1E" }}>{ensemble.sub}</span>
                      </div>
                    )}
                  </div>

                  {/* 集合場所マップ */}
                  {ensemble.stats?.some((s) => s.label === "集合場所" && s.value) && (() => {
                    const addr = ensemble.stats!.find((s) => s.label === "集合場所")!.value;
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
                    <JoinButton ensembleName={ensemble.name} fullWidth />
                  </div>
                </div>

                <a
                  href="/#activities"
                  className="flex items-center gap-1.5 text-xs px-2 transition-opacity hover:opacity-70"
                  style={{ color: "#3C6B4F" }}
                >
                  ← 各地の食べられる森に戻る
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 関連アンサンブル ── */}
        {related.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "rgba(0,95,2,0.03)" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              <h2
                className="text-xl md:text-2xl font-bold mb-10 text-center"
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
              >
                他の食べられる森を見る
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
                      style={{ width: "160px", height: "160px", boxShadow: `0 0 0 4px white, 0 0 0 6px ${r.regionColor}35`, backgroundColor: "#FFFFFF" }}
                    >
                      <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                    </div>
                    <span
                      className="inline-block text-[11px] font-medium px-3 mb-2"
                      style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: r.regionColor, color: "white" }}
                    >
                      {r.region}
                    </span>
                    <h3 className="text-sm font-bold mb-1" style={{ color: "#3C6B4F" }}>{r.name}</h3>
                    <p className="text-xs" style={{ color: "#1A2B1E", opacity: 0.65 }}>{r.sub}</p>
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
        <JoinButton ensembleName={ensemble.name} fullWidth />
      </div>
    </div>
  );
}
