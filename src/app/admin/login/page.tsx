import { signIn } from "@/auth";
import { Logo } from "@/components/Logo";
import CredentialsForm from "./CredentialsForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="w-full max-w-sm">
        <div
          className="bg-white rounded-3xl px-8 py-10 shadow-sm"
          style={{ border: "1px solid rgba(0,95,2,0.15)" }}
        >
          {/* ロゴ */}
          <div className="flex justify-center mb-8">
            <Logo size="md" />
          </div>

          <h1
            className="text-xl font-bold text-center mb-1"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
          >
            管理画面ログイン
          </h1>
          <p className="text-xs text-center mb-8" style={{ color: "#000000" }}>
            メンバーのみアクセスできます
          </p>

          {/* メール・パスワード */}
          <CredentialsForm />

          {/* 区切り線 */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "#005F02" }} />
            <span className="text-xs" style={{ color: "#000000" }}>または</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#005F02" }} />
          </div>

          {/* Google ログイン */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-full text-sm font-medium transition-all hover:opacity-80 border"
              style={{
                backgroundColor: "white",
                color: "#005F02",
                borderColor: "rgba(0,95,2,0.15)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Googleアカウントでログイン
            </button>
          </form>

          <p className="text-center text-[11px] mt-6" style={{ color: "#000000" }}>
            アクセス権限はサイト管理者が付与します
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#000000" }}>
          <a href="/" className="hover:underline">← サイトトップへ戻る</a>
        </p>
      </div>
    </div>
  );
}
