"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { type Report } from "@/lib/cms";
import type { PageTextSetting } from "@/data/siteSettings";

const CATEGORY_COLORS: Record<string, string> = {
  "北海道・十勝":      "#4A7C59",
  "静岡・御前崎":      "#C4712E",
  "兵庫・竹野":        "#8FB996",
  "高知・四万十":      "#C4A832",
  "東京・武蔵野":      "#5C6B55",
  "アンサンブル":      "#4A7C59",
  "AI・テクノロジー":  "#7BA3C4",
  "生活生産":          "#A47C5C",
};

function categoryColor(cat?: string) {
  return cat ? (CATEGORY_COLORS[cat] ?? "#3C6B4F") : "#3C6B4F";
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function ReportCard({ report }: { report: Report }) {
  const color = categoryColor(report.category);
  const excerpt = report.body ? stripHtml(report.body).slice(0, 90) + "…" : "";

  return (
    <a href={`/reports/${report.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl mb-3" style={{ aspectRatio: "4/3" }}>
        {report.image ? (
          <img
            src={report.image.url}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl" style={{ backgroundColor: color + "15" }}>
            🌳
          </div>
        )}
      </div>
      <p className="text-xs mb-2" style={{ color: "#1A2B1E", opacity: 0.5 }}>{report.date}</p>
      {report.category && (
        <span
          className="inline-block text-xs px-2 py-0.5 mb-2 font-medium"
          style={{ backgroundColor: color, color: "white", borderRadius: "3px" }}
        >
          {report.category}
        </span>
      )}
      <h4
        className="text-base font-bold leading-snug line-clamp-3 mb-2"
        style={{ fontFamily: "'Noto Serif JP', serif", color: "#2C3A2E" }}
      >
        {report.title}
      </h4>
      {excerpt && (
        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#1A2B1E", opacity: 0.6 }}>
          {excerpt}
        </p>
      )}
    </a>
  );
}

export default function ReportsClient({ reports, pageText }: { reports: Report[]; pageText?: PageTextSetting }) {
  const categories = Array.from(new Set(reports.map((r) => r.category).filter(Boolean) as string[]));
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filtered = activeFilter ? reports.filter((r) => r.category === activeFilter) : reports;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">

        {/* ページヘッダー */}
        <div className="bg-white border-b" style={{ borderColor: "rgba(60,107,79,0.15)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10 md:py-14">
            <p className="text-sm mb-2" style={{ color: "#1A2B1E" }}>
              <a href="/" className="hover:underline">トップ</a>
              <span className="mx-1.5">›</span>活動レポート
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-sm font-medium tracking-widest mb-3" style={{ color: "#4A7C59" }}>{pageText?.eyebrow ?? "REPORTS"}</p>
                <h1
                  className="text-4xl md:text-5xl font-bold"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: "#2C3A2E" }}
                >
                  {pageText?.title ?? "活動レポート"}
                </h1>
              </div>
              <p className="text-base max-w-sm md:text-right leading-relaxed" style={{ color: "#5C6B55" }}>
                {pageText?.description ?? "各拠点での活動や、インターローカルな交流イベントの記録をテーマ別にご覧いただけます。"}
              </p>
            </div>
          </div>
        </div>

        {/* フィルター + グリッド */}
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-12 md:py-16">

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setActiveFilter(null)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeFilter === null ? "#2C3A2E" : "transparent",
                  color: activeFilter === null ? "white" : "#3C6B4F",
                  border: "1.5px solid " + (activeFilter === null ? "#2C3A2E" : "rgba(60,107,79,0.3)"),
                }}
              >
                すべて ({reports.length})
              </button>
              {categories.map((cat) => {
                const count = reports.filter((r) => r.category === cat).length;
                const isActive = activeFilter === cat;
                const color = categoryColor(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(isActive ? null : cat)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? color : "transparent",
                      color: isActive ? "white" : color,
                      border: `1.5px solid ${color}`,
                    }}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* 件数 */}
          <p className="text-base mb-6" style={{ color: "#1A2B1E" }}>
            {activeFilter ? `「${activeFilter}」` : "すべて"} — {filtered.length}件
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <span className="text-5xl mb-4">🌳</span>
              <p className="text-base" style={{ color: "#1A2B1E", opacity: 0.6 }}>該当する記事がありません</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {filtered.map((r) => <ReportCard key={r.id} report={r} />)}
            </div>
          )}

        </div>

      </main>
      <Footer />
    </div>
  );
}
