import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Logo } from "@/components/Logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* 管理ヘッダー */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b h-14"
        style={{
          backgroundColor: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(8px)",
          borderColor: "rgba(0,95,2,0.15)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/admin">
              <Logo size="sm" />
            </a>
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: "#005F02", color: "white" }}
            >
              管理画面
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs" style={{ color: "#000000" }}>
              {session.user?.email}
            </span>
            <a
              href="/"
              className="text-xs transition-colors hover:text-[#005F02]"
              style={{ color: "#000000" }}
            >
              サイトを見る
            </a>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="text-xs px-4 py-1.5 rounded-full border transition-all hover:bg-[#005F02] hover:text-white"
                style={{ borderColor: "rgba(0,95,2,0.15)", color: "#000000" }}
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="pt-14 max-w-[1200px] mx-auto px-5 lg:px-10 py-10">
        {children}
      </main>
    </div>
  );
}
