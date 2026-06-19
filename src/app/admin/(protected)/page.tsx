import { getAllEnsembles } from "@/lib/firestore";

function formatDate(value: unknown) {
  if (!value) return "-";
  if (typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString("ja-JP");
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ja-JP");
}

export default async function AdminDashboard() {
  const ensembles = await getAllEnsembles();
  const published = ensembles.filter((item) => item.status === "published").length;
  const drafts = ensembles.filter((item) => item.status !== "published").length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between" style={{ borderColor: "#DCE3EA" }}>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
            Overview
          </p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          ダッシュボード
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
            会員・施設審査・公開コンテンツの状態を確認します
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", color: "#334155" }}
        >
          サイトを開く
        </a>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "アンサンブル", value: ensembles.length, sub: "登録総数" },
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

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { href: "/admin/members",    title: "会員管理", desc: "会員種別の変更・森の奥の付与" },
          { href: "/admin/ensembles", title: "アンサンブル管理", desc: "拠点コンテンツの公開・編集" },
          { href: "/admin/spots", title: "宿泊施設管理", desc: "宿泊施設ページの公開・編集" },
          { href: "/admin/cms/pages", title: "固定ページCMS", desc: "トップ・コンセプトページの編集" },
          { href: "/admin/news", title: "ニュース管理", desc: "トップ更新履歴の作成・公開・編集" },
          { href: "/admin/reports", title: "活動レポート管理", desc: "記事の作成・公開・編集" },
          { href: "/admin/site-settings", title: "サイト設定", desc: "ナビ・フッター・主要ページ文言の編集" },
          { href: "/admin/facilities", title: "施設審査", desc: "登録施設の承認・却下" },
        ].map(({ href, title, desc }) => (
          <a
            key={href}
            href={href}
            className="block rounded-md border bg-white p-4 transition-colors hover:bg-slate-50"
            style={{ borderColor: "#DCE3EA" }}
          >
            <p className="mb-1 text-sm font-semibold" style={{ color: "#0F172A" }}>
              {title}
            </p>
            <p className="text-xs" style={{ color: "#64748B" }}>{desc}</p>
          </a>
        ))}
      </div>

      <div className="overflow-hidden rounded-md border bg-white" style={{ borderColor: "#DCE3EA" }}>
        <div className="border-b px-4 py-3" style={{ borderColor: "#E5EAF0" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>アンサンブル管理</h2>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
