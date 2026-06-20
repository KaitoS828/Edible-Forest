import { getAllSpots } from "@/lib/firestore";

function formatDate(value: unknown) {
  if (!value) return "-";
  if (typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString("ja-JP");
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ja-JP");
}

export default async function AdminSpotsPage() {
  const spots = await getAllSpots();
  const published = spots.filter((item) => item.status === "published").length;
  const active = spots.filter((item) => item.active).length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between" style={{ borderColor: "#DCE3EA" }}>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
            Lodging
          </p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
            宿泊施設管理
          </h1>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "総数", value: spots.length, sub: "all" },
          { label: "公開中", value: published, sub: "published" },
          { label: "有効", value: active, sub: "active" },
        ].map((item) => (
          <div key={item.label} className="rounded-md border bg-white p-4" style={{ borderColor: "#DCE3EA" }}>
            <p className="text-xs font-medium" style={{ color: "#64748B" }}>{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums" style={{ color: "#0F172A" }}>{item.value}</p>
            <p className="mt-1 text-xs" style={{ color: "#94A3B8" }}>{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-md border bg-white" style={{ borderColor: "#DCE3EA" }}>
        <div className="border-b px-4 py-3" style={{ borderColor: "#E5EAF0" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>登録宿泊施設</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E5EAF0" }}>
                {["施設名", "地域", "タイプ", "状態", "更新日", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spots.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #EEF2F6" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                        {item.img && <img src={item.img} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "#0F172A" }}>{item.name}</p>
                        <p className="text-xs" style={{ color: "#64748B" }}>{item.authorName || "author unknown"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{item.region}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{item.forestType}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="rounded px-2 py-1 text-xs font-medium" style={{ backgroundColor: item.status === "published" ? "#DCFCE7" : "#F1F5F9", color: item.status === "published" ? "#166534" : "#475569" }}>
                        {item.status}
                      </span>
                      <span className="rounded px-2 py-1 text-xs font-medium" style={{ backgroundColor: item.active ? "#DBEAFE" : "#FEF3C7", color: item.active ? "#1D4ED8" : "#92400E" }}>
                        {item.active ? "active" : "inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                    {formatDate(item.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a href={`/admin/spots/${item.id}`} className="rounded-md border px-3 py-1.5 text-xs font-medium" style={{ borderColor: "#CBD5E1", color: "#334155" }}>
                      編集
                    </a>
                  </td>
                </tr>
              ))}
              {spots.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "#64748B" }}>
                    宿泊施設はまだ登録されていません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
