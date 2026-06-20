import { getAllEnsembles } from "@/lib/firestore";

function formatDate(value: unknown) {
  if (!value) return "-";
  if (typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString("ja-JP");
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ja-JP");
}

export default async function AdminEnsemblesPage() {
  const ensembles = await getAllEnsembles();
  const published = ensembles.filter((item) => item.status === "published").length;
  const drafts = ensembles.length - published;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between" style={{ borderColor: "#DCE3EA" }}>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
            Ensembles
          </p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
            アンサンブル管理
          </h1>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "総数", value: ensembles.length, sub: "all" },
          { label: "公開中", value: published, sub: "published" },
          { label: "下書き/非公開", value: drafts, sub: "draft" },
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
          <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>登録アンサンブル</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E5EAF0" }}>
                {["名称", "地域", "状態", "更新日", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ensembles.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #EEF2F6" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                        {item.img && <img src={item.img} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "#0F172A" }}>{item.name}</p>
                        <p className="text-xs" style={{ color: "#64748B" }}>{item.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{item.region}</td>
                  <td className="px-4 py-3">
                    <span className="rounded px-2 py-1 text-xs font-medium" style={{ backgroundColor: item.status === "published" ? "#DCFCE7" : "#F1F5F9", color: item.status === "published" ? "#166534" : "#475569" }}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                    {formatDate(item.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a href={`/admin/edit/${item.id}`} className="rounded-md border px-3 py-1.5 text-xs font-medium" style={{ borderColor: "#CBD5E1", color: "#334155" }}>
                      編集
                    </a>
                  </td>
                </tr>
              ))}
              {ensembles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: "#64748B" }}>
                    アンサンブルはまだ登録されていません。
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
