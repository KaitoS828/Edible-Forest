"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarIcon } from "@/components/Logo";

// ---- Hero ----
function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-screen min-h-[420px] md:min-h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1440&q=80')`,
          filter: "saturate(0.7)",
        }}
      />
      <div className="absolute inset-0 bg-[#F6F2ED]/30" />
      <div className="absolute bottom-12 left-6 md:left-20 right-6 md:right-auto">
        <h1
          className="text-3xl md:text-5xl font-bold text-[#333333] leading-tight"
          style={{ fontFamily: "'Noto Serif JP', serif" }}
        >
          あかるい過疎が、
          <br />
          見えてくる。
        </h1>
      </div>
    </section>
  );
}

// ---- About ----
function AboutSection() {
  return (
    <section id="about" className="bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-6xl text-[#DBCD52] font-serif leading-none mb-4 select-none">"</div>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#333333] leading-snug mb-6"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              過疎地域のあかるい未来を、
              <br />
              村民の手でかなえていく。
              <br />
              自立と協働で動かす
              <br />
              「五木村過疎未来研究会」
            </h2>
            <p className="text-sm md:text-base text-[#595757] leading-loose">
              少子高齢化、農村衰退、移住定住難、地域産業の縮小など過疎地域にはなかなか前向きに捉えにくい課題があります。ただ、課題として向き合うことを責め続けている地域に未来はありません。人口100人未満の過疎地域でも、地域の皆さんがしっかりと向き合って受け入れていき、そして一人ひとりの関係が見えやすい地域で暮らしています。
            </p>
            <p className="text-sm md:text-base text-[#595757] leading-loose mt-4">
              過疎地域だからこそ、できることがあります。過疎だからこそできる、あかるい未来があります。自立と共助力をもった「ふるさと」、村内外の様々な勢力をもった協働で地域をつくり「五木村過疎未来研究会」です。
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden h-48 md:h-56 bg-[#EEEEEE]">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"
                alt="活動の様子"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-40 md:h-48 bg-[#EEEEEE] ml-8">
              <img
                src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&q=80"
                alt="ワークショップ"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Tabs ----
const tabContents = {
  structure: {
    title: "自分たちの村は、自分たちでつくる",
    body: "五木村過疎未来研究会のゴールは「村社会に根ざした活動連携」です。しかし活動連携すれば良いというわけではありません。活動は、村民、関係機関、専門家機関との連携のもとで行われる適切な活動体制に、活動のための機能を求めます。",
    diagram: true,
  },
  steps: {
    title: "活動ステップ",
    body: "研究会では段階的に活動を展開しています。まず村内の現状把握と課題整理を行い、次いで住民ワークショップを通じて解決策を共創し、最終的に持続可能な地域活動モデルの実装を目指します。",
    diagram: false,
  },
  themes: {
    title: "活動テーマ",
    body: "五木村の持続可能な未来に向けて、産業・林業、福祉・観光、教育・子育て、芸術・娯楽、地域・人材の5つのテーマで活動しています。",
    diagram: false,
  },
};

function OrgDiagram() {
  return (
    <div className="mt-8 flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="inline-block border-2 border-[#6BA26D] rounded-full px-6 py-1.5 text-sm text-[#6BA26D] font-medium">
          五木村の中
        </div>
        <p className="text-xs text-[#595757] mt-1">村民 / 村内事業者 など</p>
      </div>
      <div className="w-0.5 h-6 bg-[#EEEEEE]" />
      <div className="flex items-center gap-8 md:gap-16">
        <div className="text-center">
          <div className="inline-block border-2 border-[#E58251] rounded-full px-6 py-1.5 text-sm text-[#E58251] font-medium">
            五木村の外
          </div>
          <p className="text-xs text-[#595757] mt-1">専門家 / 民間企業 など</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-0.5 bg-[#DBCD52]" />
        </div>
        <div className="text-center">
          <div className="inline-block border-2 border-[#595757] rounded-full px-6 py-1.5 text-sm text-[#595757] font-medium">
            行政関係
          </div>
          <p className="text-xs text-[#595757] mt-1">専門家 / 熊本県</p>
        </div>
      </div>
      <div className="w-0.5 h-6 bg-[#EEEEEE]" />
      <div className="text-center">
        <div className="inline-block bg-[#6BA26D] rounded-full px-8 py-2.5 text-sm text-white font-medium shadow-md">
          五木村過疎未来研究会
        </div>
      </div>
    </div>
  );
}

function TabsSection() {
  const [activeTab, setActiveTab] = useState<"structure" | "steps" | "themes">("structure");
  const content = tabContents[activeTab];
  return (
    <section id="structure" className="py-16 md:py-24 bg-[#F6F2ED]">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10">
          <div className="flex border-b border-[#EEEEEE] mb-8">
            {(["structure", "steps", "themes"] as const).map((tab) => {
              const label = tab === "structure" ? "組織体制" : tab === "steps" ? "活動ステップ" : "活動テーマ";
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-[#6BA26D] text-[#6BA26D]"
                      : "border-transparent text-[#595757] hover:text-[#333333]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#333333] mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }}>
            {content.title}
          </h3>
          <p className="text-sm md:text-base text-[#595757] leading-loose">{content.body}</p>
          {content.diagram && <OrgDiagram />}
        </div>
      </div>
    </section>
  );
}

// ---- Reports Preview ----
export const allReports = [
  { date: "2024/01/15", tags: ["産業・林業", "活動報告"], title: "林業体験レポート1日目 西原村！西原祭りのワークショップ", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70", color: "#6BA26D" },
  { date: "2024/02/03", tags: ["教育・子育て", "活動報告"], title: "1月23日以来！子供向け子育て未来研究イベント企画に向けた勉強会を開催しました", img: "", color: "#DBCD52" },
  { date: "2024/02/15", tags: ["福祉・観光", "活動報告"], title: "【第2回】11月14日に「これから五木の未来を考える勉強会」第2回を開催しました。", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=70", color: "#E58251" },
  { date: "2024/02/20", tags: ["地域・人材", "イベント"], title: "イベント報告 11月10日〜11日「五木未来研究会オープン会」を開催しました。", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=70", color: "#6BA26D" },
  { date: "2024/03/01", tags: ["教育・子育て", "活動報告"], title: "2月23日以来！子供向け子育て未来研究イベント企画に向けた勉強会を開催しました", img: "", color: "#DBCD52" },
  { date: "2024/03/05", tags: ["教育・子育て", "活動報告"], title: "2月23日以来！子供向け子育て未来研究イベント企画に向けた勉強会を開催しました", img: "", color: "#DBCD52" },
  { date: "2024/03/10", tags: ["福祉・観光", "活動報告"], title: "【第3回】11月14日に「これから五木の未来を考える勉強会」第3回を開催しました。", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=70", color: "#E58251" },
  { date: "2024/03/18", tags: ["地域・人材"], title: "【第2回】10月7日に「これから五木の未来を考える勉強会」第2回を開催しました。", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=70", color: "#6BA26D" },
];

function ReportCard({ report }: { report: typeof allReports[0] }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      {report.img ? (
        <div className="h-40 overflow-hidden">
          <img src={report.img} alt={report.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center" style={{ backgroundColor: report.color + "22" }}>
          <StarIcon size={40} />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-[#595757] mb-2">{report.date}</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {report.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: report.color }}>
              {tag}
            </span>
          ))}
        </div>
        <h4 className="text-sm text-[#333333] font-medium leading-snug line-clamp-3">{report.title}</h4>
        <p className="text-xs text-[#E58251] mt-2">詳細へ →</p>
      </div>
    </article>
  );
}

function ReportsSection() {
  return (
    <section id="reports" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="inline-block text-xs font-medium text-white px-3 py-1 rounded-full mb-3" style={{ backgroundColor: "#DBCD52" }}>
              プロジェクトを紹介
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#333333]" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              活動レポート
            </h2>
          </div>
          <p className="text-sm text-[#595757] mt-2 md:mt-0 max-w-xs md:text-right">
            五木村過疎未来研究会で進行中のプロジェクトを紹介し、テーマごとに活動状況をこちらから確認できます。
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {allReports.map((report, i) => (
            <ReportCard key={i} report={report} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a href="/reports" className="flex items-center gap-2 bg-[#333333] text-white text-sm px-6 py-3 rounded-full hover:bg-[#595757] transition-colors">
            プロジェクトを見る
            <span className="w-5 h-5 rounded-full bg-[#E58251] flex items-center justify-center text-xs">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ---- Themes ----
const themeCategories = [
  { label: "産業・林業", color: "#6BA26D", textColor: "white" },
  { label: "福祉・観光", color: "#E58251", textColor: "white" },
  { label: "教育・子育て", color: "#DBCD52", textColor: "#333333" },
  { label: "芸術・娯楽", color: "#7BA3C4", textColor: "white" },
  { label: "地域・人材", color: "#9E7BC4", textColor: "white" },
];

function ThemesSection() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  return (
    <section id="themes" className="py-16 md:py-24 bg-[#F6F2ED]">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-8 text-center" style={{ fontFamily: "'Noto Serif JP', serif" }}>
          テーマから記事をさがす
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {themeCategories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveTheme(activeTheme === cat.label ? null : cat.label)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: activeTheme === cat.label ? cat.color : cat.color + "22",
                color: activeTheme === cat.label ? cat.textColor : cat.color,
                border: `1.5px solid ${cat.color}`,
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.label}
            </button>
          ))}
        </div>
        {activeTheme && (
          <p className="text-center text-sm text-[#595757] mt-6">「{activeTheme}」の記事を表示中</p>
        )}
      </div>
    </section>
  );
}

// ---- Page ----
export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F6F2ED" }}>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <TabsSection />
        <ReportsSection />
        <ThemesSection />
      </main>
      <Footer />
    </div>
  );
}
