"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleButton } from "@/components/GoogleButton";
import {
  MemberProfileFields,
  emptyProfileForm,
  validateProfileForm,
  type ProfileFormState,
} from "@/components/MemberProfileFields";

export default function JoinPage() {
  const [profile, setProfile] = useState<ProfileFormState>(emptyProfileForm);
  const [account, setAccount] = useState({ email: "", password: "", password2: "" });
  const [newsletter, setNewsletter] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const fieldError = validateProfileForm(profile, { requireLoginEmail: true });
    if (fieldError) {
      setError(fieldError);
      return;
    }
    if (!account.email.trim()) {
      setError("ログイン用メールアドレスを入力してください");
      return;
    }
    if (account.password !== account.password2) {
      setError("パスワードが一致しません");
      return;
    }
    if (account.password.length < 8) {
      setError("パスワードは8文字以上で設定してください");
      return;
    }
    if (!privacy) return;

    setLoading(true);
    try {
      const displayName = `${profile.lastName} ${profile.firstName}`.trim();
      const cred = await createUserWithEmailAndPassword(auth, account.email, account.password);
      await updateProfile(cred.user, { displayName });
      const idToken = await cred.user.getIdToken(true);

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          profile: {
            registeredAs: profile.registeredAs,
            lastName: profile.lastName,
            firstName: profile.firstName,
            lastNameKana: profile.noKana ? "" : profile.lastNameKana,
            firstNameKana: profile.noKana ? "" : profile.firstNameKana,
            country: profile.country,
            address: profile.address,
            contactEmail: profile.sameAsLogin ? account.email : profile.contactEmail,
            phone: profile.phone,
            interests: profile.interests,
            occupation: profile.occupation,
            comment: profile.comment,
            referrer: profile.referrer,
            operatingBodyName: profile.registeredAs === "organizer" ? profile.operatingBodyName : "",
            facilities: profile.registeredAs === "organizer" ? profile.facilities : [],
          },
        }),
      });
      const data = await res.json();

      // メルマガ購読（任意・デフォルトON）。失敗しても登録フローは止めない。
      if (newsletter) {
        fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: account.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
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

            {error && (
              <p className="text-sm text-center mb-4 py-2 px-3 rounded-xl bg-red-50 text-red-600">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* 種別選択＋全プロフィール項目（2分岐） */}
              <MemberProfileFields form={profile} setForm={setProfile} loginEmail={account.email} />

              {/* アカウント情報 */}
              <div className="rounded-2xl p-5 space-y-3" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                <p className="text-base font-bold" style={{ color: "#3C6B4F" }}>ログイン情報</p>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "#777777" }}>
                    ログイン用メールアドレス<span className="text-red-500"> ＊</span>
                  </label>
                  <input type="email" value={account.email} onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))} required placeholder="your@email.com" className={ic} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "#777777" }}>
                    パスワード（8文字以上）<span className="text-red-500"> ＊</span>
                  </label>
                  <input type="password" value={account.password} onChange={(e) => setAccount((p) => ({ ...p, password: e.target.value }))} required minLength={8} placeholder="8文字以上" className={ic} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "#777777" }}>
                    パスワード（確認）<span className="text-red-500"> ＊</span>
                  </label>
                  <input type="password" value={account.password2} onChange={(e) => setAccount((p) => ({ ...p, password2: e.target.value }))} required placeholder="もう一度入力" className={ic} />
                </div>
              </div>

              {/* メルマガ購読（任意・デフォルトON） */}
              <div className="rounded-2xl p-5 text-base" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
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
                    checked={privacy}
                    onChange={(e) => setPrivacy(e.target.checked)}
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
                disabled={loading || !privacy}
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

const ic = "w-full px-4 py-2.5 rounded-2xl text-base outline-none bg-gray-50 border border-transparent focus:border-green-700 transition-colors";
