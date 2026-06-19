import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// 規約・ポリシー系の固定ページ共通レイアウト（タイトル＋本文HTML）。
export function StaticDocPage({ title, bodyHtml }: { title: string; bodyHtml: string }) {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">
        <section className="py-16 md:py-24">
          <div className="max-w-[760px] mx-auto px-5 lg:px-10">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-10" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              {title}
            </h1>
            <div
              className="text-base leading-[2] [&_p]:mb-5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-1.5"
              style={{ color: "#1A2B1E" }}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
