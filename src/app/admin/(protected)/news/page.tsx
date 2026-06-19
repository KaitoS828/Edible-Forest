import { getAllCmsNews } from "@/lib/firestore";

export default async function AdminNewsPage() {
  const news = await getAllCmsNews();
  const published = news.filter((item) => item.status === "published").length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between" style={{ borderColor: "#DCE3EA" }}>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
            News
          </p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
            ニュース管理
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
            トップページの更新履歴をFirestore上で作成・編集します
          </p>
        </div>
        <a href="/admin/news/new" className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "#0F172A" }}>
          新規作成
        </a>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "総数", value: news.length, sub: "all" },
          { label: "公開中", value: published, sub: "published" },
          { label: "下書き", value: news.length - published, sub: "draft" },
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
          <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>登録ニュース</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E5EAF0" }}>
                {["タイトル", "日付", "カテゴリ", "ラベル", "リンク", "状態", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #EEF2F6" }}>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: "#0F172A" }}>{item.title}</p>
                    <p className="text-xs" style={{ color: "#64748B" }}>{item.id}</p>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{item.date || "-"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{item.category || "-"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{item.label || "-"}</td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-xs" style={{ color: "#475569" }}>{item.href || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded px-2 py-1 text-xs font-medium" style={{ backgroundColor: item.status === "published" ? "#DCFCE7" : "#F1F5F9", color: item.status === "published" ? "#166534" : "#475569" }}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a href={`/admin/news/${item.id}`} className="rounded-md border px-3 py-1.5 text-xs font-medium" style={{ borderColor: "#CBD5E1", color: "#334155" }}>
                      編集
                    </a>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: "#64748B" }}>
                    Firestoreにはまだニュースがありません。新規作成してください。
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
