"use client";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { ENSEMBLES } from "@/data/ensembles";
import { JapanMap } from "@/components/JapanMap/JapanMap";
import type { RegionId } from "@/components/JapanMap/mapData";
import { RevealOnScroll } from "@/components/RevealOnScroll";

// ─────────────────────────────────────────
// Hero
// ─────────────────────────────────────────
const SLIDES = [
  { img: "/carousel/aa.png",      caption: "北海道十勝の広大な森で、食べられる植物を育てています。" },
  { img: "/carousel/img_02.jpg",  caption: "自然界の仕組みが、私たちに新しい生き方を教えてくれます。" },
  { img: "/carousel/image6.png",  caption: "食べる・育てる・つながる。生活生産の喜びを各地で。" },
  { img: "/carousel/image4.png",  caption: "地域と都市をつなぐ、インターローカルなコミュニティ。" },
  { img: "/carousel/image5.png",  caption: "高知四万十川の流域で、川と共にある暮らしを実践中。" },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(index); setFading(false); }, 400);
  }, []);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full flex flex-col md:flex-row" style={{ height: "100svh", minHeight: "600px" }}>

      {/* 左：画像エリア */}
      <div className="relative flex-1 md:w-[60%] h-[50%] md:h-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${SLIDES[current].img}')`,
            opacity: fading ? 0 : 1,
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div className="absolute bottom-5 left-5 flex items-center gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`スライド ${i + 1}`}
              style={{
                width: i === current ? "24px" : "7px",
                height: "7px",
                borderRadius: "4px",
                backgroundColor: i === current ? "white" : "rgba(255,255,255,0.45)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* 右：コンテンツパネル */}
      <div
        className="flex flex-col justify-center px-8 md:px-12 py-10 md:py-0 md:w-[40%]"
        style={{ backgroundColor: "#F7FAF7" }}
      >
        <p className="hero-label text-[11px] font-medium mb-5 uppercase" style={{ color: "#3C6B4F", letterSpacing: "0.18em" }}>
          Edible Forest Ensemble Club
        </p>

        <h1
          className="hero-title font-bold mb-2"
          style={{ fontFamily: "'Noto Serif JP', serif", color: "#1A2B1E", fontSize: "clamp(1.5rem, 2.8vw, 2.4rem)", lineHeight: 1.5 }}
        >
          自然界の仕組みで、<br />新しい生き方を。
        </h1>

        <p
          className="hero-caption text-sm mb-8"
          style={{ color: "#1A2B1E", opacity: fading ? 0 : 0.55, transition: `opacity 0.5s var(--ease-out)`, lineHeight: 1.9 }}
        >
          {SLIDES[current].caption}
        </p>

        <div className="hero-divider mb-8" style={{ width: "40px", height: "1px", backgroundColor: "#3C6B4F", opacity: 0.4 }} />

        <div className="hero-cta flex flex-col gap-3 max-w-[240px]">
          <a href="/join" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-white" style={{ backgroundColor: "#3C6B4F" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            倶楽部に参加する
          </a>
          <a href="/#events" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium"
            style={{ border: "1.5px solid rgba(60,107,79,0.4)", color: "#3C6B4F", backgroundColor: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#3C6B4F"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#3C6B4F"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#3C6B4F"; e.currentTarget.style.borderColor = "rgba(60,107,79,0.4)"; }}>
            イベントを見る
          </a>
          <a href="/#stays" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium"
            style={{ border: "1.5px solid rgba(60,107,79,0.4)", color: "#3C6B4F", backgroundColor: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#3C6B4F"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#3C6B4F"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#3C6B4F"; e.currentTarget.style.borderColor = "rgba(60,107,79,0.4)"; }}>
            宿泊する
          </a>
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
              <div className="text-6xl leading-none mb-3 select-none" style={{ color: "#1A2B1E", fontFamily: "serif" }}>"</div>
              <h2 className="text-2xl md:text-[28px] font-bold leading-snug mb-6" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                産業社会の「自分のため」から、<br />
                自然界の「隣に役立つ」へ。<br />
                食べられる森アンサンブル倶楽部
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="text-sm leading-[1.9] mb-4" style={{ color: "#1A2B1E" }}>
                「自然界からの学び」を、人の経済活動やコミュニティのありかたに還元していこうとするメンバー達が、各拠点やイベントを運営しています。
              </p>
              <p className="text-sm leading-[1.9] mb-4" style={{ color: "#1A2B1E" }}>
                地方と都市の両方で「ローカルコミュニティ（LC）」を展開し、インターローカルな暮らしの実験場として、各地をつなぎます。
              </p>
              <p className="text-sm leading-[1.9] mb-6 px-4 py-3 rounded-xl" style={{ color: "#1A2B1E", backgroundColor: "#f8f8f8", border: "1px solid #e5e5e5", borderRadius: "12px" }}>
                一部、会員限定の施設やイベントがあります。まずは、楽しむことから始めてください。どんな拠点やイベントがあるかは、このサイトをご覧ください。
              </p>
              <a href="/join" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#3C6B4F" }}>
                倶楽部の会員になる →
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

type SpotPreview = { id: string; name: string; sub: string; region: string; regionColor: string; img: string; desc: string; price?: string; capacity?: string };

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
            <span className="inline-block text-xs font-medium px-3 mb-3" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
              地域から探す
            </span>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              拠点・アンサンブルを検索する
            </h2>
            <p className="text-sm mt-2" style={{ color: "#1A2B1E", opacity: 0.45 }}>地図の地域をクリックすると、その地域のアンサンブルと宿泊拠点が下に表示されます</p>
          </div>
        </RevealOnScroll>

        {/* 統計バッジ */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {[
            { label: "LC（ローカルコミュニティ）", value: ENSEMBLES.filter((e) => e.active).length },
            { label: "LS（ローカルステイ）", value: spots.length },
            { label: "活動地域", value: [...new Set(ENSEMBLES.filter((e) => e.active).map((e) => e.region))].length },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                {value}
              </span>
              <span className="text-xs" style={{ color: "#1A2B1E", opacity: 0.55 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 日本地図 */}
        <div className="w-full mb-8">
          <JapanMap value={regionId} onChange={setRegionId} />
        </div>

        {/* 種別トグル */}
        <div className="flex gap-2 mb-10 justify-center">
          {([["all","すべて"],["ensemble","アンサンブル"],["stay","宿泊"]] as const).map(([v, lbl]) => (
            <button
              key={v}
              onClick={() => setActiveType(v)}
              className="text-xs px-5 py-2 rounded-full border transition-all duration-200"
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

        {/* 結果エリア */}
        {selected ? (
          <div style={{ animation: "fadeInUp 0.35s ease both" }}>
            <div className="flex items-center gap-3 mb-8">
              <span style={{ backgroundColor: "#3C6B4F", color: "white", borderRadius: "20px", padding: "2px 14px", fontSize: "11px", fontWeight: 600 }}>{selected}</span>
              <p className="text-sm" style={{ color: "#3C6B4F" }}>の検索結果</p>
            </div>

            {showEnsembles && matchEnsembles.length > 0 && (
              <div className="mb-10">
                <p className="text-xs font-semibold mb-4 tracking-wider" style={{ color: "#1A2B1E" }}>ENSEMBLE</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                  {matchEnsembles.map((e) => (
                    <a key={e.id} href={`/ensembles/${e.id}`} className="group flex flex-col items-center text-center card-enter">
                      <div className="relative overflow-hidden rounded-full mb-3 transition-transform duration-500 group-hover:scale-[1.05]"
                        style={{ width: "120px", height: "120px", boxShadow: `0 0 0 3px white, 0 0 0 5px ${e.regionColor}40`, backgroundColor: "#f5f5f5" }}>
                        <img src={e.img} alt={e.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="inline-block text-[11px] font-medium px-3 mb-1.5"
                        style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: e.regionColor, color: "white" }}>
                        {e.region}
                      </span>
                      <p className="text-xs font-bold group-hover:text-[#3C6B4F] transition-colors" style={{ color: "#3C6B4F" }}>{e.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#1A2B1E" }}>{e.sub}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {showSpots && matchSpots.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-4 tracking-wider" style={{ color: "#1A2B1E" }}>LOCAL STAY</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {matchSpots.map((s) => (
                    <a key={s.id} href={`/spots/${s.id}`}
                      className="group block bg-white rounded-2xl overflow-hidden card-lift card-enter"
                      style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                      <div className="overflow-hidden" style={{ height: "140px", backgroundColor: "#f5f5f5" }}>
                        {s.img && <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] mb-1" style={{ color: "#1A2B1E" }}>{s.region}</p>
                        <p className="text-sm font-bold mb-1 group-hover:text-[#3C6B4F] transition-colors" style={{ color: "#3C6B4F" }}>{s.name}</p>
                        {s.price && <p className="text-xs" style={{ color: "#1A2B1E" }}>{s.price}</p>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {showEnsembles && matchEnsembles.length === 0 && showSpots && matchSpots.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: "#1A2B1E" }}>
                {selected} に該当する拠点・アンサンブルはまだ登録されていません
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-sm py-4" style={{ color: "#1A2B1E", opacity: 0.35 }}>地図の地域をクリックしてください</p>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// アンサンブル（イベント）一覧
// ─────────────────────────────────────────
function EnsembleListSection() {
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;
  const displayed  = isLoggedIn ? ENSEMBLES : ENSEMBLES.slice(0, 4);
  const sectionLabel = isLoggedIn ? "アンサンブル一覧" : "アンサンブル例";

  return (
    <section id="events" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <span className="inline-block text-xs font-medium px-3 mb-3" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
                LC（ローカルコミュニティ）
              </span>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                {sectionLabel}
              </h2>
              {!isLoggedIn && (
                <p className="text-xs mt-2" style={{ color: "#1A2B1E" }}>
                  ※ ログインすると全てのアンサンブルをご覧いただけます
                </p>
              )}
            </div>
            <p className="text-sm max-w-[280px] md:text-right leading-[1.9]" style={{ color: "#1A2B1E" }}>
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
              <span className="inline-block text-[11px] font-medium px-3 mb-2" style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: e.regionColor, color: "white" }}>{e.region}</span>
              <h3 className="text-sm font-bold mb-1 group-hover:text-[#3C6B4F] transition-colors" style={{ color: "#3C6B4F" }}>{e.name}</h3>
              <p className="text-xs" style={{ color: "#1A2B1E" }}>{e.sub}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a href="/ensembles" className="flex items-center gap-2 text-sm font-medium px-8 py-3 rounded-full border-2 transition-colors hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F]" style={{ borderColor: "#3C6B4F", color: "#3C6B4F" }}>
            もっと見る →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// 宿泊（LS）一覧
// ─────────────────────────────────────────
function SpotsListSection() {
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;
  const [spots, setSpots] = useState<SpotPreview[]>([]);

  useEffect(() => {
    fetch("/api/public/spots").then((r) => r.json()).then(setSpots).catch(() => {});
  }, []);

  const displayed = isLoggedIn ? spots : spots.slice(0, 3);

  return (
    <section id="stays" className="py-16 md:py-24" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <span className="inline-block text-xs font-medium px-3 mb-3" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
                LS（ローカルステイ）
              </span>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                全国各地の宿泊拠点
              </h2>
              {!isLoggedIn && spots.length > 3 && (
                <p className="text-xs mt-2" style={{ color: "#1A2B1E" }}>
                  ※ ログインすると全ての拠点をご覧いただけます
                </p>
              )}
            </div>
            <p className="text-sm max-w-[280px] md:text-right leading-[1.9]" style={{ color: "#1A2B1E" }}>
              全国各地のローカルステイ（LS）をご紹介します。
            </p>
          </div>
        </RevealOnScroll>

        {displayed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl">
            <p className="text-sm" style={{ color: "#1A2B1E" }}>現在、公開中の拠点はありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {displayed.map((s) => (
              <a key={s.id} href={`/spots/${s.id}`} className="group block bg-white rounded-3xl overflow-hidden card-lift" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,95,2,0.15)" }}>
                <div className="relative overflow-hidden" style={{ height: "180px", backgroundColor: "#FFFFFF" }}>
                  {s.img
                    ? <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    : <div className="w-full h-full" style={{ backgroundColor: "#FFFFFF" }} />
                  }
                  <span className="absolute top-3 left-3 text-[11px] font-medium px-3" style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: s.regionColor || "#3C6B4F", color: "white" }}>{s.region}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold mb-1 group-hover:text-[#3C6B4F] transition-colors" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>{s.name}</h3>
                  <p className="text-xs mb-2" style={{ color: "#1A2B1E" }}>{s.sub}</p>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#1A2B1E" }}>{s.desc}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <a href="/#stays" className="flex items-center gap-2 text-sm font-medium px-8 py-3 rounded-full border-2 transition-colors hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F]" style={{ borderColor: "#3C6B4F", color: "#1A2B1E" }}>
            もっと見る →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// 活動レポート（タブ）
// ─────────────────────────────────────────
const REPORTS = [
  {
    id: "r1",
    date: "2024年11月",
    ensemble: "広尾町アンサンブル",
    title: "十勝の森で、はじめての庭づくりワークショップ",
    summary: "食べられる植物の苗植えと土づくりを体験。10名が参加し、それぞれ小さな食べられる庭をデザインしました。土に触れ、植物の名前を覚え、収穫の楽しみを知る——参加者全員が「また来たい」と語った一日になりました。",
    region: "北海道",
  },
  {
    id: "r2",
    date: "2024年10月",
    ensemble: "四万十アンサンブル",
    title: "清流フィールドワーク ── 四万十川の生態系を歩く",
    summary: "地元ガイドと一緒に四万十川沿いを歩き、川魚・水生昆虫・河岸植物を観察。参加者から「自然の豊かさを肌で感じた」と好評でした。川と森が繋がる生態系の仕組みを、五感でたどる6時間のフィールドワーク。",
    region: "中国・四国",
  },
  {
    id: "r3",
    date: "2024年9月",
    ensemble: "武蔵野アンサンブル",
    title: "都市農園ネットワーク 収穫祭 2024",
    summary: "武蔵野・国分寺エリアの都市農園12箇所が参加した初めての合同収穫祭。地域の人々が一堂に集い、採れたて野菜で料理を楽しみました。都市の中に「生活生産」の喜びが確かに存在することを証明した一日。",
    region: "関東",
  },
];

function ReportsSection() {
  const [active, setActive] = useState(0);
  const r = REPORTS[active];

  return (
    <section className="py-14" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[900px] mx-auto px-5 lg:px-10">
        <RevealOnScroll>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block text-xs font-medium px-3 mb-3" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}>
                活動レポート
              </span>
              <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                各地の活動記録
              </h2>
            </div>
          </div>
        </RevealOnScroll>

        {/* タブ */}
        <div className="flex border-b mb-8" style={{ borderColor: "#e5e5e5" }}>
          {REPORTS.map((report, i) => (
            <button
              key={report.id}
              onClick={() => setActive(i)}
              className="px-5 py-3 text-sm transition-all duration-200 whitespace-nowrap"
              style={{
                color:        active === i ? "#3C6B4F" : "#1A2B1E",
                fontWeight:   active === i ? 700 : 400,
                borderBottom: active === i ? "2px solid #3C6B4F" : "2px solid transparent",
                marginBottom: "-1px",
                opacity:      active === i ? 1 : 0.5,
              }}
            >
              {report.ensemble}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        <div key={r.id} style={{ animation: "fadeInUp 0.3s ease both" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#3C6B4F", color: "white" }}>{r.region}</span>
            <span className="text-xs" style={{ color: "#1A2B1E", opacity: 0.45 }}>{r.date}</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-4 leading-snug" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
            {r.title}
          </h3>
          <p className="text-sm leading-[1.9]" style={{ color: "#1A2B1E" }}>{r.summary}</p>
          <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: "#e5e5e5" }}>
            <span className="text-xs font-medium" style={{ color: "#1A2B1E" }}>{r.ensemble}</span>
            <a href={`/reports/${r.id}`} className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: "#3C6B4F" }}>
              全文を読む →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// お問い合わせ
// ─────────────────────────────────────────
function ContactSection() {
  return (
    <section className="py-16" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
        <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
          お問い合わせ
        </h2>
        <p className="text-sm mb-6" style={{ color: "#1A2B1E" }}>
          アンサンブル倶楽部へのお問い合わせ・ご連絡は、こちらをご覧ください。
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium border-2 transition-colors hover:bg-[#3C6B4F] hover:text-white"
          style={{ borderColor: "#3C6B4F", color: "#3C6B4F" }}
        >
          お問い合わせフォームへ →
        </a>
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
      <main className="pt-16 page-enter">
        <HeroSection />
        <AboutSection />
        <SearchSection />
        <EnsembleListSection />
        <SpotsListSection />
        <ReportsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
