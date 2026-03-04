"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TreeIcon } from "@/components/Logo";

const CATEGORIES = [
  { label: "北海道・十勝",  color: "#4A7C59",  textColor: "white"   },
  { label: "静岡・御前崎",  color: "#C4712E",  textColor: "white"   },
  { label: "兵庫・竹野",    color: "#8FB996",  textColor: "#2C3A2E" },
  { label: "高知・四万十",  color: "#C4A832",  textColor: "#2C3A2E" },
  { label: "東京・武蔵野",  color: "#5C6B55",  textColor: "white"   },
  { label: "アンサンブル",  color: "#4A7C59",  textColor: "white"   },
  { label: "AI・テクノロジー", color: "#7BA3C4", textColor: "white"  },
  { label: "生活生産",      color: "#A47C5C",  textColor: "white"   },
];

const colorMap: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.label, c.color]));

const REPORTS = [
  { date: "2024/06/18", tags: ["北海道・十勝", "生活生産"],    title: "広尾町で庭づくりワークショップを開催。20名が参加し、食べられる森の第一歩を踏み出しました。",                     img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70" },
  { date: "2024/06/10", tags: ["東京・武蔵野"],                 title: "ぶんじ食堂にて「都市の中の生活生産」をテーマにしたワークショップを開催。参加者から多くの声が集まりました。",        img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=70" },
  { date: "2024/06/03", tags: ["高知・四万十", "生活生産"],    title: "四万十川流域でのフィールドワーク。自然の仕組みから生活生産のヒントを深く探りました。",                              img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&q=70" },
  { date: "2024/05/22", tags: ["アンサンブル"],                 title: "拠点間交流イベントを初開催！北海道・東京・高知から20名が参加したアンサンブル会議レポート。",                         img: "" },
  { date: "2024/05/15", tags: ["北海道・十勝", "生活生産"],    title: "浦幌町での食べられる森マッピング。在来種の植物25種を記録し、データベース化を開始しました。",                          img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=70" },
  { date: "2024/05/01", tags: ["AI・テクノロジー"],            title: "「AIと食べられる森」勉強会を開催。隣に役立つ仕組みとしてのAI活用について議論しました。",                              img: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&q=70" },
  { date: "2024/04/20", tags: ["静岡・御前崎", "生活生産"],    title: "御前崎にて漁師・農家・都市住民による三者交流会を開催。食の未来を語り合いました。",                                  img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=70" },
  { date: "2024/04/10", tags: ["東京・武蔵野"],                 title: "武蔵野エリアの商店街再構築プロジェクト始動。地域の担い手10名でキックオフミーティングを実施しました。",                img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=70" },
  { date: "2024/04/02", tags: ["兵庫・竹野", "生活生産"],      title: "竹野で伝統的な山仕事体験を実施。地元の方々から古来の知恵を学ぶ貴重な機会となりました。",                             img: "" },
  { date: "2024/03/18", tags: ["アンサンブル", "AI・テクノロジー"], title: "第2回アンサンブル会議を開催。テクノロジーと生活生産の融合についてオンライン+現地のハイブリッドで議論。",       img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=70" },
  { date: "2024/03/10", tags: ["北海道・十勝"],                 title: "広尾町の山林に食べられる植物を植樹。地域の子供たちも参加した植樹イベントを開催しました。",                            img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70" },
  { date: "2024/03/01", tags: ["生活生産"],                     title: "生活生産ワークショップ「食べる・つくる・育てる」第1回を実施。参加者からの反響が大きく第2回の開催が決定。",           img: "" },
  { date: "2024/02/20", tags: ["東京・武蔵野", "AI・テクノロジー"], title: "武蔵野エリアの都市農園でAIを活用した栽培管理の実験を開始。データ収集フェーズに入りました。",                   img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=70" },
  { date: "2024/02/10", tags: ["高知・四万十", "生活生産"],    title: "四万十川での水辺の植物観察会。参加者15名が食べられる植物の見分け方を学びました。",                                   img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=70" },
  { date: "2024/01/25", tags: ["アンサンブル"],                 title: "2024年の活動計画を策定。各LCの担当者が一堂に集い、年間スケジュールと目標を確認しました。",                            img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=70" },
  { date: "2024/01/10", tags: ["静岡・御前崎"],                 title: "御前崎LCの発足を記念するキックオフイベントを開催。地元の方々の参加で賑やかなスタートとなりました。",                  img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70" },
];

function ReportCard({ report }: { report: typeof REPORTS[0] }) {
  const mainColor = colorMap[report.tags[0]] ?? "#4A7C59";
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
      {report.img ? (
        <div className="h-44 overflow-hidden">
          <img src={report.img} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="h-44 flex items-center justify-center" style={{ backgroundColor: mainColor + "15" }}>
          <TreeIcon size={44} />
        </div>
      )}
      <div className="p-4">
        <p className="text-[10px] mb-2" style={{ color: "#000000" }}>{report.date}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {report.tags.map((tag) => {
            const c = colorMap[tag] ?? "#4A7C59";
            return (
              <span key={tag} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: c + "20", color: c }}>
                {tag}
              </span>
            );
          })}
        </div>
        <h4 className="text-sm font-medium leading-snug line-clamp-3 mb-3" style={{ color: "#2C3A2E" }}>{report.title}</h4>
        <span className="text-xs font-medium" style={{ color: "#C4712E" }}>詳細へ →</span>
      </div>
    </article>
  );
}

export default function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filtered = activeFilter ? REPORTS.filter((r) => r.tags.includes(activeFilter)) : REPORTS;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <Header />
      <main className="pt-16">

        {/* ページヘッダー */}
        <div className="bg-white border-b" style={{ borderColor: "#E4DDD0" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10 md:py-14">
            <p className="text-xs mb-2" style={{ color: "#000000" }}>
              <a href="/" className="hover:underline">トップ</a>
              <span className="mx-1.5">›</span>活動レポート
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-widest mb-3" style={{ color: "#4A7C59" }}>REPORTS</p>
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: "#2C3A2E" }}
                >
                  活動レポート
                </h1>
              </div>
              <p className="text-sm max-w-sm md:text-right leading-relaxed" style={{ color: "#5C6B55" }}>
                各拠点での活動や、インターローカルな交流イベントの
                記録をテーマ別にご覧いただけます。
              </p>
            </div>
          </div>
        </div>

        {/* フィルター + グリッド */}
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-12 md:py-16">

          {/* フィルター */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveFilter(null)}
              className="px-4 py-2 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: activeFilter === null ? "#2C3A2E" : "white",
                color: activeFilter === null ? "white" : "#5C6B55",
                border: "1.5px solid " + (activeFilter === null ? "#2C3A2E" : "#E4DDD0"),
              }}
            >
              すべて ({REPORTS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = REPORTS.filter((r) => r.tags.includes(cat.label)).length;
              if (count === 0) return null;
              const isActive = activeFilter === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveFilter(isActive ? null : cat.label)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: isActive ? cat.color : "white",
                    color: isActive ? cat.textColor : cat.color,
                    border: `1.5px solid ${cat.color}`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: isActive ? "rgba(255,255,255,0.5)" : cat.color }} />
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* 件数 */}
          <p className="text-sm mb-6" style={{ color: "#000000" }}>
            {activeFilter ? `「${activeFilter}」` : "すべて"} — {filtered.length}件
          </p>

          {/* グリッド */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {filtered.map((r, i) => <ReportCard key={i} report={r} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24" style={{ color: "#000000" }}>
              <TreeIcon size={48} />
              <p className="mt-4 text-sm">該当する記事がありません</p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
