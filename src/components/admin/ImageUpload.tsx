"use client";

import { useId, useState } from "react";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("画像サイズは2MBまでです");
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "アップロードに失敗しました");
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && (
        <span className="mb-1.5 block text-xs font-medium" style={{ color: "#64748B" }}>
          {label}
        </span>
      )}
      <input
        type="text"
        className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:border-slate-500"
        style={{ borderColor: "#CBD5E1", backgroundColor: "#FFFFFF", color: "#0F172A" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="URL を入力、または画像をアップロード"
      />
      <div className="mt-2 flex items-center gap-3">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <label
          htmlFor={inputId}
          className="cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "#CBD5E1", color: "#334155" }}
        >
          {uploading ? "アップロード中…" : "画像をアップロード"}
        </label>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-10 w-10 rounded object-cover" style={{ border: "1px solid #E5EAF0" }} />
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs" style={{ color: "#B42318" }}>
          {error}
        </p>
      )}
      <p className="mt-1 text-[11px]" style={{ color: "#94A3B8" }}>
        JPEG / PNG / WebP・2MBまで
      </p>
    </div>
  );
}
