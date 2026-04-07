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
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
          >
            管理画面ログイン
          </h1>
          <p className="text-xs text-center mb-8" style={{ color: "#1A2B1E" }}>
            メンバーのみアクセスできます
          </p>

          {/* メール・パスワード */}
          <CredentialsForm />

          <p className="text-center text-[11px] mt-6" style={{ color: "#1A2B1E" }}>
            アクセス権限はサイト管理者が付与します
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#1A2B1E" }}>
          <a href="/" className="hover:underline">← サイトトップへ戻る</a>
        </p>
      </div>
    </div>
  );
}
