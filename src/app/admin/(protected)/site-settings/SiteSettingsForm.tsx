"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/data/siteSettings";

export default function SiteSettingsForm({ initialData }: { initialData: SiteSettings }) {
  const router = useRouter();
  const [value, setValue] = useState(() => JSON.stringify(initialData, null, 2));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const parsed = JSON.parse(value) as SiteSettings;
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(error || saved) && (
        <div className="rounded-md border px-4 py-3 text-sm" style={{ borderColor: error ? "#FECACA" : "#BBF7D0", backgroundColor: error ? "#FEF2F2" : "#F0FDF4", color: error ? "#B42318" : "#166534" }}>
          {error ?? "保存しました。公開ページへ反映されます。"}
        </div>
      )}

      <section className="rounded-md border bg-white p-5" style={{ borderColor: "#DCE3EA" }}>
        <div className="mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>サイト設定JSON</h2>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: "#64748B" }}>
            ヘッダー、フッター、トップの森タイプ、コンセプト補助カード、各ページ見出し/CTA、地図データをまとめて編集します。
          </p>
        </div>
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          rows={32}
          spellCheck={false}
          className="w-full rounded-md border p-4 font-mono text-xs outline-none focus:border-slate-500"
          style={{ borderColor: "#CBD5E1", backgroundColor: "#F8FAFC", color: "#0F172A" }}
        />
      </section>

      <div className="flex justify-end border-t pt-5" style={{ borderColor: "#DCE3EA" }}>
        <button type="submit" disabled={saving} className="rounded-md px-5 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ backgroundColor: "#0F172A" }}>
          {saving ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}
