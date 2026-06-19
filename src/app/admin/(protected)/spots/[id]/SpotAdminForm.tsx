"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { SiteLocale } from "@/data/siteSettings";
import { ImageUpload } from "@/components/admin/ImageUpload";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-40 rounded-md bg-white" /> }
);

export type SpotAdminFormData = {
  name: string;
  sub: string;
  region: string;
  regionColor: string;
  forestType: string;
  desc: string;
  content: string;
  img: string;
  address: string;
  capacity: string;
  price: string;
  access: string;
  bookingUrl: string;
  active: boolean;
  status: "draft" | "published";
  isOfficial: boolean;
};

const REGIONS = ["北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州・沖縄"];
const FOREST_TYPES = ["海の森", "川と森", "山の森", "砂丘の森", "都市の森", "牧畜の森", "里の森"];

export default function SpotAdminForm({
  id,
  initialData,
  locale = "ja",
}: {
  id: string;
  initialData: SpotAdminFormData;
  locale?: SiteLocale;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SpotAdminFormData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function set<K extends keyof SpotAdminFormData>(key: K, value: SpotAdminFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/spots/${id}${locale === "en" ? "?lang=en" : ""}`, {
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

  async function handleDelete() {
    if (!window.confirm("この宿泊施設を削除しますか？")) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/spots/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      router.push("/admin/spots");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
      setDeleting(false);
    }
  }

  const inputClass = "w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:border-slate-500";
  const inputStyle = { borderColor: "#CBD5E1", backgroundColor: "#FFFFFF", color: "#0F172A" };
  const labelClass = "mb-1.5 block text-xs font-medium";

  return (
    <form onSubmit={handleSubmit} className="max-w-[920px] space-y-5">
      {(error || saved) && (
        <div
          className="rounded-md border px-4 py-3 text-sm"
          style={{
            borderColor: error ? "#FECACA" : "#BBF7D0",
            backgroundColor: error ? "#FEF2F2" : "#F0FDF4",
            color: error ? "#B42318" : "#166534",
          }}
        >
          {error ?? "保存しました"}
        </div>
      )}

      <Section title="基本情報">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="施設名" labelClass={labelClass}>
            <input className={inputClass} style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </Field>
          <Field label="サブタイトル" labelClass={labelClass}>
            <input className={inputClass} style={inputStyle} value={form.sub} onChange={(e) => set("sub", e.target.value)} />
          </Field>
          <Field label="地域" labelClass={labelClass}>
            <select className={inputClass} style={inputStyle} value={form.region} onChange={(e) => set("region", e.target.value)}>
              {REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
            </select>
          </Field>
          <Field label="食べられる森のタイプ" labelClass={labelClass}>
            <select className={inputClass} style={inputStyle} value={form.forestType} onChange={(e) => set("forestType", e.target.value)}>
              {FOREST_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </Field>
          <Field label="地域カラー" labelClass={labelClass}>
            <div className="flex gap-2">
              <input type="color" className="h-10 w-12 rounded-md border" style={{ borderColor: "#CBD5E1" }} value={form.regionColor} onChange={(e) => set("regionColor", e.target.value)} />
              <input className={inputClass} style={inputStyle} value={form.regionColor} onChange={(e) => set("regionColor", e.target.value)} />
            </div>
          </Field>
          <ImageUpload label="カバー画像" value={form.img} onChange={(url) => set("img", url)} />
        </div>
        <Field label="概要" labelClass={labelClass}>
          <textarea className={`${inputClass} min-h-24 resize-y`} style={inputStyle} value={form.desc} onChange={(e) => set("desc", e.target.value)} />
        </Field>
      </Section>

      <Section title="施設情報">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="住所" labelClass={labelClass}>
            <input className={inputClass} style={inputStyle} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <Field label="アクセス" labelClass={labelClass}>
            <input className={inputClass} style={inputStyle} value={form.access} onChange={(e) => set("access", e.target.value)} />
          </Field>
          <Field label="予約URL" labelClass={labelClass}>
            <input className={inputClass} style={inputStyle} value={form.bookingUrl} onChange={(e) => set("bookingUrl", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="定員" labelClass={labelClass}>
            <input className={inputClass} style={inputStyle} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
          </Field>
          <Field label="料金" labelClass={labelClass}>
            <input className={inputClass} style={inputStyle} value={form.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="本文">
        <RichTextEditor content={form.content} onChange={(html) => set("content", html)} placeholder="施設の詳しい説明を入力してください" />
      </Section>

      <Section title="公開設定">
        <div className="flex flex-wrap gap-4">
          {(["draft", "published"] as const).map((status) => (
            <label key={status} className="flex items-center gap-2 text-sm" style={{ color: "#334155" }}>
              <input
                type="radio"
                name="status"
                value={status}
                checked={form.status === status}
                onChange={() => set("status", status)}
              />
              {status === "draft" ? "下書き" : "公開"}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm" style={{ color: "#334155" }}>
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
            有効
          </label>
          <label className="flex items-center gap-2 text-sm" style={{ color: "#334155" }}>
            <input type="checkbox" checked={form.isOfficial} onChange={(e) => set("isOfficial", e.target.checked)} />
            公式掲載
          </label>
        </div>
      </Section>

      <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "#DCE3EA" }}>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting || saving}
          className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
          style={{ borderColor: "#FECACA", color: "#B42318", backgroundColor: "#FFFFFF" }}
        >
          {deleting ? "削除中..." : "削除"}
        </button>
        <div className="flex gap-3">
          <a href="/admin/spots" className="rounded-md border px-4 py-2 text-sm font-medium" style={{ borderColor: "#CBD5E1", color: "#334155", backgroundColor: "#FFFFFF" }}>
            戻る
          </a>
          <button
            type="submit"
            disabled={saving || deleting}
            className="rounded-md px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#0F172A" }}
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </form>
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

function Field({
  label,
  labelClass,
  children,
}: {
  label: string;
  labelClass: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass} style={{ color: "#64748B" }}>{label}</span>
      {children}
    </label>
  );
}
