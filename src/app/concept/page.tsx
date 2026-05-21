import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "食べられる森とは | 食べられる森アンサンブル倶楽部",
};

const FOREST_EXAMPLES = [
  { emoji: "🌊", title: "海の森", desc: "昆布を育てることは、海の森を育てること。漁師たちは魚や貝、海藻が共に生きる海の生態系そのものを耕しています。" },
  { emoji: "🏜️", title: "砂丘の森", desc: "一見なにもないように見える砂地にも、その土地ならではの食べられる植物と暮らしの知恵が根づいています。" },
  { emoji: "🏙️", title: "都市の森", desc: "屋上や路地、小さな庭。どんなに小さくても、都市のなかにも食べられる森はつくれます。" },
  { emoji: "🐄", title: "牧畜の森", desc: "家畜を育てることも、その土地の循環の一部。牧場の背景にも、食べていくための森があります。" },
];

export default function ConceptPage() {
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
              食べられる森とは
            </h1>

            <div className="space-y-5 text-base md:text-[15px] leading-[2]" style={{ color: "#1A2B1E" }}>
              <p>
                食べられる森とは、産業が生まれる以前から続く「食べていくための森」のことです。効率よく何かを大量生産する畑や養殖場とは違い、自然界の仕組みのなかで、人が暮らし、食べていける環境そのものを指します。
              </p>
              <p>
                たとえば昆布漁。海で昆布を一生懸命に育てている人は、昆布だけを見ているわけではありません。魚や貝、ほかの海藻が共に育つ海の生態系を整えている——つまり「海の森」を育てているのです。
              </p>
              <p>
                エビの養殖だけがうまくいけばいいと考え、まわりの海が死んでいくような営みは、食べられる森にはなりません。隣にあるものと一緒に豊かになっていく。それが、食べられる森の本来の姿です。
              </p>
              <p>
                私たちは、各地の暮らしをこの同じ切り口で捉え直しています。地域だけで完結させるのではなく、海の森も、砂丘の森も、都市の小さな庭も、同じ「食べられる森」として並べて発信していく。そうすることで、これまでとは違う旅の形、人やものの移動が生まれてくると考えています。
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mt-14 mb-8" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              さまざまな食べられる森
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FOREST_EXAMPLES.map((f) => (
                <div key={f.title} className="rounded-2xl p-6" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                  <div className="text-4xl mb-3">{f.emoji}</div>
                  <h3 className="text-base font-bold mb-2" style={{ color: "#3C6B4F" }}>{f.title}</h3>
                  <p className="text-base leading-[1.9]" style={{ color: "#1A2B1E" }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <a href="/#search" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#3C6B4F" }}>
                各地の食べられる森を見る →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
