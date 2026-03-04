"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarIcon } from "@/components/Logo";

// ---- カテゴリ定義 ----
const ALL_CATEGORIES = [
  { label: "産業・林業",  color: "#6BA26D",  textColor: "white"   },
  { label: "福祉・観光",  color: "#E58251",  textColor: "white"   },
  { label: "教育・子育て",color: "#61AAD5",  textColor: "white"   },
  { label: "芸術・娯楽",  color: "#D490B5",  textColor: "white"   },
  { label: "地域・人材",  color: "#DBCD52",  textColor: "#333333" },
  { label: "移住・定住",  color: "#10BBB2",  textColor: "white"   },
  { label: "農業・食",    color: "#6FAA00",  textColor: "white"   },
  { label: "イベント",    color: "#EAC100",  textColor: "#333333" },
];

const categoryColorMap: Record<string, string> = {
  "産業・林業":  "#6BA26D",
  "福祉・観光":  "#E58251",
  "教育・子育て":"#61AAD5",
  "芸術・娯楽":  "#D490B5",
  "地域・人材":  "#DBCD52",
  "移住・定住":  "#10BBB2",
  "農業・食":    "#6FAA00",
  "イベント":    "#EAC100",
  "活動報告":    "#A49F9C",
};

// ---- レポートデータ（16件） ----
const REPORTS = [
  { date: "2024/06/18", tags: ["地域・人材", "活動報告"],  title: "村の担い手育成プログラム第1期がスタート。10名の参加者と共に活動します。",          img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=70" },
  { date: "2024/06/03", tags: ["農業・食", "活動報告"],    title: "「食で繋がる五木村」プロジェクト始動！第1回ミーティングを行いました。",          img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70" },
  { date: "2024/05/22", tags: ["教育・子育て", "活動報告"],"title": "子どもたちが主役！五木村の未来を考える「キッズワークショップ」を開催しました。", img: "" },
  { date: "2024/05/15", tags: ["移住・定住", "イベント"],  title: "移住体験ツアー参加者募集！五木村での生活を1週間体験してみませんか？",            img: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&q=70" },
  { date: "2024/05/01", tags: ["産業・林業", "活動報告"],  title: "林業従事者向け勉強会を開催。新たな木材活用の可能性を探りました。",                img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=70" },
  { date: "2024/04/20", tags: ["イベント"],                title: "春の地域交流イベント「五木村まつり」が無事開催されました。ご参加ありがとうございます！", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=70" },
  { date: "2024/04/10", tags: ["芸術・娯楽", "活動報告"],  title: "村内アーティストによる展示会「五木の風景」を開催。多くの方にご来場いただきました。", img: "" },
  { date: "2024/04/02", tags: ["農業・食", "活動報告"],    title: "地元農家と連携した「五木の食」魅力発信イベントを開催しました。",                img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=70" },
  { date: "2024/03/18", tags: ["地域・人材"],              title: "【第2回】10月7日に「これから五木の未来を考える勉強会」第2回を開催しました。",    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=70" },
  { date: "2024/03/10", tags: ["福祉・観光", "活動報告"],  title: "【第3回】「これから五木の未来を考える勉強会」第3回を開催しました。",            img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=70" },
  { date: "2024/03/05", tags: ["移住・定住", "活動報告"],  title: "移住希望者向け説明会を開催。五木村の暮らしをリアルにお伝えしました。",            img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70" },
  { date: "2024/03/01", tags: ["教育・子育て", "活動報告"],"title": "2月23日以来！子供向け子育て未来研究イベント企画に向けた勉強会を開催しました",   img: "" },
  { date: "2024/02/20", tags: ["地域・人材", "イベント"],  title: "イベント報告 11月10日〜11日「五木未来研究会オープン会」を開催しました。",        img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=70" },
  { date: "2024/02/15", tags: ["福祉・観光", "活動報告"],  title: "【第2回】11月14日に「これから五木の未来を考える勉強会」第2回を開催しました。",  img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=70" },
  { date: "2024/02/03", tags: ["教育・子育て", "活動報告"],"title": "1月23日以来！子供向け子育て未来研究イベント企画に向けた勉強会を開催しました",   img: "" },
  { date: "2024/01/15", tags: ["産業・林業", "活動報告"],  title: "林業体験レポート1日目 西原村！西原祭りのワークショップを開催",                  img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70" },
];

// ---- カード ----
function ReportCard({ report }: { report: typeof REPORTS[0] }) {
  const mainColor = categoryColorMap[report.tags[0]] ?? "#6BA26D";
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
      {report.img ? (
        <div className="h-44 overflow-hidden">
          <img
            src={report.img}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-44 flex items-center justify-center" style={{ backgroundColor: mainColor + "18" }}>
          <StarIcon size={44} />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-[#A49F9C] mb-2">{report.date}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {report.tags.map((tag) => {
            const c = categoryColorMap[tag] ?? "#A49F9C";
            return (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: c + "22", color: c }}
              >
                {tag}
              </span>
            );
          })}
        </div>
        <h4 className="text-sm text-[#333333] font-medium leading-snug line-clamp-3 mb-3">
          {report.title}
        </h4>
        <span className="text-xs text-[#E58251] font-medium">詳細へ →</span>
      </div>
    </article>
  );
}

// ---- ページ本体 ----
export default function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = activeFilter
    ? REPORTS.filter((r) => r.tags.includes(activeFilter))
    : REPORTS;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F6F2ED" }}>
      <Header />

      <main className="pt-16">
        {/* ページヘッダー */}
        <div className="bg-white border-b border-[#EEEEEE]">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10 md:py-14">
            <p className="text-xs text-[#A49F9C] mb-2">
              <a href="/" className="hover:text-[#E58251] transition-colors">トップ</a>
              <span className="mx-1.5">›</span>
              活動レポート
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span
                  className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                  style={{ backgroundColor: "#DBCD52", color: "#333333" }}
                >
                  プロジェクトを紹介
                </span>
                <h1
                  className="text-3xl md:text-4xl font-bold text-[#333333]"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  活動レポート
                </h1>
              </div>
              <p className="text-sm text-[#595757] max-w-sm md:text-right leading-relaxed">
                五木村過疎未来研究会で進行中のプロジェクトを紹介し、
                テーマごとに活動状況をこちらから確認できます。
              </p>
            </div>
          </div>
        </div>

        {/* フィルター + グリッド */}
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-12 md:py-16">
          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeFilter === null
                  ? "bg-[#333333] text-white"
                  : "bg-white text-[#595757] border border-[#EEEEEE] hover:border-[#595757]"
              }`}
            >
              すべて ({REPORTS.length})
            </button>
            {ALL_CATEGORIES.map((cat) => {
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
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: isActive ? cat.textColor === "white" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.3)" : cat.color }} />
                  {cat.label}
                  <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* 件数表示 */}
          <p className="text-sm text-[#A49F9C] mb-6">
            {activeFilter ? `「${activeFilter}」` : "すべて"}の記事 — {filtered.length}件
          </p>

          {/* グリッド */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {filtered.map((report, i) => (
                <ReportCard key={i} report={report} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-[#A49F9C]">
              <StarIcon size={48} />
              <p className="mt-4 text-sm">該当する記事がありません</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
