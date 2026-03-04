import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getEnsembleDoc } from "@/lib/firestore";
import EnsembleForm from "../../../EnsembleForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEnsemblePage({ params }: Props) {
  const { id } = await params;

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

  return (
    <div>
      <div className="mb-6">
        <a href="/member/dashboard" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#000000" }}>
          ← マイページに戻る
        </a>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
        アンサンブルを編集
      </h1>
      <EnsembleForm
        mode="edit"
        ensembleId={id}
        initialData={ensembleData as never}
        authorId={uid}
        authorName={ensemble.authorName}
      />
    </div>
  );
}
