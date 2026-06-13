"use client";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JapanMap } from "@/components/JapanMap/JapanMap";
import type { RegionId } from "@/components/JapanMap/mapData";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export type SlideView = { img: string; label: string; title: string; link: string; linkLabel: string };
export type NewsView = { date: string; label: string; text: string; href: string };

// ─────────────────────────────────────────
// フォールバック（CMS 未設定／空のとき表示）
// ─────────────────────────────────────────
const SLIDES_DEFAULT: SlideView[] = [
  {
    img: "/carousel/aa.png",
    label: "広尾の森",
    title: "十勝の大地で、食べられる植物を育てる。",
    link: "/ensembles/hiroo",
    linkLabel: "詳しくみる",
  },
  {
    img: "/carousel/img_02.jpg",
    label: "アンサンブル倶楽部～食べられる森を目指して～",
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

const NEWS_DEFAULT: NewsView[] = [
  { date: "2025.11", label: "NEW!", text: "広尾の森 — 冬の庭づくりワークショップ開催", href: "/ensembles/hiroo" },
  { date: "2025.10", label: "NEW!", text: "四万十の森 — 新しい宿泊拠点が登録されました", href: "/ensembles/shimanto" },
  { date: "2025.09", label: "",     text: "都市農園ネットワーク 収穫祭 2024 レポート公開", href: "/reports/r3" },
  { date: "2025.08", label: "",     text: "アンサンブル倶楽部、会員募集を開始しました", href: "/join" },
];

const FOREST_TYPES = [
  { emoji: "🌊", label: "海の森",   href: "/spots?type=sea" },
  { emoji: "🌵", label: "砂丘の森", href: "/spots?type=dune" },
  { emoji: "🏙️", label: "都市の森", href: "/spots?type=urban" },
  { emoji: "🐄", label: "牧の森",   href: "/spots?type=farm" },
];

function HeroSection({ slides, news }: { slides: SlideView[]; news: NewsView[] }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(index); setFading(false); }, 300);
  }, []);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="w-full flex flex-col lg:flex-row" style={{ minHeight: "280px" }}>
      {/* 上(mobile)/左(desktop)：カルーセル */}
      <div className="relative overflow-hidden w-full lg:w-[70%]" style={{ height: "52vw", maxHeight: "52vh", minHeight: "220px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${slide.img}')`,
            opacity: fading ? 0 : 1,
            transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        <div className="absolute inset-0 flex items-end lg:items-center z-10">
          <div className="px-8 lg:px-12 pb-14 lg:pb-0">
            <p
              className="text-[13px] font-medium mb-3 tracking-wide"
              style={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Noto Sans JP', sans-serif",
                opacity: fading ? 0 : 1,
                transition: "opacity 0.4s ease-out",
              }}
            >
              {slide.label}
            </p>
            <h1
              className="font-bold text-white mb-6"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)",
                lineHeight: 1.45,
                letterSpacing: "0.01em",
                wordBreak: "keep-all",
                opacity: fading ? 0 : 1,
                transition: "opacity 0.45s ease-out",
              }}
            >
              {slide.title}
            </h1>
            <a
              href={slide.link}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FFFFFF", color: "#1A2B1E", fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {slide.linkLabel}
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 left-8 flex items-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`スライド ${i + 1}`}
              className="p-0 border-0 cursor-pointer transition-all duration-200"
              style={{
                width: i === current ? "24px" : "7px",
                height: "7px",
                borderRadius: "4px",
                backgroundColor: i === current ? "#FFFFFF" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>

      {/* 右：メッセージ＋更新履歴 30% */}
      <div
        className="flex flex-col justify-between px-6 py-6 w-full lg:w-[30%]"
        style={{ backgroundColor: "#F4F4F2", borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        {/* メッセージ */}
        <div>
          <p
            className="text-sm font-medium mb-2 tracking-wider"
            style={{ color: "#3C6B4F", fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            奪うのではなく、調和する
          </p>
          <p
            className="font-bold leading-snug mb-4"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "clamp(1.1rem, 1.9vw, 1.55rem)",
              color: "#1A2B1E",
              wordBreak: "keep-all",
            }}
          >
            「心地よい暮らし」<br />始めませんか？
          </p>
          <a
            href="/concept"
            className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#3C6B4F", fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            詳しく見る →
          </a>
        </div>

        {/* 更新履歴 */}
        <div>
          <p
            className="text-xs font-bold mb-3 tracking-widest uppercase"
            style={{ color: "rgba(26,43,30,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            更新履歴
          </p>
          <ul className="space-y-3">
            {news.slice(0, 2).map((item, i) => (
              <li key={i}>
                <a href={item.href} className="group flex flex-col gap-0.5 hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "rgba(26,43,30,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.date}</span>
                    {item.label && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#3C6B4F", color: "white" }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs leading-snug group-hover:text-[#3C6B4F] transition-colors"
                    style={{ color: "#1A2B1E", fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {item.text}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ForestTypesSection() {
  const [regionId, setRegionId] = useState<RegionId | null>(null);

  return (
    <section
      className="w-full"
      style={{ backgroundColor: "#FAFAF8", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 flex flex-col items-center gap-6">
        <p
          className="text-base font-medium text-center"
          style={{ color: "#1A2B1E", fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          ●旅に出よう「様々な食べられる森をさがしに」宿泊予約まで
        </p>

        <div className="w-full flex flex-col lg:flex-row items-center gap-6">
          {/* アイコン：モバイル2×2グリッド、デスクトップ均等横並び */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-6 lg:flex lg:flex-1 lg:justify-between lg:items-center">
            {FOREST_TYPES.map((f) => (
              <a
                key={f.href}
                href={f.href}
                className="flex flex-col items-center gap-3 group"
              >
                <div
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl transition-transform group-hover:scale-105"
                  style={{ backgroundColor: "rgba(60,107,79,0.08)" }}
                >
                  {f.emoji}
                </div>
                <span
                  className="text-sm lg:text-base font-medium"
                  style={{ color: "#1A2B1E", fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {f.label}
                </span>
              </a>
            ))}
          </div>

          {/* 矢印＋地図：デスクトップのみ */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
              <path d="M0 11h32M24 2l10 9-10 9" stroke="#1A2B1E" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ width: "130px", opacity: 0.75 }}>
              <JapanMap value={regionId} onChange={setRegionId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ENSEMBLE_CATEGORIES = [
  {
    sub: "農との協奏",
    label: "仕事に加わる協奏",
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80",
    href: "/join?type=farm",
  },
  {
    sub: "自然との協奏",
    label: "自然に働きかける協奏",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
    href: "/join?type=nature",
  },
  {
    sub: "複数の身体との協奏",
    label: "触れ合う・食べる協奏",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    href: "/join?type=gather",
  },
  {
    sub: "空間世界との協奏",
    label: "空間・環境を生かす協奏",
    img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80",
    href: "/join?type=space",
  },
];

function EnsembleSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <RevealOnScroll>
          <p
            className="text-base font-medium mb-10 text-center"
            style={{ color: "#1A2B1E", fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            ●「アンサンブル」イベントへの参加を選ぼう
          </p>
        </RevealOnScroll>

        {/* 4カテゴリカード */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-12">
          {ENSEMBLE_CATEGORIES.map((c, i) => (
            <RevealOnScroll key={c.href} delay={i * 80}>
              <a href={c.href} className="group flex flex-col">
                <div className="rounded-2xl overflow-hidden mb-3 aspect-square bg-[#f0f0f0]">
                  <img
                    src={c.img}
                    alt={c.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <p
                  className="text-xs mb-1"
                  style={{ color: "rgba(26,43,30,0.5)", fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {c.sub}
                </p>
                <p
                  className="text-sm font-bold group-hover:text-[#3C6B4F] transition-colors"
                  style={{ color: "#1A2B1E", fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {c.label}
                </p>
              </a>
            </RevealOnScroll>
          ))}
        </div>

        {/* 矢印＋アクションボックス */}
        <RevealOnScroll>
          <div className="flex justify-center mb-6">
            <svg width="260" height="36" viewBox="0 0 260 36" fill="none">
              <line x1="50"  y1="0" x2="50"  y2="28" stroke="#1A2B1E" strokeOpacity="0.25" strokeWidth="1.5"/>
              <line x1="130" y1="0" x2="130" y2="28" stroke="#1A2B1E" strokeOpacity="0.25" strokeWidth="1.5"/>
              <line x1="210" y1="0" x2="210" y2="28" stroke="#1A2B1E" strokeOpacity="0.25" strokeWidth="1.5"/>
              <polygon points="50,36 44,24 56,24"  fill="#1A2B1E" fillOpacity="0.25"/>
              <polygon points="130,36 124,24 136,24" fill="#1A2B1E" fillOpacity="0.25"/>
              <polygon points="210,36 204,24 216,24" fill="#1A2B1E" fillOpacity="0.25"/>
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[860px] mx-auto">
            {[
              {
                emoji: "🌿",
                title: "アンサンブルに参加",
                desc: "各地の食べられる森のイベントに参加してみましょう。まずは気になる地域から。",
                href: "/join",
              },
              {
                emoji: "🎪",
                title: "アンサンブルを主催したい",
                desc: "地域でイベントを開いてみたい方。企画のご相談から承ります。",
                href: "/contact?type=ensemble",
              },
              {
                emoji: "🏡",
                title: "拠点を登録・活用したい",
                desc: "宿や場所を拠点として登録したい・活用してほしい方はこちら。",
                href: "/contact?type=spot",
              },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group block rounded-2xl p-6"
                style={{ border: "1.5px solid rgba(0,0,0,0.1)", backgroundColor: "#FFFFFF" }}
              >
                <div className="text-3xl mb-4">{item.emoji}</div>
                <p
                  className="text-base font-bold mb-2 group-hover:text-[#3C6B4F] transition-colors"
                  style={{ color: "#1A2B1E", fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(26,43,30,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {item.desc}
                </p>
              </a>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default function HomeClient({
  slides,
  news,
}: {
  slides?: SlideView[];
  news?: NewsView[];
}) {
  const heroSlides = slides && slides.length > 0 ? slides : SLIDES_DEFAULT;
  const heroNews = news && news.length > 0 ? news : NEWS_DEFAULT;

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">
        <HeroSection slides={heroSlides} news={heroNews} />
        <ForestTypesSection />
        <EnsembleSection />
      </main>
      <Footer />
    </div>
  );
}
