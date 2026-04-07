"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", privacy: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(key: string, val: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: メール送信 or Firestore 保存
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div style={{ backgroundColor: "#FFFFFF" }}>
        <Header />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              お問い合わせを受け付けました
            </h1>
            <p className="text-sm mb-8" style={{ color: "#1A2B1E" }}>
              内容を確認し、3営業日以内にご連絡いたします。
            </p>
            <a href="/" className="text-sm" style={{ color: "#1A2B1E" }}>← トップへ戻る</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">
        <section className="py-14 md:py-20">
          <div className="max-w-[600px] mx-auto px-5">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-medium px-4 mb-4" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}>
                お問い合わせ
              </span>
              <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                お問い合わせ・ご連絡
              </h1>
              <p className="text-sm" style={{ color: "#1A2B1E" }}>
                食べられる森アンサンブル倶楽部に関するお問い合わせはこちらから。<br />
                3営業日以内にご返信いたします。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 space-y-4" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
              <Field label="お名前">
                <input value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="山田 太郎" className={ic} />
              </Field>
              <Field label="メールアドレス">
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="your@email.com" className={ic} />
              </Field>
              <Field label="件名">
                <select value={form.subject} onChange={(e) => update("subject", e.target.value)} required className={ic}>
                  <option value="">選択してください</option>
                  <option>会員登録について</option>
                  <option>イベント・アンサンブルについて</option>
                  <option>宿泊拠点について</option>
                  <option>取材・メディアのご依頼</option>
                  <option>その他</option>
                </select>
              </Field>
              <Field label="メッセージ">
                <textarea value={form.message} onChange={(e) => update("message", e.target.value)} required rows={5} placeholder="お問い合わせ内容をご記入ください" className={ic} />
              </Field>

              {/* プライバシーポリシー */}
              <div className="pt-2 pb-1">
                <div className="text-xs p-4 rounded-xl mb-3" style={{ backgroundColor: "#FFFFFF", color: "#1A2B1E" }}>
                  <p className="font-medium mb-1" style={{ color: "#3C6B4F" }}>プライバシーポリシー</p>
                  <p>ご入力いただいた個人情報は、お問い合わせへの返答のみに使用し、第三者への提供は行いません。</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.privacy} onChange={(e) => update("privacy", e.target.checked)} required className="mt-0.5 accent-green-700" />
                  <span className="text-sm" style={{ color: "#3C6B4F" }}>プライバシーポリシーに同意します</span>
                </label>
              </div>

              <button type="submit" disabled={loading || !form.privacy} className="w-full py-3.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#3C6B4F" }}>
                {loading ? "送信中..." : "送信する"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#777777" }}>{label}</label>
      {children}
    </div>
  );
}
const ic = "w-full px-4 py-2.5 rounded-2xl text-sm outline-none bg-gray-50 border border-transparent focus:border-green-700 transition-colors";
