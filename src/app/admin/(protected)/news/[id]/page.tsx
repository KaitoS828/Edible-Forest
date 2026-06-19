import { notFound } from "next/navigation";
import { getCmsNews } from "@/lib/firestore";
import NewsForm from "../NewsForm";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function AdminNewsEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { lang } = await searchParams;
  const locale = lang === "en" ? "en" : "ja";
  const news = await getCmsNews(id);
  if (!news) notFound();
  const t = locale === "en" ? news.translations?.en : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 text-xs" style={{ color: "#64748B" }}>
        <a href="/admin/news" className="font-medium hover:text-slate-900">ニュース管理</a>
        <span>/</span>
        <span>{id}</span>
      </div>

      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          Edit news
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          {news.title}
        </h1>
      </div>

      <NewsForm
        mode="edit"
        newsId={id}
        locale={locale}
        initialData={{
          title: t?.title ?? news.title ?? "",
          date: t?.date ?? news.date ?? "",
          label: t?.label ?? news.label ?? "",
          href: t?.href ?? news.href ?? "",
          category: t?.category ?? news.category ?? "ニュース",
          imageUrl: t?.image?.url ?? news.image?.url ?? "",
          body: t?.body ?? news.body ?? "",
          status: news.status === "published" ? "published" : "draft",
          active: news.active !== false,
        }}
      />
    </div>
  );
}
