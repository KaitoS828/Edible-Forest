import { getCmsPage } from "@/lib/firestore";
import CmsPageForm from "./CmsPageForm";
import { buildPageInitialData } from "./formData";

interface PageProps {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function AdminCmsPageEdit({ params, searchParams }: PageProps) {
  const { pageId } = await params;
  const { lang } = await searchParams;
  const locale = lang === "en" ? "en" : "ja";
  const page = await getCmsPage(pageId);
  const localeData = locale === "en" ? { ...page, ...page?.translations?.en } : page;
  const initialData = buildPageInitialData(pageId, localeData ?? undefined);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 text-xs" style={{ color: "#64748B" }}>
        <a href="/admin/cms/pages" className="font-medium hover:text-slate-900">固定ページCMS</a>
        <span>/</span>
        <span>{pageId}</span>
      </div>

      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          Edit page
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          {pageId} を編集
        </h1>
      </div>

      <CmsPageForm pageId={pageId} initialData={initialData} locale={locale} />
    </div>
  );
}
