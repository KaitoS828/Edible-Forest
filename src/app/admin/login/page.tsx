import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CredentialsForm from "./CredentialsForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if ((session?.user as Record<string, unknown> | undefined)?.isAdmin) {
    redirect("/admin");
  }

  const params = searchParams ? await searchParams : {};
  const noPermission = params.error === "no_admin_permission";

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px]">
        <section className="hidden border-r bg-[#0F172A] p-10 text-white lg:flex lg:items-center" style={{ borderColor: "#1E293B" }}>
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight">
              食べられる森 管理画面
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7" style={{ color: "#CBD5E1" }}>
              会員管理、施設審査、公開コンテンツの運用を行うための管理者専用エリアです。
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-[380px]">
            <div className="mb-8 lg:hidden">
              <h1 className="text-2xl font-semibold">食べられる森 管理画面</h1>
            </div>

            <div className="rounded-md border bg-white p-6 shadow-sm" style={{ borderColor: "#DCE3EA" }}>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
                  Sign in
                </p>
                <h2 className="mt-2 text-xl font-semibold" style={{ color: "#0F172A" }}>
                  管理者ログイン
                </h2>
                <p className="mt-2 text-sm leading-6" style={{ color: "#64748B" }}>
                  admin権限を持つFirebaseアカウントのみログインできます。
                </p>
              </div>

              {noPermission && (
                <p className="mb-4 rounded-md border px-3 py-2 text-xs" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#B42318" }}>
                  このアカウントには管理権限がありません。
                </p>
              )}

              <CredentialsForm />
            </div>

            <div className="mt-5 flex items-center justify-between text-xs">
              <a href="/" className="font-medium hover:underline" style={{ color: "#475569" }}>
                公開サイトへ戻る
              </a>
              <span style={{ color: "#94A3B8" }}>Googleログインは使用しません</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
