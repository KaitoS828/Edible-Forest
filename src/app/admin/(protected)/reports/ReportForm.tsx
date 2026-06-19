"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ImageUpload } from "@/components/admin/ImageUpload";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-40 rounded-md bg-white" /> }
);

export type ReportFormData = {
  id?: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  body: string;
  status: "draft" | "published";
  active: boolean;
};

export default function ReportForm({
  mode,
  reportId,
  initialData,
}: {
  mode: "new" | "edit";
  reportId?: string;
  initialData: ReportFormData;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(mode === "new" ? "/api/admin/reports" : `/api/admin/reports/${reportId}`, {
        method: mode === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("保存に失敗しました");
      const data = await res.json();
      if (mode === "new") {
        router.push(`/admin/reports/${data.id}`);
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!reportId || !window.confirm("このレポートを削除しますか？")) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      router.push("/admin/reports");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
      setDeleting(false);
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

      <Section title="基本情報">
        {mode === "new" && (
          <Field label="記事ID">
            <input className={inputClass} style={inputStyle} value={form.id ?? ""} onChange={(e) => set("id", e.target.value)} placeholder="未入力の場合はタイトルから自動生成" />
          </Field>
        )}
        <Field label="タイトル">
          <input className={inputClass} style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="日付">
            <input type="date" className={inputClass} style={inputStyle} value={form.date} onChange={(e) => set("date", e.target.value)} />
          </Field>
          <Field label="カテゴリ">
            <input className={inputClass} style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)} />
          </Field>
        </div>
        <ImageUpload label="カバー画像" value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
      </Section>

      <Section title="本文">
        <RichTextEditor content={form.body} onChange={(html) => set("body", html)} placeholder="レポート本文を入力してください" />
      </Section>

      <Section title="公開設定">
        <div className="flex flex-wrap gap-4">
          {(["draft", "published"] as const).map((status) => (
            <label key={status} className="flex items-center gap-2 text-sm" style={{ color: "#334155" }}>
              <input type="radio" name="status" value={status} checked={form.status === status} onChange={() => set("status", status)} />
              {status === "draft" ? "下書き" : "公開"}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm" style={{ color: "#334155" }}>
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
            有効
          </label>
        </div>
      </Section>

      <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "#DCE3EA" }}>
        {mode === "edit" ? (
          <button type="button" onClick={handleDelete} disabled={deleting || saving} className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50" style={{ borderColor: "#FECACA", color: "#B42318", backgroundColor: "#FFFFFF" }}>
            {deleting ? "削除中..." : "削除"}
          </button>
        ) : <span />}
        <div className="flex gap-3">
          <a href="/admin/reports" className="rounded-md border px-4 py-2 text-sm font-medium" style={{ borderColor: "#CBD5E1", color: "#334155", backgroundColor: "#FFFFFF" }}>戻る</a>
          <button type="submit" disabled={saving || deleting} className="rounded-md px-5 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ backgroundColor: "#0F172A" }}>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium" style={{ color: "#64748B" }}>{label}</span>
      {children}
    </label>
  );
}
