import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getUser } from "@/lib/firestore";
import EnsembleForm from "../../EnsembleForm";

export default async function NewEnsemblePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("fb_session")?.value ?? "";

  let uid = "";
  let authorName = "";
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
    const user = await getUser(uid);
    authorName = user?.displayName ?? decoded.name ?? decoded.email?.split("@")[0] ?? "メンバー";
  } catch {
    redirect("/login?callbackUrl=/member/dashboard");
  }

  return (
    <div>
      <div className="mb-6">
        <a
          href="/member/dashboard"
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ color: "#000000" }}
        >
          ← マイページに戻る
        </a>
      </div>
      <h1
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
      >
        新しいアンサンブルを登録
      </h1>
      <EnsembleForm
        mode="new"
        authorId={uid}
        authorName={authorName}
      />
    </div>
  );
}
