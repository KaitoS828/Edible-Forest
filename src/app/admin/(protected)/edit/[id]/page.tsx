import { notFound } from "next/navigation";
import { getEnsembleDoc } from "@/lib/firestore";
import EnsembleEditForm from "./EnsembleEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: PageProps) {
  const { id } = await params;

  const doc = await getEnsembleDoc(id);
  if (!doc) notFound();

  const initialData = {
    name: doc.name,
    sub: doc.sub,
    region: doc.region,
    regionColor: doc.regionColor,
    desc: doc.desc,
    tagline: doc.tagline ?? "",
    philosophy: doc.philosophy ?? "",
    img: doc.img,
    activities: doc.activities ?? [],
    stats: doc.stats ?? [],
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <a
          href="/admin"
          className="text-xs transition-colors hover:text-[#3C6B4F]"
          style={{ color: "#1A2B1E" }}
        >
          ← ダッシュボード
        </a>
        <span style={{ color: "#1A2B1E" }}>/</span>
        <span className="text-xs" style={{ color: "#1A2B1E" }}>
          {initialData.name}
        </span>
      </div>

      <EnsembleEditForm id={id} initialData={initialData} />
    </div>
  );
}
