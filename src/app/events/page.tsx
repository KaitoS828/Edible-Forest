import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublishedEvents } from "@/lib/firestore";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const FORMAT_LABELS: Record<string, string> = {
  onsite: "現地開催",
  online: "オンライン",
  both: "現地＋オンライン",
};

function formatDate(ms?: number): string {
  if (!ms) return "日時未定";
  return new Date(ms).toLocaleString("ja-JP", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function EventsPage() {
  let events: Awaited<ReturnType<typeof getPublishedEvents>> = [];
  try {
    events = await getPublishedEvents();
  } catch {
    // Firestore 未設定時は空配列で表示
  }
  const settings = await getSiteSettings().catch(() => null);
  const pageText = settings?.pages.events;

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">
        <section className="py-12 md:py-16 border-b" style={{ borderColor: "rgba(0,95,2,0.1)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <span
              className="inline-block text-sm font-medium px-4 mb-4"
              style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}
            >
              {pageText?.eyebrow ?? "イベント"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              {pageText?.title ?? "開催中のイベント"}
            </h1>
            <p className="text-base" style={{ color: "#1A2B1E", lineHeight: "1.8" }}>
              {pageText?.description ?? "全国の食べられる森で開催されるイベントの一覧です。"}
            </p>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            {events.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-base" style={{ color: "#1A2B1E" }}>現在、公開中のイベントはありません</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {events.map((ev) => (
                  <a
                    key={ev.id}
                    href={`/events/${ev.id}`}
                    className="group block bg-white rounded-3xl overflow-hidden card-lift"
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,95,2,0.12)" }}
                  >
                    <div className="relative overflow-hidden" style={{ height: "180px", backgroundColor: "#F0F6F2" }}>
                      {ev.image ? (
                        <img src={ev.image} alt={ev.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                      )}
                      <span
                        className="absolute top-3 left-3 text-xs font-medium px-3"
                        style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: ev.memberOnly ? "#3C6B4F" : "rgba(60,107,79,0.7)", color: "white" }}
                      >
                        {ev.memberOnly ? "会員限定" : "オープン"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold mb-1 group-hover:opacity-70 transition-opacity" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                        {ev.title}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: "#1A2B1E", opacity: 0.7 }}>
                        {formatDate(ev.startAt)}・{FORMAT_LABELS[ev.format] ?? ev.format}
                      </p>
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#1A2B1E" }}>{ev.summary}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
