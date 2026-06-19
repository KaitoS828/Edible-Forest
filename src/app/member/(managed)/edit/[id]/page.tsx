import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getEnsembleDoc } from "@/lib/firestore";
import EnsembleForm from "../../../EnsembleForm";
import { LanguageTabs } from "@/components/admin/LanguageTabs";
import type { SiteLocale } from "@/data/siteSettings";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function EditEnsemblePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { lang: langParam } = await searchParams;
  const locale: SiteLocale = langParam === "en" ? "en" : "ja";

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("fb_session")?.value ?? "";

  let uid = "";
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
  } catch {
    redirect("/login?callbackUrl=/member/dashboard");
  }

  const ensemble = await getEnsembleDoc(id);
  if (!ensemble) notFound();
  if (ensemble.authorId !== uid) redirect("/member/dashboard");

  const { createdAt: _c, updatedAt: _u, ...ensembleData } = ensemble;
  const t = ensembleData.translations?.en;

  // 英語モードなら翻訳データを優先
  const displayData = locale === "en"
    ? {
        ...ensembleData,
        name: t?.name ?? ensembleData.name,
        sub: t?.sub ?? ensembleData.sub,
        desc: t?.desc ?? ensembleData.desc,
        tagline: t?.tagline ?? ensembleData.tagline,
        philosophy: t?.philosophy ?? ensembleData.philosophy,
        travelConditions: t?.travelConditions ?? ensembleData.travelConditions,
      }
    : ensembleData;

  return (
    <div>
      <div className="mb-6">
        <a href="/member/dashboard" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1A2B1E" }}>
          ← マイページに戻る
        </a>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
          アンサンブルを編集
        </h1>
        <LanguageTabs baseHref={`/member/edit/${id}`} locale={locale} />
      </div>
      <EnsembleForm
        mode="edit"
        ensembleId={id}
        initialData={displayData as never}
        authorId={uid}
        authorName={ensemble.authorName}
        locale={locale}
      />
    </div>
  );
}
