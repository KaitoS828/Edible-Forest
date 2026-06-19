import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteLocale } from "@/data/siteSettings";

export const metadata = {
  title: "食べられる森とは | アンサンブル倶楽部～食べられる森を目指して～",
};

export const revalidate = 60;

export default async function ConceptPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const locale: SiteLocale = lang === "en" ? "en" : "ja";
  const settings = await getSiteSettings(locale).catch(() => null);

  const conceptSettings = settings?.concept;
  const title = conceptSettings?.title || "食べられる森とは";
  const bodyHtml = conceptSettings?.body || "";

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">
        <section className="py-16 md:py-24">
          <div className="max-w-[760px] mx-auto px-5 lg:px-10">
            <span className="inline-block text-sm font-medium px-4 mb-5" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}>
              コンセプト
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              {title}
            </h1>

            <div
              className="space-y-5 text-base md:text-[15px] leading-[2] [&_p]:mb-5"
              style={{ color: "#1A2B1E" }}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            <h2 className="text-2xl md:text-3xl font-bold mt-14 mb-8" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              さまざまな食べられる森
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(conceptSettings?.examples ?? []).map((f) => (
                <div key={f.title} className="rounded-2xl p-6" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                  <div className="text-4xl mb-3">{f.emoji}</div>
                  <h3 className="text-base font-bold mb-2" style={{ color: "#3C6B4F" }}>{f.title}</h3>
                  <p className="text-base leading-[1.9]" style={{ color: "#1A2B1E" }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <a href={conceptSettings?.ctaHref ?? "/ensembles"} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#3C6B4F" }}>
                {conceptSettings?.ctaLabel ?? "各地の食べられる森を見る →"}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
