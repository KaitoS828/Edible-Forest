import { notFound } from "next/navigation";
import { getSpotDoc } from "@/lib/firestore";
import SpotAdminForm, { type SpotAdminFormData } from "./SpotAdminForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSpotEditPage({ params }: PageProps) {
  const { id } = await params;
  const doc = await getSpotDoc(id);
  if (!doc) notFound();

  const initialData: SpotAdminFormData = {
    name: doc.name ?? "",
    sub: doc.sub ?? "",
    region: doc.region ?? "関東",
    regionColor: doc.regionColor ?? "#3C6B4F",
    forestType: doc.forestType ?? "海の森",
    desc: doc.desc ?? "",
    content: doc.content ?? "",
    img: doc.img ?? "",
    address: doc.address ?? "",
    capacity: doc.capacity ?? "",
    price: doc.price ?? "",
    access: doc.access ?? "",
    bookingUrl: doc.bookingUrl ?? "",
    active: Boolean(doc.active),
    status: doc.status === "published" ? "published" : "draft",
    isOfficial: Boolean(doc.isOfficial),
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 text-xs" style={{ color: "#64748B" }}>
        <a href="/admin/spots" className="font-medium hover:text-slate-900">
          宿泊施設管理
        </a>
        <span>/</span>
        <span>{initialData.name || id}</span>
      </div>

      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          Edit lodging
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          {initialData.name || "宿泊施設を編集"}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
          施設ID: {id}
        </p>
      </div>

      <SpotAdminForm id={id} initialData={initialData} />
    </div>
  );
}
