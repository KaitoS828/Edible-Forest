import { getAllCmsPages } from "@/lib/firestore";

const KNOWN_PAGES = [
  { pageId: "top", title: "トップページ", desc: "ヒーロースライドと更新履歴周辺の文言" },
  { pageId: "concept", title: "コンセプトページ", desc: "食べられる森とは、本文とギャラリー" },
];

export default async function AdminCmsPagesPage() {
  const pages = await getAllCmsPages();
  const pageMap = new Map(pages.map((page) => [page.pageId, page]));

  return (
    <div>
      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          CMS Pages
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          固定ページCMS
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
          microCMSを使わず、Firestore上のページ内容を管理します
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {KNOWN_PAGES.map((item) => {
          const page = pageMap.get(item.pageId);
          return (
            <a
              key={item.pageId}
              href={`/admin/cms/pages/${item.pageId}`}
              className="block rounded-md border bg-white p-4 transition-colors hover:bg-slate-50"
              style={{ borderColor: "#DCE3EA" }}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>{item.title}</h2>
                <span className="rounded px-2 py-1 text-xs font-medium" style={{ backgroundColor: page ? "#DCFCE7" : "#FEF3C7", color: page ? "#166534" : "#92400E" }}>
                  {page ? "設定済み" : "未設定"}
                </span>
              </div>
              <p className="text-xs" style={{ color: "#64748B" }}>{item.desc}</p>
              <p className="mt-3 text-xs" style={{ color: "#94A3B8" }}>
                ID: {item.pageId}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
