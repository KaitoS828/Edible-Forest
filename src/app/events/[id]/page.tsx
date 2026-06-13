import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { adminAuth } from "@/lib/firebase-admin";
import { getEvent, getFacility } from "@/lib/firestore";
import { EventJoinButton } from "./EventJoinButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const FORMAT_LABELS: Record<string, string> = {
  onsite: "現地開催",
  online: "オンライン",
  both: "現地＋オンライン",
};

function formatDateTime(ms?: number): string {
  if (!ms) return "日時未定";
  return new Date(ms).toLocaleString("ja-JP", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  const event = await getEvent(id).catch(() => null);
  if (!event || event.status !== "published") notFound();

  const venue = event.venueFacilityId ? await getFacility(event.venueFacilityId).catch(() => null) : null;

  // ログインユーザーが参加済みか判定
  let joined = false;
  const sessionCookie = (await cookies()).get("fb_session")?.value ?? "";
  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      joined = event.participants?.includes(decoded.uid) ?? false;
    } catch {
      /* 未ログイン扱い */
    }
  }

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">
        {/* Hero */}
        <div className="w-full overflow-hidden" style={{ height: "420px", backgroundColor: "#F0F6F2" }}>
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🌿</div>
          )}
        </div>

        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pt-8 pb-6">
          <nav className="text-sm mb-6" style={{ color: "#1A2B1E" }}>
            <a href="/" className="opacity-50 hover:opacity-80 transition-opacity">ホーム</a>
            <span className="mx-2 opacity-30">›</span>
            <a href="/events" className="opacity-50 hover:opacity-80 transition-opacity">イベント一覧</a>
            <span className="mx-2 opacity-30">›</span>
            <span className="opacity-80">{event.title}</span>
          </nav>

          <span
            className="inline-block text-sm font-medium px-3 mb-4"
            style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: event.memberOnly ? "#3C6B4F" : "rgba(60,107,79,0.7)", color: "white" }}
          >
            {event.memberOnly ? "会員限定" : "オープン"}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
            {event.title}
          </h1>
          <p className="text-base" style={{ color: "#1A2B1E", opacity: 0.6 }}>主催：{event.organizerName}</p>
        </div>

        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pb-24 lg:pb-16">
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">
            {/* Left */}
            <div className="flex-1 min-w-0">
              {event.summary && (
                <section className="mb-12 pt-6 border-t" style={{ borderColor: "rgba(0,95,2,0.1)" }}>
                  <pre className="text-base leading-[1.9] whitespace-pre-wrap font-sans" style={{ color: "#1A2B1E" }}>{event.summary}</pre>
                </section>
              )}

              {event.terms && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>イベント規約</h2>
                  <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(0,95,2,0.03)", border: "1px solid rgba(0,95,2,0.09)" }}>
                    <pre className="text-sm leading-[1.9] whitespace-pre-wrap font-sans" style={{ color: "#1A2B1E", opacity: 0.8 }}>{event.terms}</pre>
                  </div>
                </section>
              )}
            </div>

            {/* Right sidebar */}
            <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0">
              <div className="sticky top-24 flex flex-col gap-4">
                <div className="rounded-3xl overflow-hidden" style={{ border: "1.5px solid rgba(0,95,2,0.15)", boxShadow: "0 4px 24px rgba(0,95,2,0.07)" }}>
                  <div className="px-6 py-4" style={{ backgroundColor: "#3C6B4F" }}>
                    <p className="text-white text-base font-semibold">{event.title}</p>
                    <p className="text-white text-sm mt-0.5 opacity-75">参加申込</p>
                  </div>

                  <div className="px-6 pt-5 pb-2 bg-white">
                    <DetailRow label="開催日時" value={formatDateTime(event.startAt)} />
                    {event.endAt && <DetailRow label="終了日時" value={formatDateTime(event.endAt)} />}
                    <DetailRow label="開催形態" value={FORMAT_LABELS[event.format] ?? event.format} />
                    {venue && <DetailRow label="会場" value={venue.name} />}
                  </div>

                  <div className="px-6 pt-4 pb-6 bg-white">
                    <EventJoinButton eventId={event.id} memberOnly={event.memberOnly} joined={joined} />
                  </div>
                </div>

                <a href="/events" className="flex items-center gap-1.5 text-sm px-2 transition-opacity hover:opacity-70" style={{ color: "#3C6B4F" }}>
                  ← イベント一覧に戻る
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-3 border-b" style={{ borderColor: "rgba(0,95,2,0.08)" }}>
      <span className="text-sm w-20 flex-shrink-0 font-medium" style={{ color: "#1A2B1E", opacity: 0.5 }}>{label}</span>
      <span className="text-sm font-bold" style={{ color: "#3C6B4F" }}>{value}</span>
    </div>
  );
}
