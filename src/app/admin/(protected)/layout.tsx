import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "../AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (!(session.user as Record<string, unknown>).isAdmin) {
    redirect("/admin/login?error=no_admin_permission");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA", color: "#111827" }}>
      <AdminHeader />
      <main className="px-4 py-6 md:ml-64 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1280px]">
          {children}
        </div>
      </main>
    </div>
  );
}
