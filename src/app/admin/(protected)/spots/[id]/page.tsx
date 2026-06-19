import { notFound } from "next/navigation";
import { getSpotDoc } from "@/lib/firestore";
import SpotAdminForm, { type SpotAdminFormData } from "./SpotAdminForm";
import { LanguageTabs } from "@/components/admin/LanguageTabs";
import type { SiteLocale } from "@/data/siteSettings";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function AdminSpotEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { lang: langParam } = await searchParams;
  const locale: SiteLocale = langParam === "en" ? "en" : "ja";

  const doc = await getSpotDoc(id);
  if (!doc) notFound();

  const t = doc.translations?.en;

  // 英語モードなら翻訳データを優先
  const initialData: SpotAdminFormData = {
    name: (locale === "en" ? t?.name : undefined) ?? doc.name ?? "",
    sub: (locale === "en" ? t?.sub : undefined) ?? doc.sub ?? "",
    region: doc.region ?? "関東",
    regionColor: doc.regionColor ?? "#3C6B4F",
    forestType: doc.forestType ?? "海の森",
    desc: (locale === "en" ? t?.desc : undefined) ?? doc.desc ?? "",
    content: (locale === "en" ? t?.content : undefined) ?? doc.content ?? "",
    img: doc.img ?? "",
    address: (locale === "en" ? t?.address : undefined) ?? doc.address ?? "",
    capacity: (locale === "en" ? t?.capacity : undefined) ?? doc.capacity ?? "",
    price: (locale === "en" ? t?.price : undefined) ?? doc.price ?? "",
    access: (locale === "en" ? t?.access : undefined) ?? doc.access ?? "",
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
        <div className="flex items-center justify-between">
          <div>
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
          <LanguageTabs baseHref={`/admin/spots/${id}`} locale={locale} />
        </div>
      </div>

      <SpotAdminForm id={id} initialData={initialData} locale={locale} />
    </div>
  );
}
