import { notFound } from "next/navigation";
import { getCmsReport } from "@/lib/firestore";
import ReportForm from "../ReportForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminReportEditPage({ params }: PageProps) {
  const { id } = await params;
  const report = await getCmsReport(id);
  if (!report) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 text-xs" style={{ color: "#64748B" }}>
        <a href="/admin/reports" className="font-medium hover:text-slate-900">活動レポート管理</a>
        <span>/</span>
        <span>{id}</span>
      </div>

      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          Edit report
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          {report.title}
        </h1>
      </div>

      <ReportForm
        mode="edit"
        reportId={id}
        initialData={{
          title: report.title ?? "",
          date: report.date ?? "",
          category: report.category ?? "",
          imageUrl: report.image?.url ?? "",
          body: report.body ?? "",
          status: report.status === "published" ? "published" : "draft",
          active: report.active !== false,
        }}
      />
    </div>
  );
}
