"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleButton } from "@/components/GoogleButton";

export default function JoinPage() {
  const [form, setForm] = useState({
    lastName: "", firstName: "",
    email: "", password: "", password2: "",
    region: "", phone: "", motivation: "",
    newsletter: true, privacy: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(key: string, val: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.password2) {
      setError("パスワードが一致しません");
      return;
    }
    if (form.password.length < 8) {
      setError("パスワードは8文字以上で設定してください");
      return;
    }
    if (!form.privacy) return;

    setLoading(true);
    try {
      const displayName = `${form.lastName} ${form.firstName}`.trim();
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName });
      const idToken = await cred.user.getIdToken(true);

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          profile: {
            region: form.region,
            phone: form.phone,
            motivation: form.motivation,
          },
        }),
      });
      const data = await res.json();

      // メルマガ購読（任意・デフォルトON）。失敗しても登録フローは止めない。
      if (form.newsletter) {
        fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
          }),
        }).catch(() => {});
      }

      window.location.href = data.profileCompleted === false ? "/member/setup" : "/member/dashboard";
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("email-already-in-use")) {
        setError("このメールアドレスはすでに登録されています");
      } else {
        setError("登録に失敗しました。もう一度お試しください");
      }
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">
        <section className="py-14 md:py-20">
          <div className="max-w-[680px] mx-auto px-5">

            <div className="text-center mb-10">
              <span className="inline-block text-sm font-medium px-4 mb-4" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}>
                倶楽部に参加する
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                アンサンブル倶楽部～食べられる森を目指して～<br />参加登録（無料）
              </h1>
              <p className="text-base" style={{ color: "#1A2B1E" }}>
                登録は無料です。参加費が発生するのはイベント参加時のみ。
              </p>
            </div>

            <div className="rounded-2xl p-5 mb-6 text-base" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
              <p className="font-medium mb-2" style={{ color: "#3C6B4F" }}>登録するとできること</p>
              <ul className="space-y-1.5" style={{ color: "#1A2B1E" }}>
                <li>✓ 各地のアンサンブル（イベント）の案内が届きます</li>
                <li>✓ 気になるイベントに参加できます（参加費は各イベントごと）</li>
                <li>✓ 各地のローカルコミュニティとつながれます</li>
              </ul>
            </div>

            {error && (
              <p className="text-sm text-center mb-4 py-2 px-3 rounded-xl bg-red-50 text-red-600">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* お名前 */}
              <FormSection title="お名前">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="姓">
                    <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required placeholder="山田" className={ic} />
                  </Field>
                  <Field label="名">
                    <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required placeholder="太郎" className={ic} />
                  </Field>
                </div>
              </FormSection>

              {/* アカウント情報 */}
              <FormSection title="アカウント情報">
                <Field label="メールアドレス">
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="your@email.com" className={ic} />
                </Field>
                <Field label="パスワード（8文字以上）">
                  <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={8} placeholder="8文字以上" className={ic} />
                </Field>
                <Field label="パスワード（確認）">
                  <input type="password" value={form.password2} onChange={(e) => update("password2", e.target.value)} required placeholder="もう一度入力" className={ic} />
                </Field>
              </FormSection>

              {/* お住まいの地域（任意） */}
              <FormSection title="お住まいの地域（任意）">
                <Field label="地域">
                  <input value={form.region} onChange={(e) => update("region", e.target.value)} placeholder="例：北海道広尾町" className={ic} />
                </Field>
              </FormSection>

              {/* 連絡先（任意） */}
              <FormSection title="電話番号（任意）">
                <Field label="電話番号">
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="090-0000-0000" className={ic} />
                </Field>
              </FormSection>

              {/* 参加動機（任意） */}
              <FormSection title="参加動機（任意）">
                <textarea value={form.motivation} onChange={(e) => update("motivation", e.target.value)} rows={3} placeholder="興味のあることや、参加したいアンサンブルがあればお聞かせください" className={ic} />
              </FormSection>

              {/* メルマガ購読（任意・デフォルトON） */}
              <div className="rounded-2xl p-5 text-base" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={(e) => update("newsletter", e.target.checked)}
                    className="mt-0.5 accent-green-700"
                  />
                  <span className="text-base" style={{ color: "#1A2B1E" }}>
                    メルマガを受け取る（イベント情報・各地の便りをお届けします）
                  </span>
                </label>
              </div>

              {/* プライバシー */}
              <div className="rounded-2xl p-5 text-base" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                <ul className="space-y-1 text-sm mb-4" style={{ color: "#1A2B1E" }}>
                  <li>・参加登録に費用はかかりません</li>
                  <li>・ご入力いただいた個人情報は、サービス提供・ご連絡のみに使用します</li>
                </ul>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.privacy}
                    onChange={(e) => update("privacy", e.target.checked)}
                    className="mt-0.5 accent-green-700"
                    required
                  />
                  <span className="text-base" style={{ color: "#3C6B4F" }}>
                    注意事項およびプライバシーポリシーに同意します
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !form.privacy}
                className="w-full py-4 rounded-full text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#3C6B4F" }}
              >
                {loading ? "登録中..." : "無料で登録する"}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(60,107,79,0.15)" }} />
                <span className="text-xs" style={{ color: "#1A2B1E", opacity: 0.5 }}>または</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(60,107,79,0.15)" }} />
              </div>

              <GoogleButton callbackUrl="/member/dashboard" />

              <p className="text-center text-sm" style={{ color: "#1A2B1E" }}>
                すでにアカウントをお持ちの方は{" "}
                <a href="/login" className="underline" style={{ color: "#3C6B4F" }}>ログイン</a>
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 space-y-3" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
      <p className="text-base font-bold" style={{ color: "#3C6B4F" }}>{title}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm mb-1.5" style={{ color: "#777777" }}>{label}</label>
      {children}
    </div>
  );
}

const ic = "w-full px-4 py-2.5 rounded-2xl text-base outline-none bg-gray-50 border border-transparent focus:border-green-700 transition-colors";
