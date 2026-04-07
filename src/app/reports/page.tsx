"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TreeIcon } from "@/components/Logo";
import { REPORTS } from "@/data/reports";

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

function ReportCard({ report }: { report: typeof REPORTS[0] }) {
  const mainColor = colorMap[report.tags[0]] ?? "#4A7C59";
  return (
    <a
      href={`/reports/${report.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group block"
    >
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
        <p className="text-[10px] mb-2" style={{ color: "#1A2B1E" }}>{report.date}</p>
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
    </a>
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
            <p className="text-xs mb-2" style={{ color: "#1A2B1E" }}>
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
          <p className="text-sm mb-6" style={{ color: "#1A2B1E" }}>
            {activeFilter ? `「${activeFilter}」` : "すべて"} — {filtered.length}件
          </p>

          {/* グリッド */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {filtered.map((r) => <ReportCard key={r.id} report={r} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24" style={{ color: "#1A2B1E" }}>
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
