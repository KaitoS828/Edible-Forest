"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { CmsPageFormData, SlideForm } from "./formData";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { SiteLocale } from "@/data/siteSettings";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-40 rounded-md bg-white" /> }
);

export default function CmsPageForm({
  pageId,
  initialData,
  locale = "ja",
}: {
  pageId: string;
  initialData: CmsPageFormData;
  locale?: SiteLocale;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTop = pageId === "top";

  function set<K extends keyof CmsPageFormData>(key: K, value: CmsPageFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function setSlide(index: number, key: keyof SlideForm, value: string) {
    const slides = [...form.slides];
    slides[index] = { ...slides[index], [key]: value };
    set("slides", slides);
  }

  function addSlide() {
    set("slides", [...form.slides, { fieldId: String(Date.now()), imageUrl: "", label: "", title: "", link: "", linkLabel: "" }]);
  }

  function removeSlide(index: number) {
    set("slides", form.slides.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cms/pages/${pageId}?lang=${locale}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("保存に失敗しました");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:border-slate-500";
  const inputStyle = { borderColor: "#CBD5E1", backgroundColor: "#FFFFFF", color: "#0F172A" };

  return (
    <form onSubmit={handleSubmit} className="max-w-[920px] space-y-5">
      {(error || saved) && (
        <div className="rounded-md border px-4 py-3 text-sm" style={{ borderColor: error ? "#FECACA" : "#BBF7D0", backgroundColor: error ? "#FEF2F2" : "#F0FDF4", color: error ? "#B42318" : "#166534" }}>
          {error ?? "保存しました"}
        </div>
      )}

      <LanguageTabs baseHref={`/admin/cms/pages/${pageId}`} locale={locale} />

      {isTop ? (
        <>
          <Section title="コンセプト訴求（トップ右カラム）">
            <Field label="小見出し">
              <input className={inputClass} style={inputStyle} value={form.conceptTag} onChange={(e) => set("conceptTag", e.target.value)} />
            </Field>
            <Field label="タイトル（改行で改行されます）">
              <textarea rows={2} className={inputClass} style={inputStyle} value={form.conceptTitle} onChange={(e) => set("conceptTitle", e.target.value)} />
            </Field>
            <Field label="リンクラベル">
              <input className={inputClass} style={inputStyle} value={form.conceptLinkLabel} onChange={(e) => set("conceptLinkLabel", e.target.value)} />
            </Field>
          </Section>

          <Section title="セクション見出し">
            <Field label="「旅に出よう」セクション見出し">
              <input className={inputClass} style={inputStyle} value={form.forestSectionTitle} onChange={(e) => set("forestSectionTitle", e.target.value)} />
            </Field>
            <Field label="「アンサンブル」セクション見出し">
              <input className={inputClass} style={inputStyle} value={form.ensembleSectionTitle} onChange={(e) => set("ensembleSectionTitle", e.target.value)} />
            </Field>
          </Section>
        </>
      ) : (
        <>
          <Section title="基本情報">
            <Field label="ヒーロータイトル">
              <input className={inputClass} style={inputStyle} value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
            </Field>
            <Field label="ヒーロー補足">
              <input className={inputClass} style={inputStyle} value={form.heroCaption} onChange={(e) => set("heroCaption", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="コンセプトタグ">
                <input className={inputClass} style={inputStyle} value={form.conceptTag} onChange={(e) => set("conceptTag", e.target.value)} />
              </Field>
              <Field label="コンセプトリンクラベル">
                <input className={inputClass} style={inputStyle} value={form.conceptLinkLabel} onChange={(e) => set("conceptLinkLabel", e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="本文">
            <RichTextEditor content={form.body} onChange={(html) => set("body", html)} placeholder="ページ本文を入力してください" />
          </Section>
        </>
      )}

      <Section title="スライド/ギャラリー">
        <div className="space-y-4">
          {form.slides.map((slide, index) => (
            <div key={slide.fieldId} className="rounded-md border p-4" style={{ borderColor: "#E5EAF0" }}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold" style={{ color: "#64748B" }}>スライド {index + 1}</p>
                <button type="button" onClick={() => removeSlide(index)} className="text-xs font-medium" style={{ color: "#B42318" }}>削除</button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <ImageUpload label="画像" value={slide.imageUrl} onChange={(url) => setSlide(index, "imageUrl", url)} />
                <Field label="ラベル">
                  <input className={inputClass} style={inputStyle} value={slide.label} onChange={(e) => setSlide(index, "label", e.target.value)} />
                </Field>
                <Field label="タイトル">
                  <input className={inputClass} style={inputStyle} value={slide.title} onChange={(e) => setSlide(index, "title", e.target.value)} />
                </Field>
                <Field label="リンク">
                  <input className={inputClass} style={inputStyle} value={slide.link} onChange={(e) => setSlide(index, "link", e.target.value)} />
                </Field>
                <Field label="リンクラベル">
                  <input className={inputClass} style={inputStyle} value={slide.linkLabel} onChange={(e) => setSlide(index, "linkLabel", e.target.value)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSlide} className="rounded-md border px-3 py-2 text-sm font-medium" style={{ borderColor: "#CBD5E1", color: "#334155" }}>
          スライドを追加
        </button>
      </Section>

      <Section title="公開設定">
        <label className="flex items-center gap-2 text-sm" style={{ color: "#334155" }}>
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
          公開ページで使用する
        </label>
      </Section>

      <div className="flex justify-end gap-3 border-t pt-5" style={{ borderColor: "#DCE3EA" }}>
        <a href="/admin/cms/pages" className="rounded-md border px-4 py-2 text-sm font-medium" style={{ borderColor: "#CBD5E1", color: "#334155", backgroundColor: "#FFFFFF" }}>戻る</a>
        <button type="submit" disabled={saving} className="rounded-md px-5 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ backgroundColor: "#0F172A" }}>
          {saving ? "保存中..." : locale === "en" ? "英語版を保存" : "日本語版を保存"}
        </button>
      </div>
    </form>
  );
}

function LanguageTabs({ baseHref, locale }: { baseHref: string; locale: SiteLocale }) {
  const tabs = [
    { locale: "ja" as const, label: "日本語", href: baseHref },
    { locale: "en" as const, label: "English", href: `${baseHref}?lang=en` },
  ];

  return (
    <div className="flex flex-wrap gap-2 rounded-md border bg-white p-2" style={{ borderColor: "#DCE3EA" }}>
      {tabs.map((tab) => {
        const active = tab.locale === locale;
        return (
          <a
            key={tab.locale}
            href={tab.href}
            className="rounded-md px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: active ? "#0F172A" : "#FFFFFF",
              border: `1px solid ${active ? "#0F172A" : "#CBD5E1"}`,
              color: active ? "#FFFFFF" : "#334155",
            }}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-md border bg-white p-5" style={{ borderColor: "#DCE3EA" }}>
      <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium" style={{ color: "#64748B" }}>{label}</span>
      {children}
    </label>
  );
}
