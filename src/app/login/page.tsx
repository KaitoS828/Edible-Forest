"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/member/dashboard";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function postSession(idToken: string): Promise<string> {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json();
    // 初回ログイン（プロフィール未設定）ならセットアップ画面へ
    return data.profileCompleted === false ? "/member/setup" : callbackUrl;
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      const dest = await postSession(token);
      window.location.href = dest;
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="w-full max-w-sm px-4">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <div
              className="text-lg font-bold"
              style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
            >
              食べられる森
            </div>
            <div className="text-xs" style={{ color: "#1A2B1E" }}>
              アンサンブル倶楽部
            </div>
          </a>
        </div>

        <div
          className="bg-white rounded-3xl px-8 py-10"
          style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,95,2,0.15)" }}
        >
          <h1
            className="text-xl font-bold text-center mb-1"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
          >
            ログイン
          </h1>
          <p className="text-xs text-center mb-8" style={{ color: "#1A2B1E" }}>
            メンバーアカウントでログイン
          </p>

          {error && (
            <p className="text-xs text-center mb-4 py-2 px-3 rounded-xl bg-red-50 text-red-600">
              {error}
            </p>
          )}

          <form onSubmit={handleEmail} className="space-y-3">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1.5px solid transparent",
                color: "#3C6B4F",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1.5px solid transparent",
                color: "#3C6B4F",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#3C6B4F" }}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <p className="text-center text-[11px] mt-6" style={{ color: "#1A2B1E" }}>
            アカウントをお持ちでない方は{" "}
            <a href="/signup" className="underline" style={{ color: "#1A2B1E" }}>
              新規登録
            </a>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#1A2B1E" }}>
          <a href="/" className="hover:underline">← サイトトップへ戻る</a>
        </p>
      </div>
    </div>
  );
}
