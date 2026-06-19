import { notFound } from "next/navigation";
import { getCmsNews } from "@/lib/firestore";
import NewsForm from "../NewsForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminNewsEditPage({ params }: PageProps) {
  const { id } = await params;
  const news = await getCmsNews(id);
  if (!news) notFound();

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
        initialData={{
          title: news.title ?? "",
          date: news.date ?? "",
          label: news.label ?? "",
          href: news.href ?? "",
          category: news.category ?? "ニュース",
          imageUrl: news.image?.url ?? "",
          body: news.body ?? "",
          status: news.status === "published" ? "published" : "draft",
          active: news.active !== false,
        }}
      />
    </div>
  );
}
