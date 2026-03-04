"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { SpotDoc } from "@/lib/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-2xl" style={{ backgroundColor: "#FFFFFF" }} /> }
);

interface Props {
  mode: "new" | "edit";
  spotId?: string;
  authorId: string;
  authorName: string;
  initialData?: SpotDoc;
}

const REGIONS = ["北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州・沖縄"];
const REGION_COLORS: Record<string, string> = {
  "北海道": "#005F02", "東北": "#005F02", "関東": "#005F02",
  "中部": "#005F02", "近畿": "#005F02", "中国": "#005F02",
  "四国": "#005F02", "九州・沖縄": "#005F02",
};

export default function SpotForm({ mode, spotId, authorId, authorName, initialData }: Props) {
  const d = initialData;
  const [name, setName]       = useState(d?.name ?? "");
  const [sub, setSub]         = useState(d?.sub ?? "");
  const [region, setRegion]   = useState(d?.region ?? "関東");
  const [desc, setDesc]       = useState(d?.desc ?? "");
  const [content, setContent] = useState(d?.content ?? "");
  const [img, setImg]         = useState(d?.img ?? "");
  const [address, setAddress] = useState(d?.address ?? "");
  const [capacity, setCapacity] = useState(d?.capacity ?? "");
  const [price, setPrice]     = useState(d?.price ?? "");
  const [access, setAccess]   = useState(d?.access ?? "");
  const [status, setStatus]   = useState<"draft" | "published">(d?.status ?? "draft");
  const [imgUploading, setImgUploading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = useCallback((html: string) => setContent(html), []);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const storageRef = ref(storage, `spots/${Date.now()}_${file.name}`);
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
      authorId, authorName, name, sub, region,
      regionColor: REGION_COLORS[region] ?? "#005F02",
      desc, content, img, address, capacity, price, access,
      active: status === "published", status, isOfficial: false,
    };
    try {
      const url = mode === "new" ? "/api/member/spot" : `/api/member/spot/${spotId}`;
      const res = await fetch(url, {
        method: mode === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      if (mode === "new") {
        const data = await res.json();
        window.location.href = `/member/edit-spot/${data.id}`;
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
      {error && <p className="text-sm py-3 px-4 rounded-2xl bg-red-50 text-red-600">{error}</p>}
      {saved && <p className="text-sm py-3 px-4 rounded-2xl bg-green-50 text-green-700">✓ 保存しました</p>}

      {/* 基本情報 */}
      <Section title="基本情報">
        <Field label="施設名">
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="例：里山の宿 なごみ庵" className={ic} />
        </Field>
        <Field label="サブタイトル">
          <input value={sub} onChange={(e) => setSub(e.target.value)} placeholder="例：古民家を改装した一棟貸しの宿" className={ic} />
        </Field>
        <Field label="地域">
          <select value={region} onChange={(e) => setRegion(e.target.value)} className={ic}>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="概要（一覧カード用）">
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="施設の特徴を簡潔に説明してください" className={ic} />
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
              {imgUploading ? <><span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />アップロード中…</> : <>📎 ファイルを選択</>}
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            {img && (
              <div className="relative">
                <img src={img} alt="preview" className="rounded-xl object-cover w-full h-48" />
                <button type="button" onClick={() => setImg("")} className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full w-6 h-6 flex items-center justify-center text-xs text-red-500">✕</button>
              </div>
            )}
          </div>
        </Field>
      </Section>

      {/* 施設情報 */}
      <Section title="施設情報">
        <Field label="住所">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="例：高知県四万十市○○町123" className={ic} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="定員">
            <input value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="例：最大6名" className={ic} />
          </Field>
          <Field label="料金">
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="例：1泊 ¥8,000〜" className={ic} />
          </Field>
        </div>
        <Field label="アクセス">
          <input value={access} onChange={(e) => setAccess(e.target.value)} placeholder="例：JR土佐くろしお鉄道○○駅より車15分" className={ic} />
        </Field>
      </Section>

      {/* 拠点の内容 */}
      <Section title="拠点の内容">
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          placeholder="施設の詳しい説明や魅力を書いてください。画像も挿入できます。"
        />
      </Section>

      {/* 公開設定 */}
      <Section title="公開設定">
        <div className="flex gap-4">
          {(["draft", "published"] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="accent-green-700" />
              <span className="text-sm" style={{ color: "#555555" }}>{s === "draft" ? "下書き保存" : "公開する"}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* 保存 */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || imgUploading}
          className="flex-1 py-3 rounded-full text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: "#005F02" }}
        >
          {saving ? "保存中..." : mode === "new" ? "作成する" : "更新する"}
        </button>
        <a href="/member" className="px-6 py-3 rounded-full text-sm font-medium border hover:opacity-70 transition-opacity" style={{ color: "#555555", borderColor: "rgba(0,95,2,0.15)" }}>
          キャンセル
        </a>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
      <h2 className="text-base font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>{title}</h2>
      <div className="space-y-3">{children}</div>
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
