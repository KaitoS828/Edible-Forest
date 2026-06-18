"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleButton } from "@/components/GoogleButton";

function SignupEntry() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/member/dashboard";
  const q = sp.get("callbackUrl") ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";

  return (
    <div className="min-h-screen flex items-center" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="w-full max-w-[1100px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center py-16">

        {/* 左：ようこそ */}
        <div>
          <a href="/" className="inline-block mb-10">
            <div className="text-2xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>食べられる森</div>
            <div className="text-sm" style={{ color: "#1A2B1E" }}>アンサンブル倶楽部</div>
          </a>
          <h1
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#1A2B1E", lineHeight: 1.4 }}
          >
            ようこそ
          </h1>
          <div className="space-y-4 text-base" style={{ color: "#1A2B1E", lineHeight: 1.9 }}>
            <p>食べられる森アンサンブル倶楽部は、全国各地で「食べる・育てる・つながる」暮らしを実験するコミュニティです。</p>
            <p>会員登録すると、各地のアンサンブル（イベント）に参加したり、活動の輪を広げていけます。</p>
            <p>いっしょに、食べられる森を育てていきましょう。</p>
          </div>
        </div>

        {/* 右：登録カード */}
        <div className="w-full max-w-sm mx-auto md:mx-0">
          <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
            会員登録
          </h2>

          <div
            className="rounded-3xl p-6 space-y-3"
            style={{ border: "1px solid rgba(60,107,79,0.15)", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
          >
            {/* メールで登録 → 詳細フォーム */}
            <a
              href={`/join${q}`}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-full text-base font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#3C6B4F" }}
            >
              <MailIcon />
              メールで登録
            </a>

            {/* Googleで登録 */}
            <GoogleButton callbackUrl={callbackUrl} label="Googleで登録" />
          </div>

          {/* ログイン誘導 */}
          <p className="text-center text-sm mt-6" style={{ color: "#1A2B1E" }}>
            すでにアカウントをお持ちの方は{" "}
            <a
              href={`/login${q}`}
              className="underline font-medium transition-opacity hover:opacity-70"
              style={{ color: "#3C6B4F" }}
            >
              ログインはこちら
            </a>
          </p>

          <p className="text-center text-sm mt-8" style={{ color: "#1A2B1E", opacity: 0.6 }}>
            <a href="/" className="hover:underline">← サイトトップへ戻る</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 6 10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupEntry />
    </Suspense>
  );
}
