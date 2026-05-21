"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/member/dashboard";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched]   = useState({ email: false, password: false });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // パスワードリセット
  const [resetMode, setResetMode]       = useState(false);
  const [resetEmail, setResetEmail]     = useState("");
  const [resetTouched, setResetTouched] = useState(false);
  const [resetSent, setResetSent]       = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError]     = useState("");

  // バリデーション
  const emailError    = !email ? "メールアドレスを入力してください" : !EMAIL_RE.test(email) ? "正しいメールアドレスを入力してください" : "";
  const passwordError = !password ? "パスワードを入力してください" : password.length < 8 ? "パスワードは8文字以上です" : "";
  const resetEmailError = !resetEmail ? "メールアドレスを入力してください" : !EMAIL_RE.test(resetEmail) ? "正しいメールアドレスを入力してください" : "";

  async function postSession(idToken: string): Promise<string> {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "ログインに失敗しました");
    return data.profileCompleted === false ? "/member/setup" : callbackUrl;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;

    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      const dest = await postSession(token);
      window.location.href = dest;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found")) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else if (msg.includes("too-many-requests")) {
        setError("ログイン試行が多すぎます。しばらくしてから再度お試しください");
      } else {
        setError(msg || "ログインに失敗しました");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetTouched(true);
    if (resetEmailError) return;

    setResetError("");
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch {
      setResetError("送信に失敗しました。メールアドレスを確認してください");
    } finally {
      setResetLoading(false);
    }
  }

  const fieldBase = "w-full px-4 py-3 rounded-2xl text-base outline-none transition-all";
  const fieldStyle = (hasError: boolean, isTouched: boolean) =>
    `${fieldBase} ${hasError && isTouched
      ? "border-2 border-red-400 bg-red-50"
      : "border border-transparent bg-gray-50 focus:border-[#3C6B4F] focus:bg-white"}`;

  return (
    <div className="min-h-screen flex items-center justify-center py-12" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="w-full max-w-sm px-4">

        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <div className="text-xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>食べられる森</div>
            <div className="text-sm" style={{ color: "#1A2B1E" }}>アンサンブル倶楽部</div>
          </a>
        </div>

        <div className="bg-white rounded-3xl px-8 py-10" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,95,2,0.15)" }}>

          {/* ── パスワードリセットモード ── */}
          {resetMode ? (
            <>
              <button
                onClick={() => { setResetMode(false); setResetSent(false); setResetError(""); setResetTouched(false); setResetEmail(""); }}
                className="flex items-center gap-1 text-sm mb-5 transition-opacity hover:opacity-70"
                style={{ color: "#3C6B4F" }}
              >
                ← ログインに戻る
              </button>

              <h2 className="text-xl font-bold text-center mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                パスワードをリセット
              </h2>
              <p className="text-sm text-center mb-6" style={{ color: "#1A2B1E", opacity: 0.65 }}>
                登録済みのメールアドレスにリセットリンクを送信します
              </p>

              {resetSent ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">📬</div>
                  <p className="text-base font-medium mb-1" style={{ color: "#3C6B4F" }}>送信しました</p>
                  <p className="text-sm" style={{ color: "#1A2B1E", opacity: 0.65 }}>
                    {resetEmail} にリセットリンクを送りました。メールボックスをご確認ください。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="登録済みのメールアドレス"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      onBlur={() => setResetTouched(true)}
                      className={fieldStyle(!!resetEmailError, resetTouched)}
                      style={{ color: "#1A2B1E" }}
                    />
                    {resetTouched && resetEmailError && (
                      <p className="text-xs mt-1.5 ml-1" style={{ color: "#ef4444" }}>{resetEmailError}</p>
                    )}
                    {resetError && (
                      <p className="text-xs mt-1.5 ml-1" style={{ color: "#ef4444" }}>{resetError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3 rounded-full text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: "#3C6B4F" }}
                  >
                    {resetLoading ? "送信中..." : "リセットリンクを送信"}
                  </button>
                </form>
              )}
            </>
          ) : (

          /* ── ログインモード ── */
          <>
            <h1 className="text-2xl font-bold text-center mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              ログイン
            </h1>
            <p className="text-sm text-center mb-7" style={{ color: "#1A2B1E", opacity: 0.6 }}>
              メンバーアカウントでログイン
            </p>

            {error && (
              <div className="mb-4 px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200">
                <p className="text-sm text-center text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: "#555" }}>メールアドレス</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={fieldStyle(!!emailError, touched.email)}
                  style={{ color: "#1A2B1E" }}
                />
                {touched.email && emailError && (
                  <p className="text-xs mt-1.5 ml-1" style={{ color: "#ef4444" }}>{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium ml-1" style={{ color: "#555" }}>パスワード</label>
                  <button
                    type="button"
                    onClick={() => { setResetMode(true); setResetEmail(email); }}
                    className="text-xs transition-opacity hover:opacity-70"
                    style={{ color: "#3C6B4F" }}
                  >
                    パスワードを忘れた方
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="8文字以上"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className={fieldStyle(!!passwordError, touched.password)}
                  style={{ color: "#1A2B1E" }}
                />
                {touched.password && passwordError && (
                  <p className="text-xs mt-1.5 ml-1" style={{ color: "#ef4444" }}>{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
                style={{ backgroundColor: "#3C6B4F" }}
              >
                {loading ? "ログイン中..." : "ログイン"}
              </button>
            </form>

            <p className="text-center text-xs mt-6" style={{ color: "#1A2B1E" }}>
              アカウントをお持ちでない方は{" "}
              <a href="/join" className="underline font-medium transition-opacity hover:opacity-70" style={{ color: "#3C6B4F" }}>
                無料登録
              </a>
            </p>
          </>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "#1A2B1E" }}>
          <a href="/" className="hover:underline">← サイトトップへ戻る</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
