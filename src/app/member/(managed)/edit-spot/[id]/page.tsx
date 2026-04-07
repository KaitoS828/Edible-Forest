import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getSpotDoc } from "@/lib/firestore";
import SpotForm from "../../../SpotForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSpotPage({ params }: Props) {
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

  const spot = await getSpotDoc(id);
  if (!spot) notFound();
  if (spot.authorId !== uid) redirect("/member/dashboard");

  const { createdAt: _c, updatedAt: _u, ...spotData } = spot;

  return (
    <div>
      <div className="mb-6">
        <a href="/member/dashboard" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1A2B1E" }}>← マイページに戻る</a>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
        拠点を編集
      </h1>
      <SpotForm mode="edit" spotId={id} initialData={spotData as never} authorId={uid} authorName={spot.authorName} />
    </div>
  );
}
