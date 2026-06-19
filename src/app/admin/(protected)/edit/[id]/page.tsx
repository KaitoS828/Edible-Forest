import { notFound } from "next/navigation";
import { getEnsembleDoc } from "@/lib/firestore";
import EnsembleEditForm from "./EnsembleEditForm";
import { LanguageTabs } from "@/components/admin/LanguageTabs";
import type { SiteLocale } from "@/data/siteSettings";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function EditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { lang: langParam } = await searchParams;
  const locale: SiteLocale = langParam === "en" ? "en" : "ja";

  const doc = await getEnsembleDoc(id);
  if (!doc) notFound();

  const t = locale === "en" ? doc.translations?.en : undefined;

  const initialData = {
    name: t?.name ?? doc.name,
    sub: t?.sub ?? doc.sub,
    region: doc.region,
    regionColor: doc.regionColor,
    desc: t?.desc ?? doc.desc,
    tagline: t?.tagline ?? doc.tagline ?? "",
    philosophy: t?.philosophy ?? doc.philosophy ?? "",
    img: doc.img,
    activities: doc.activities ?? [],
    stats: doc.stats ?? [],
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="text-xs transition-colors hover:text-[#3C6B4F]"
            style={{ color: "#1A2B1E" }}
          >
            ← ダッシュボード
          </a>
          <span style={{ color: "#1A2B1E" }}>/</span>
          <span className="text-xs" style={{ color: "#1A2B1E" }}>
            {doc.name}
          </span>
        </div>
        <LanguageTabs baseHref={`/admin/edit/${id}`} locale={locale} />
      </div>

      <EnsembleEditForm id={id} initialData={initialData} locale={locale} />
    </div>
  );
}
