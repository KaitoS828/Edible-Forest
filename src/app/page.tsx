"use client";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ENSEMBLES } from "@/data/ensembles";
import { JapanMap } from "@/components/JapanMap/JapanMap";
import type { RegionId } from "@/components/JapanMap/mapData";
import { RevealOnScroll } from "@/components/RevealOnScroll";

// ─────────────────────────────────────────
// Hero（J!NS風フルブリード）
// ─────────────────────────────────────────
const SLIDES = [
  {
    img: "/carousel/aa.png",
    label: "広尾の森",
    title: "十勝の大地で、食べられる植物を育てる。",
    link: "/ensembles/hiroo",
    linkLabel: "詳しくみる",
  },
  {
    img: "/carousel/img_02.jpg",
    label: "食べられる森アンサンブル倶楽部",
    title: "自然界の仕組みが、新しい生き方を教えてくれる。",
    link: "/concept",
    linkLabel: "詳しくみる",
  },
  {
    img: "/carousel/image6.png",
    label: "全国各地のLC",
    title: "食べる・育てる・つながる。生活生産の喜びを各地で。",
    link: "/#events",
    linkLabel: "拠点を見る",
  },
  {
    img: "/carousel/image4.png",
    label: "インターローカル",
    title: "地域と都市をつなぐ、暮らしの実験場。",
    link: "/join",
    linkLabel: "参加する",
  },
  {
    img: "/carousel/image5.png",
    label: "四万十の森",
    title: "清流と共にある暮らしを、四万十川の流域で。",
    link: "/ensembles/shimanto",
    linkLabel: "詳しくみる",
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(index); setFading(false); }, 300);
  }, []);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "min(88vh, 820px)", minHeight: "520px" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.02]"
        style={{
          backgroundImage: `url('${slide.img}')`,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      <p
        className="absolute top-6 left-6 lg:left-12 text-xs tracking-wider z-10"
        style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        TOP &gt;
      </p>

      <div className="absolute inset-0 flex items-end lg:items-center z-10">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 pb-16 lg:pb-0">
          <p
            className="text-[14px] font-medium mb-3 tracking-wide"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'Noto Sans JP', sans-serif",
              opacity: fading ? 0 : 1,
              transition: "opacity 0.4s var(--ease-out)",
            }}
          >
            {slide.label}
          </p>
          <h1
            className="font-bold text-white mb-6 max-w-[640px]"
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "clamp(2rem, 4.6vw, calc(3.5rem - 4px))",
              lineHeight: 1.45,
              letterSpacing: "0.04em",
              opacity: fading ? 0 : 1,
              transition: "opacity 0.45s var(--ease-out)",
            }}
          >
            {slide.title}
          </h1>
          <a
            href={slide.link}
            className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[14px] font-bold tracking-wide transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#1A2B1E",
              fontFamily: "'Noto Sans JP', sans-serif",
              minWidth: "160px",
            }}
          >
            {slide.linkLabel}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 lg:right-12 flex items-center gap-2.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`スライド ${i + 1}`}
            className="p-0 border-0 cursor-pointer transition-all duration-200"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: i === current ? "#3C6B4F" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// ニュースルーム風セクション
// ─────────────────────────────────────────
const NEWS_ITEMS = [
  {
    id: "r1",
    date: "2024.11",
    category: "活動レポート",
    title: "十勝の森で、はじめての庭づくりワークショップ",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    href: "/reports/r1",
  },
  {
    id: "r2",
    date: "2024.10",
    category: "活動レポート",
    title: "清流フィールドワーク ── 四万十川の生態系を歩く",
    img: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80",
    href: "/reports/r2",
  },
  {
    id: "r3",
    date: "2024.09",
    category: "活動レポート",
    title: "都市農園ネットワーク 収穫祭 2024",
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
    href: "/reports/r3",
  },
  {
    id: "n4",
    date: "2024.08",
    category: "お知らせ",
    title: "食べられる森アンサンブル倶楽部、会員募集を開始",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    href: "/join",
  },
];

function NewsroomSection() {
  return (
    <section className="bg-white py-14 md:py-20 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1A2B1E", letterSpacing: "0.02em" }}
          >
            活動レポート
          </h2>
          <a
            href="/reports"
            className="flex items-center justify-center w-10 h-10 rounded-full border transition-colors hover:bg-[#3C6B4F] hover:border-[#3C6B4F] group"
            style={{ borderColor: "rgba(0,0,0,0.15)" }}
            aria-label="活動レポート一覧へ"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:stroke-white transition-colors" stroke="#1A2B1E" strokeWidth="1.5">
              <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="news-scroll flex gap-5 md:gap-6 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0">
          {NEWS_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="news-card shrink-0 group block"
              style={{ width: "min(280px, 72vw)" }}
            >
              <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] bg-[#f0f0f0]">
                <img
                  src={item.img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="text-sm mb-2 tracking-wide" style={{ color: "#1A2B1E", opacity: 0.45, fontFamily: "'Noto Sans JP', sans-serif" }}>
                {item.date}　{item.category}
              </p>
              <p
                className="text-base font-bold leading-snug group-hover:text-[#3C6B4F] transition-colors"
                style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1A2B1E" }}
              >
                {item.title}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// About
// ─────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <div>
            <RevealOnScroll>
              <span className="inline-block text-sm font-medium px-3 mb-4" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
                コンセプト
              </span>
              <h2 className="text-3xl md:text-[28px] font-bold leading-snug mb-6" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                すべての拠点の背景に、<br />
                「食べられる森」があります。
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="text-base leading-[1.9] mb-4" style={{ color: "#1A2B1E" }}>
                海で昆布を育てることは「海の森」を育てること。砂丘も、都市の小さな庭も、見方を変えればすべて食べられる森になります。私たちは各地の暮らしを、この同じ切り口で捉え直し、発信しています。
              </p>
              <p className="text-base leading-[1.9] mb-6 px-4 py-3 rounded-xl" style={{ color: "#1A2B1E", backgroundColor: "#f8f8f8", border: "1px solid #e5e5e5", borderRadius: "12px" }}>
                ここで出会えるのは、ただの観光ではありません。各地の宿と、その背景にある食べられる森。まずは気になる地域から、覗いてみてください。
              </p>
              <a href="/concept" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#3C6B4F" }}>
                食べられる森について詳しく →
              </a>
            </RevealOnScroll>
          </div>
          <div className="flex flex-col gap-4">
            <RevealOnScroll from="right">
              <div className="rounded-2xl overflow-hidden" style={{ height: "220px", backgroundColor: "#3C6B4F" }}>
                <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80" alt="食べられる森" className="w-full h-full object-cover" />
              </div>
            </RevealOnScroll>
            <RevealOnScroll from="right" delay={150}>
              <div className="rounded-2xl overflow-hidden ml-8" style={{ height: "180px", backgroundColor: "#3C6B4F" }}>
                <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80" alt="自然の恵み" className="w-full h-full object-cover" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// 地図から検索
// ─────────────────────────────────────────
const REGION_ID_TO_LABEL: Record<RegionId, string> = {
  hokkaido: "北海道",
  tohoku:   "東北",
  kanto:    "関東",
  shinetsu: "信越・北陸",
  tokai:    "東海",
  kinki:    "近畿",
  chugoku:  "中国・四国",
  kyushu:   "九州・沖縄",
};

type SpotPreview = { id: string; name: string; sub: string; region: string; regionColor: string; forestType?: string; img: string; desc: string; price?: string; capacity?: string };

function SearchSection() {
  const [regionId, setRegionId]       = useState<RegionId | null>(null);
  const [activeType, setActiveType]   = useState<"all" | "ensemble" | "stay">("all");
  const [spots, setSpots]             = useState<SpotPreview[]>([]);

  useEffect(() => {
    fetch("/api/public/spots").then((r) => r.json()).then(setSpots).catch(() => {});
  }, []);

  const selected = regionId ? REGION_ID_TO_LABEL[regionId] : null;

  const matchEnsembles = selected
    ? ENSEMBLES.filter((e) => e.region === selected || e.region.startsWith(selected.split("・")[0]))
    : [];
  const matchSpots = selected
    ? spots.filter((s) => s.region === selected || s.region.startsWith(selected.split("・")[0]))
    : [];

  const showEnsembles = activeType === "all" || activeType === "ensemble";
  const showSpots     = activeType === "all" || activeType === "stay";

  return (
    <section id="search" className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <RevealOnScroll>
          <div className="mb-10">
            <span className="inline-block text-sm font-medium px-3 mb-3" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
              地域から探す
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              各地の食べられる森を探す
            </h2>
            <p className="text-base mt-2" style={{ color: "#1A2B1E", opacity: 0.45 }}>地図の地域をクリックすると、その地域のアンサンブルと宿泊拠点が右に表示されます</p>
          </div>
        </RevealOnScroll>

        {/* エリア選択 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.entries(REGION_ID_TO_LABEL) as [RegionId, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setRegionId(regionId === id ? null : id)}
              className="text-base px-4 py-2 rounded-full border transition-all duration-200"
              style={{
                backgroundColor: regionId === id ? "#3C6B4F" : "white",
                color:           regionId === id ? "white"   : "#1A2B1E",
                borderColor:     regionId === id ? "#3C6B4F" : "rgba(0,95,2,0.2)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 統計バッジ */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {[
            { label: "LC（ローカルコミュニティ）", value: ENSEMBLES.filter((e) => e.active).length },
            { label: "LS（ローカルステイ）", value: spots.length },
            { label: "活動地域", value: [...new Set(ENSEMBLES.filter((e) => e.active).map((e) => e.region))].length },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                {value}
              </span>
              <span className="text-sm" style={{ color: "#1A2B1E", opacity: 0.55 }}>{label}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* 地図 */}
          <div className="w-full max-w-[460px] mx-auto">
            <JapanMap value={regionId} onChange={setRegionId} />
          </div>

          {/* 種別トグル + 結果 */}
          <div>
            <div className="flex gap-2 mb-8">
              {([["all","すべて"],["ensemble","アンサンブル"],["stay","宿泊"]] as const).map(([v, lbl]) => (
                <button
                  key={v}
                  onClick={() => setActiveType(v)}
                  className="text-sm px-5 py-2 rounded-full border transition-all duration-200"
                  style={{
                    backgroundColor: activeType === v ? "#3C6B4F" : "white",
                    color:           activeType === v ? "white"   : "#1A2B1E",
                    borderColor:     activeType === v ? "#3C6B4F" : "#3C6B4F",
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {selected ? (
              <div style={{ animation: "fadeInUp 0.35s ease both" }}>
                <div className="flex items-center gap-3 mb-6">
                  <span style={{ backgroundColor: "#3C6B4F", color: "white", borderRadius: "20px", padding: "2px 14px", fontSize: "11px", fontWeight: 600 }}>{selected}</span>
                  <p className="text-base" style={{ color: "#3C6B4F" }}>の検索結果</p>
                </div>

                {showEnsembles && matchEnsembles.length > 0 && (
                  <div className="mb-10">
                    <p className="text-sm font-semibold mb-4 tracking-wider" style={{ color: "#1A2B1E" }}>ENSEMBLE</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {matchEnsembles.map((e) => (
                        <a key={e.id} href={`/ensembles/${e.id}`} className="group flex flex-col items-center text-center card-enter">
                          <div className="relative overflow-hidden rounded-full mb-3 transition-transform duration-500 group-hover:scale-[1.05]"
                            style={{ width: "100px", height: "100px", boxShadow: `0 0 0 3px white, 0 0 0 5px ${e.regionColor}40`, backgroundColor: "#f5f5f5" }}>
                            <img src={e.img} alt={e.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="inline-block text-xs font-medium px-3 mb-1.5"
                            style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: e.regionColor, color: "white" }}>
                            {e.region}
                          </span>
                          <p className="text-sm font-bold group-hover:text-[#3C6B4F] transition-colors" style={{ color: "#3C6B4F" }}>{e.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#1A2B1E" }}>{e.sub}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {showSpots && matchSpots.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-4 tracking-wider" style={{ color: "#1A2B1E" }}>LOCAL STAY</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {matchSpots.map((s) => (
                        <a key={s.id} href={`/spots/${s.id}`}
                          className="group block bg-white rounded-2xl overflow-hidden card-lift card-enter"
                          style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                          <div className="overflow-hidden" style={{ height: "140px", backgroundColor: "#f5f5f5" }}>
                            {s.img && <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
                          </div>
                          <div className="p-4">
                            <p className="text-xs mb-1" style={{ color: "#1A2B1E" }}>{s.region}</p>
                            <p className="text-base font-bold mb-1 group-hover:text-[#3C6B4F] transition-colors" style={{ color: "#3C6B4F" }}>{s.name}</p>
                            {s.price && <p className="text-sm" style={{ color: "#1A2B1E" }}>{s.price}</p>}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {showEnsembles && matchEnsembles.length === 0 && showSpots && matchSpots.length === 0 && (
                  <p className="text-base text-center py-8" style={{ color: "#1A2B1E" }}>
                    {selected} に該当する拠点・アンサンブルはまだ登録されていません
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[200px] rounded-2xl" style={{ border: "1px dashed rgba(0,95,2,0.2)" }}>
                <p className="text-center text-base px-6" style={{ color: "#1A2B1E", opacity: 0.4 }}>地図の地域をクリックしてください</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// アンサンブル（イベント）一覧
// ─────────────────────────────────────────
function EnsembleListSection() {
  const displayed = ENSEMBLES;

  return (
    <section id="events" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <span className="inline-block text-sm font-medium px-3 mb-3" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
                LC（ローカルコミュニティ）
              </span>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                各地の食べられる森
              </h2>
            </div>
            <p className="text-base max-w-[280px] md:text-right leading-[1.9]" style={{ color: "#1A2B1E" }}>
              全国各地のローカルコミュニティ（LC）をご紹介します。
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {displayed.map((e) => (
            <a key={e.id} href={`/ensembles/${e.id}`} className="group flex flex-col items-center text-center">
              <div className="relative overflow-hidden rounded-full mb-4 transition-transform duration-500 group-hover:scale-[1.04]" style={{ width: "180px", height: "180px", boxShadow: `0 0 0 4px white, 0 0 0 6px ${e.regionColor}40`, backgroundColor: "#FFFFFF" }}>
                <img src={e.img} alt={e.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="inline-block text-xs font-medium px-3" style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: e.regionColor, color: "white" }}>{e.region}</span>
                {e.forestType && <span className="inline-block text-xs font-medium px-3" style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: "rgba(26,43,30,0.82)", color: "white" }}>🌳 {e.forestType}</span>}
              </div>
              <h3 className="text-base font-bold mb-1 group-hover:text-[#3C6B4F] transition-colors" style={{ color: "#3C6B4F" }}>{e.name}</h3>
              <p className="text-sm" style={{ color: "#1A2B1E" }}>{e.sub}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a href="/ensembles" className="flex items-center gap-2 text-base font-medium px-8 py-3 rounded-full border-2 transition-colors hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F]" style={{ borderColor: "#3C6B4F", color: "#3C6B4F" }}>
            もっと見る →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// 宿泊（LS）
// ─────────────────────────────────────────
function SpotsListSection() {
  return (
    <section id="stays" className="py-16 md:py-24" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <RevealOnScroll>
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-medium px-3 mb-4" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
              LS（ローカルステイ）
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              全国各地の宿泊拠点
            </h2>
            <p className="text-base leading-[2] max-w-[500px] mx-auto" style={{ color: "#1A2B1E" }}>
              全国の食べられる森に共感した方が運営している宿をご紹介します。
            </p>
          </div>
          <div className="flex justify-center">
            <a
              href="/spots"
              className="flex items-center gap-2 text-base font-medium px-8 py-3.5 rounded-full transition-colors hover:opacity-80"
              style={{ backgroundColor: "#3C6B4F", color: "white" }}
            >
              宿泊拠点一覧を見る →
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// お問い合わせ
// ─────────────────────────────────────────
function ContactSection() {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: "rgba(0,95,2,0.03)" }}>
      <div className="max-w-[1000px] mx-auto px-5 lg:px-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
          一緒にやりませんか
        </h2>
        <p className="text-base mb-10" style={{ color: "#1A2B1E" }}>
          アンサンブル（イベント）を開きたい方、拠点を登録・活用してほしい方からのご相談をお待ちしています。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[640px] mx-auto text-left">
          <a href="/contact?type=ensemble" className="group block rounded-2xl p-6 bg-white transition-transform hover:-translate-y-1" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
            <div className="text-3xl mb-3">🎪</div>
            <h3 className="text-base font-bold mb-2" style={{ color: "#3C6B4F" }}>アンサンブルを主催したい</h3>
            <p className="text-sm leading-[1.8]" style={{ color: "#1A2B1E" }}>地域でイベントを開いてみたい方。企画のご相談から承ります。</p>
          </a>
          <a href="/contact?type=spot" className="group block rounded-2xl p-6 bg-white transition-transform hover:-translate-y-1" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
            <div className="text-3xl mb-3">🏡</div>
            <h3 className="text-base font-bold mb-2" style={{ color: "#3C6B4F" }}>拠点を登録・活用したい</h3>
            <p className="text-sm leading-[1.8]" style={{ color: "#1A2B1E" }}>宿や場所を拠点として登録したい・活用してほしい方はこちら。</p>
          </a>
        </div>
        <div className="mt-8">
          <a href="/contact" className="text-base font-medium underline transition-opacity hover:opacity-70" style={{ color: "#3C6B4F" }}>
            その他のお問い合わせはこちら →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px] page-enter">
        <HeroSection />
        <NewsroomSection />
        <AboutSection />
        <EnsembleListSection />
        <SpotsListSection />
        <SearchSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
