import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { REPORTS } from "@/data/reports";
import { ReportInteractions } from "@/components/ReportInteractions";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function isLoggedIn(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("fb_session")?.value;
    if (!session) return false;
    const { adminAuth } = await import("@/lib/firebase-admin");
    await adminAuth.verifySessionCookie(session, true);
    return true;
  } catch {
    return false;
  }
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const report = REPORTS.find((r) => r.id === id);
  if (!report) notFound();

  const loggedIn = await isLoggedIn();

  const colorMap: Record<string, string> = {
    "北海道・十勝": "#4A7C59",
    "静岡・御前崎": "#C4712E",
    "兵庫・竹野":   "#8FB996",
    "高知・四万十": "#C4A832",
    "東京・武蔵野": "#5C6B55",
    "アンサンブル": "#4A7C59",
    "AI・テクノロジー": "#7BA3C4",
    "生活生産":     "#A47C5C",
  };
  const mainColor = colorMap[report.tags[0]] ?? "#4A7C59";

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="py-12 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-[800px] mx-auto px-5 lg:px-10">
            {/* パンくず */}
            <a
              href="/reports"
              className="inline-flex items-center gap-1.5 text-xs mb-8 transition-opacity hover:opacity-70"
              style={{ color: "#000000" }}
            >
              ← 活動レポート一覧
            </a>

            {/* タグ */}
            <div className="flex flex-wrap gap-2 mb-5">
              {report.tags.map((tag) => {
                const c = colorMap[tag] ?? "#4A7C59";
                return (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: c + "20", color: c }}>
                    {tag}
                  </span>
                );
              })}
            </div>

            {/* 日付 */}
            <p className="text-sm mb-4" style={{ color: "#000000", opacity: 0.5 }}>{report.date}</p>

            {/* タイトル */}
            <h1
              className="text-2xl md:text-3xl font-bold leading-snug mb-8"
              style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
            >
              {report.title}
            </h1>

            {/* カバー画像 */}
            {report.img && (
              <div className="rounded-2xl overflow-hidden mb-10" style={{ height: "320px" }}>
                <img src={report.img} alt={report.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </section>

        {/* ── 本文 or ログインゲート ── */}
        {loggedIn ? (
          /* ログイン済み：全文表示 + いいね・コメント */
          <>
            <section className="pb-10" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="max-w-[800px] mx-auto px-5 lg:px-10">
                {report.body ? (
                  <div
                    className="prose prose-sm md:prose-base max-w-none"
                    style={{ color: "#000000" }}
                    dangerouslySetInnerHTML={{ __html: report.body }}
                  />
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: "#000000" }}>
                    {report.title}
                  </p>
                )}
              </div>
            </section>

            {/* いいね・コメント */}
            <section className="pb-4" style={{ backgroundColor: "#FFFFFF" }}>
              <ReportInteractions reportId={report.id} />
            </section>
          </>
        ) : (
          /* 未ログイン：冒頭ティーザー + ゲート */
          <section className="pb-20" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="max-w-[800px] mx-auto px-5 lg:px-10">

              {/* 冒頭のみ表示（本文の最初の段落） */}
              {report.body && (
                <div className="relative">
                  <div
                    className="prose prose-sm md:prose-base max-w-none"
                    style={{ color: "#000000", maxHeight: "200px", overflow: "hidden" }}
                    dangerouslySetInnerHTML={{ __html: report.body }}
                  />
                  {/* フェードアウト */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-24"
                    style={{ background: "linear-gradient(to bottom, transparent, white)" }}
                  />
                </div>
              )}

              {/* ログインゲート */}
              <div
                className="mt-8 rounded-3xl px-8 py-10 text-center"
                style={{ backgroundColor: "rgba(0,95,2,0.04)", border: "1.5px solid rgba(0,95,2,0.12)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#005F02" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h2
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
                >
                  全文を読むにはログインが必要です
                </h2>
                <p className="text-sm mb-6" style={{ color: "#000000" }}>
                  活動レポートの全文は、食べられる森アンサンブル倶楽部の会員のみご覧いただけます。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`/login?callbackUrl=/reports/${report.id}`}
                    className="px-8 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#005F02" }}
                  >
                    ログインして読む
                  </a>
                  <a
                    href="/join"
                    className="px-8 py-3 rounded-full text-sm font-medium border transition-opacity hover:opacity-70"
                    style={{ borderColor: "rgba(0,95,2,0.2)", color: "#005F02" }}
                  >
                    会員登録する
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 一覧に戻る ── */}
        <section className="pb-16" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-[800px] mx-auto px-5 lg:px-10 text-center">
            <a
              href="/reports"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "#005F02" }}
            >
              ← 活動レポート一覧に戻る
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
