import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { AdminHeader } from "../AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("fb_session")?.value;

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    if (!decoded.admin) {
      redirect("/?error=no_admin_permission");
    }
  } catch {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <AdminHeader />
      <main className="pt-14 max-w-[1200px] mx-auto px-5 lg:px-10 py-10">
        {children}
      </main>
    </div>
  );
}
