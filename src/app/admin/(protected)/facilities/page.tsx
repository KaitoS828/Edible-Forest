import { getAllEvents } from "@/lib/firestore";
import EventReviewRow from "./EventReviewRow";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const events = await getAllEvents();

  const serialized = events.map((event) => ({
    id: event.id,
    title: event.title,
    organizerName: event.organizerName,
    startAt: event.startAt,
    format: event.format,
    status: event.status,
    createdAt: event.createdAt?.toMillis?.() ?? 0,
  }));

  const stats = {
    total:    serialized.length,
    pending:  serialized.filter((event) => event.status === "pending").length,
    published: serialized.filter((event) => event.status === "published").length,
    rejected: serialized.filter((event) => event.status === "rejected").length,
  };

  return (
    <div>
      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          Events
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          イベント審査
        </h1>
      </div>

      {/* 統計カード */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "申請イベント数", value: stats.total,    color: "#0F172A" },
          { label: "審査中",     value: stats.pending,  color: "#D97706" },
          { label: "公開中",   value: stats.published, color: "#166534" },
          { label: "却下",       value: stats.rejected, color: "#9CA3AF" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-md border bg-white p-4" style={{ borderColor: "#DCE3EA" }}>
            <p className="text-xs font-medium" style={{ color: "#64748B" }}>{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* イベントテーブル */}
      <div className="overflow-hidden rounded-md border bg-white" style={{ borderColor: "#DCE3EA" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "920px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E5EAF0" }}>
                {["イベント名", "主催者", "開催日時", "形式", "状態", "審査"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serialized.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "#64748B" }}>
                    申請されたイベントはありません
                  </td>
                </tr>
              )}
              {serialized.map((event, i) => (
                <EventReviewRow key={event.id} event={event} isLast={i === serialized.length - 1} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
