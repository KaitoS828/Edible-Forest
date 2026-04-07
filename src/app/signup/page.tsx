"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [password2, setPassword2]     = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  async function postSession(idToken: string) {
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("パスワードが一致しません");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上で設定してください");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      const token = await cred.user.getIdToken(true);
      await postSession(token);
      window.location.href = "/member";
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("email-already-in-use")) {
        setError("このメールアドレスはすでに登録されています");
      } else {
        setError("登録に失敗しました。もう一度お試しください");
      }
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
      window.location.href = "/member";
    } catch {
      setError("Googleログインに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12"
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
            新規メンバー登録
          </h1>
          <p className="text-xs text-center mb-8" style={{ color: "#1A2B1E" }}>
            アンサンブル倶楽部に参加する
          </p>

          {error && (
            <p className="text-xs text-center mb-4 py-2 px-3 rounded-xl bg-red-50 text-red-600">
              {error}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            <input
              type="text"
              placeholder="お名前（表示名）"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ backgroundColor: "#FFFFFF", border: "1.5px solid transparent", color: "#3C6B4F" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ backgroundColor: "#FFFFFF", border: "1.5px solid transparent", color: "#3C6B4F" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <input
              type="password"
              placeholder="パスワード（8文字以上）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ backgroundColor: "#FFFFFF", border: "1.5px solid transparent", color: "#3C6B4F" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <input
              type="password"
              placeholder="パスワード（確認）"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ backgroundColor: "#FFFFFF", border: "1.5px solid transparent", color: "#3C6B4F" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#3C6B4F" }}
            >
              {loading ? "登録中..." : "メンバー登録"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "#3C6B4F" }} />
            <span className="text-xs" style={{ color: "#1A2B1E" }}>または</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#3C6B4F" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full text-sm font-medium transition-all hover:opacity-80 disabled:opacity-60 border"
            style={{
              backgroundColor: "white",
              color: "#3C6B4F",
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
            Googleアカウントで登録
          </button>

          <p className="text-center text-[11px] mt-6" style={{ color: "#1A2B1E" }}>
            すでにアカウントをお持ちの方は{" "}
            <a href="/login" className="underline" style={{ color: "#1A2B1E" }}>
              ログイン
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
