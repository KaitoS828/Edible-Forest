"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/member/dashboard";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function postSession(idToken: string) {
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      await postSession(token);
      window.location.href = callbackUrl;
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const token = await cred.user.getIdToken();
      await postSession(token);
      window.location.href = callbackUrl;
    } catch {
      setError("Googleログインに失敗しました");
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
              style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
            >
              食べられる森
            </div>
            <div className="text-xs" style={{ color: "#000000" }}>
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
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
          >
            ログイン
          </h1>
          <p className="text-xs text-center mb-8" style={{ color: "#000000" }}>
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
                color: "#005F02",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#005F02")}
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
                color: "#005F02",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#005F02")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#005F02" }}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "#005F02" }} />
            <span className="text-xs" style={{ color: "#000000" }}>または</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#005F02" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full text-sm font-medium transition-all hover:opacity-80 disabled:opacity-60 border"
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

          <p className="text-center text-[11px] mt-6" style={{ color: "#000000" }}>
            アカウントをお持ちでない方は{" "}
            <a href="/signup" className="underline" style={{ color: "#000000" }}>
              新規登録
            </a>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#000000" }}>
          <a href="/" className="hover:underline">← サイトトップへ戻る</a>
        </p>
      </div>
    </div>
  );
}
