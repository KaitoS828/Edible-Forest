"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { EnsembleDoc } from "@/lib/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-2xl" style={{ backgroundColor: "#FFFFFF" }} /> }
);

interface Props {
  mode: "new" | "edit";
  ensembleId?: string;
  authorId: string;
  authorName: string;
  initialData?: EnsembleDoc;
}

const REGIONS = [
  "北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州・沖縄",
];
const REGION_COLORS: Record<string, string> = {
  "北海道": "#3C6B4F", "東北": "#3C6B4F", "関東": "#3C6B4F",
  "中部": "#3C6B4F", "近畿": "#3C6B4F", "中国": "#3C6B4F",
  "四国": "#3C6B4F", "九州・沖縄": "#3C6B4F",
};

export default function EnsembleForm({ mode, ensembleId, authorId, authorName, initialData }: Props) {
  const d = initialData;
  const [name, setName]         = useState(d?.name ?? "");
  const [sub, setSub]           = useState(d?.sub ?? "");
  const [region, setRegion]     = useState(d?.region ?? "関東");
  const [desc, setDesc]         = useState(d?.desc ?? "");
  const [tagline, setTagline]   = useState(d?.tagline ?? "");
  const [philosophy, setPhilosophy] = useState(d?.philosophy ?? "");
  const [img, setImg]           = useState(d?.img ?? "");
  const [imgUploading, setImgUploading] = useState(false);
  const [status, setStatus]     = useState<"draft" | "published">(d?.status ?? "draft");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handlePhilosophyChange = useCallback((html: string) => {
    setPhilosophy(html);
  }, []);

  async function handleCoverImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const storageRef = ref(storage, `covers/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImg(url);
    } catch {
      alert("画像のアップロードに失敗しました");
    } finally {
      setImgUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      authorId,
      authorName,
      name,
      sub,
      region,
      regionColor: REGION_COLORS[region] ?? "#3C6B4F",
      desc,
      tagline,
      philosophy,
      img,
      activities: d?.activities ?? [],
      stats:      d?.stats ?? [],
      gallery:    d?.gallery ?? [],
      active: status === "published",
      status,
      isOfficial: false,
    };

    try {
      const url = mode === "new"
        ? "/api/member/ensemble"
        : `/api/member/ensemble/${ensembleId}`;
      const method = mode === "new" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("保存に失敗しました");

      if (mode === "new") {
        const data = await res.json();
        window.location.href = `/member/edit/${data.id}`;
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-sm py-3 px-4 rounded-2xl bg-red-50 text-red-600">{error}</p>
      )}
      {saved && (
        <p className="text-sm py-3 px-4 rounded-2xl bg-green-50 text-green-700">
          ✓ 保存しました
        </p>
      )}

      {/* 基本情報 */}
      <Section title="基本情報">
        <Field label="アンサンブル名">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="例：鳴子アンサンブル"
            className={inputClass}
          />
        </Field>
        <Field label="サブタイトル">
          <input
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            placeholder="例：里山の棚田と菜園のコミュニティ"
            className={inputClass}
          />
        </Field>
        <Field label="地域">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={inputClass}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="一言キャッチコピー">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="例：里山と食を繋ぐ"
            className={inputClass}
          />
        </Field>
        <Field label="概要（カード表示用）">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            placeholder="アンサンブルの概要を簡潔に説明してください"
            className={inputClass}
          />
        </Field>
        <Field label="カバー画像">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={imgUploading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm border hover:opacity-80 transition-opacity disabled:opacity-50"
              style={{ borderColor: "rgba(0,95,2,0.15)", color: "#555555" }}
            >
              {imgUploading ? (
                <><span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />アップロード中…</>
              ) : (
                <>📎 ファイルを選択</>
              )}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageUpload}
            />
            {img && (
              <div className="relative">
                <img
                  src={img}
                  alt="cover preview"
                  className="rounded-xl object-cover w-full h-48"
                />
                <button
                  type="button"
                  onClick={() => setImg("")}
                  className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full w-6 h-6 flex items-center justify-center text-xs text-red-500 hover:bg-opacity-100"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </Field>
      </Section>

      {/* アンサンブルの内容 */}
      <Section title="アンサンブルの内容">
        <RichTextEditor
          content={philosophy}
          onChange={handlePhilosophyChange}
          placeholder="アンサンブルの活動内容や想いを自由に書いてください。画像も挿入できます。"
        />
      </Section>

      {/* 公開設定 */}
      <Section title="公開設定">
        <div className="flex gap-4">
          {(["draft", "published"] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={s}
                checked={status === s}
                onChange={() => setStatus(s)}
                className="accent-green-700"
              />
              <span className="text-sm" style={{ color: "#555555" }}>
                {s === "draft" ? "下書き保存" : "公開する"}
              </span>
            </label>
          ))}
        </div>
        {status === "published" && (
          <p className="text-xs mt-2" style={{ color: "#1A2B1E" }}>
            公開すると、サイトのアンサンブル一覧に表示されます。
          </p>
        )}
      </Section>

      {/* 保存ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || imgUploading}
          className="flex-1 py-3 rounded-full text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: "#3C6B4F" }}
        >
          {saving ? "保存中..." : mode === "new" ? "作成する" : "更新する"}
        </button>
        <a
          href="/member"
          className="px-6 py-3 rounded-full text-sm font-medium border hover:opacity-70 transition-opacity"
          style={{ color: "#555555", borderColor: "rgba(0,95,2,0.15)" }}
        >
          キャンセル
        </a>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
      <h2
        className="text-base font-bold mb-4"
        style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
      >
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#777777" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-2xl text-sm outline-none bg-gray-50 border border-transparent focus:border-green-700 transition-colors";
