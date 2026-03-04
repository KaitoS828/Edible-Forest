"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled") === "1";

  const [form, setForm] = useState({
    lastName: "", firstName: "", lastNameKana: "", firstNameKana: "",
    email: "", phone: "", postalCode: "", address: "",
    motivation: "", privacy: false,
  });
  const [loading, setLoading] = useState(false);

  function update(key: string, val: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.privacy) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: `${form.lastName} ${form.firstName}`,
          metadata: {
            lastNameKana: form.lastNameKana,
            firstNameKana: form.firstNameKana,
            phone: form.phone,
            postalCode: form.postalCode,
            address: form.address,
            motivation: form.motivation,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました");

      // Stripe Checkout ページへリダイレクト
      window.location.href = data.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "エラーが発生しました。もう一度お試しください。");
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">
        <section className="py-14 md:py-20">
          <div className="max-w-[680px] mx-auto px-5">

            {/* キャンセル通知 */}
            {canceled && (
              <div
                className="mb-6 p-4 rounded-2xl text-sm"
                style={{ backgroundColor: "rgba(0,95,2,0.05)", border: "1px solid rgba(0,95,2,0.2)", color: "#005F02" }}
              >
                お支払いがキャンセルされました。もう一度お試しください。
              </div>
            )}

            {/* ページヘッダー */}
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-medium px-4 mb-4" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#005F02", color: "white" }}>
                会員登録
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
                食べられる森アンサンブル倶楽部<br />会員登録フォーム
              </h1>
              <p className="text-sm" style={{ color: "#000000" }}>
                月会費 ¥1,000（税込）/ 月
              </p>
            </div>

            {/* 会費説明 */}
            <div className="bg-white rounded-2xl p-5 mb-6 text-sm" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
              <p className="font-medium mb-2" style={{ color: "#005F02" }}>会員特典</p>
              <ul className="space-y-1.5" style={{ color: "#000000" }}>
                <li>✓ 全国の会員限定拠点・イベントへのアクセス</li>
                <li>✓ 会員コミュニティへの参加</li>
                <li>✓ 活動レポートの閲覧</li>
                <li>✓ 会員限定の宿泊料金</li>
              </ul>
              <p className="text-xs mt-3 pt-3 border-t" style={{ color: "#000000", borderColor: "rgba(0,95,2,0.15)" }}>
                ※ お支払いはクレジットカード決済（Stripe）にて行います。いつでも解約できます。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 氏名 */}
              <FormSection title="お名前">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="姓">
                    <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required placeholder="山田" className={ic} />
                  </Field>
                  <Field label="名">
                    <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required placeholder="太郎" className={ic} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="姓（フリガナ）">
                    <input value={form.lastNameKana} onChange={(e) => update("lastNameKana", e.target.value)} required placeholder="ヤマダ" className={ic} />
                  </Field>
                  <Field label="名（フリガナ）">
                    <input value={form.firstNameKana} onChange={(e) => update("firstNameKana", e.target.value)} required placeholder="タロウ" className={ic} />
                  </Field>
                </div>
              </FormSection>

              {/* 連絡先 */}
              <FormSection title="連絡先">
                <Field label="メールアドレス">
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="your@email.com" className={ic} />
                </Field>
                <Field label="電話番号">
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="090-0000-0000" className={ic} />
                </Field>
              </FormSection>

              {/* 住所 */}
              <FormSection title="ご住所">
                <Field label="郵便番号">
                  <input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="000-0000" className={ic} style={{ maxWidth: "180px" }} />
                </Field>
                <Field label="住所">
                  <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="都道府県・市区町村・番地" className={ic} />
                </Field>
              </FormSection>

              {/* 参加動機 */}
              <FormSection title="参加動機（任意）">
                <textarea value={form.motivation} onChange={(e) => update("motivation", e.target.value)} rows={3} placeholder="入会を希望した理由やご興味のあることをお聞かせください" className={ic} />
              </FormSection>

              {/* プライバシーポリシー */}
              <div className="bg-white rounded-2xl p-5 text-sm" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                <p className="font-medium mb-2" style={{ color: "#005F02" }}>注意事項・プライバシーポリシー</p>
                <ul className="space-y-1 text-xs mb-4" style={{ color: "#000000" }}>
                  <li>・月会費 ¥1,000（税込）が毎月ご登録のお支払い方法より引き落とされます</li>
                  <li>・解約はいつでもマイページよりお手続きいただけます</li>
                  <li>・ご入力いただいた個人情報は、サービス提供・ご連絡のみに使用します</li>
                  <li>・<a href="/contact" className="underline" style={{ color: "#000000" }}>プライバシーポリシー</a>をお読みの上、同意してください</li>
                </ul>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.privacy}
                    onChange={(e) => update("privacy", e.target.checked)}
                    className="mt-0.5 accent-green-700"
                    required
                  />
                  <span className="text-sm" style={{ color: "#005F02" }}>
                    注意事項およびプライバシーポリシーに同意します
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !form.privacy}
                className="w-full py-4 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#005F02" }}
              >
                {loading ? "送信中..." : "お支払いへ進む（月 ¥1,000）"}
              </button>

              <p className="text-center text-xs" style={{ color: "#000000" }}>
                ※ 次の画面でクレジットカード情報を入力します（Stripe 決済）
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
    <div className="bg-white rounded-2xl p-5 space-y-3" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
      <p className="text-sm font-bold" style={{ color: "#005F02" }}>{title}</p>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "#777777" }}>{label}</label>
      {children}
    </div>
  );
}
const ic = "w-full px-4 py-2.5 rounded-2xl text-sm outline-none bg-gray-50 border border-transparent focus:border-green-700 transition-colors";
