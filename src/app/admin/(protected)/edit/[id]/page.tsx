import { getEnsembleContent } from "@/lib/microcms";
import { getEnsemble } from "@/data/ensembles";
import EnsembleEditForm from "./EnsembleEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: PageProps) {
  const { id } = await params;

  // microCMSから取得、なければ静的データをフォールバック
  const cms = await getEnsembleContent(id);
  const staticData = getEnsemble(id);

  const initialData = cms
    ? {
        name: cms.name ?? "",
        sub: cms.sub ?? "",
        region: cms.region ?? "",
        regionColor: cms.regionColor ?? "#005F02",
        desc: cms.desc ?? "",
        tagline: cms.tagline ?? "",
        philosophy: cms.philosophy ?? "",
        img: cms.img?.url ?? "",
        activities: cms.activities?.map((a) => ({
          icon: a.icon,
          title: a.title,
          desc: a.desc,
        })) ?? [],
        stats: cms.stats?.map((s) => ({
          label: s.label,
          value: s.value,
        })) ?? [],
      }
    : staticData
    ? {
        name: staticData.name,
        sub: staticData.sub,
        region: staticData.region,
        regionColor: staticData.regionColor,
        desc: staticData.desc,
        tagline: staticData.tagline ?? "",
        philosophy: staticData.philosophy ?? "",
        img: staticData.img,
        activities: staticData.activities?.map((a) => ({
          icon: a.icon,
          title: a.title,
          desc: a.desc,
        })) ?? [],
        stats: staticData.stats?.map((s) => ({
          label: s.label,
          value: s.value,
        })) ?? [],
      }
    : null;

  if (!initialData) {
    return (
      <div className="text-center py-20" style={{ color: "#000000" }}>
        アンサンブルが見つかりませんでした
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <a
          href="/admin"
          className="text-xs transition-colors hover:text-[#005F02]"
          style={{ color: "#000000" }}
        >
          ← ダッシュボード
        </a>
        <span style={{ color: "#000000" }}>/</span>
        <span className="text-xs" style={{ color: "#000000" }}>
          {initialData.name}
        </span>
      </div>

      <EnsembleEditForm id={id} initialData={initialData} hasCMS={!!cms} />
    </div>
  );
}
