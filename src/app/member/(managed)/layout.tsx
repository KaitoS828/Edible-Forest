import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import MemberNav from "../MemberNav";

export default async function ManagedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("fb_session")?.value;

  if (!sessionCookie) {
    redirect("/login?callbackUrl=/member/dashboard");
  }

  let displayName = "";
  let email = "";
  let uid = "";
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
    displayName = decoded.name ?? decoded.email?.split("@")[0] ?? "メンバー";
    email = decoded.email ?? "";
  } catch {
    redirect("/login?callbackUrl=/member/dashboard");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <MemberNav displayName={displayName} email={email} uid={uid} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
