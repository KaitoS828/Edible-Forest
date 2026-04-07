"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false }
);

type Activity = { icon: string; title: string; desc: string };
type Stat = { label: string; value: string };

type FormData = {
  name: string;
  sub: string;
  region: string;
  regionColor: string;
  desc: string;
  tagline: string;
  philosophy: string;
  img: string;
  activities: Activity[];
  stats: Stat[];
};

export default function EnsembleEditForm({
  id,
  initialData,
}: {
  id: string;
  initialData: FormData;
}) {
  const [form, setForm] = useState<FormData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  }

  // Activities
  function setActivity(i: number, key: keyof Activity, val: string) {
    const next = [...form.activities];
    next[i] = { ...next[i], [key]: val };
    set("activities", next);
  }
  function addActivity() {
    set("activities", [...form.activities, { icon: "🌿", title: "", desc: "" }]);
  }
  function removeActivity(i: number) {
    set("activities", form.activities.filter((_, idx) => idx !== i));
  }

  // Stats
  function setStat(i: number, key: keyof Stat, val: string) {
    const next = [...form.stats];
    next[i] = { ...next[i], [key]: val };
    set("stats", next);
  }
  function addStat() {
    set("stats", [...form.stats, { label: "", value: "" }]);
  }
  function removeStat(i: number) {
    set("stats", form.stats.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/ensemble/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("保存に失敗しました");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "block text-xs font-medium mb-1.5";
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[#3C6B4F] transition-colors";
  const inputStyle = { borderColor: "rgba(0,95,2,0.15)", backgroundColor: "white", color: "#3C6B4F" };

  return (
    <div className="max-w-[860px]">
      {/* タイトル + 保存ボタン */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
          >
            {form.name}
          </h1>
          <p className="text-xs mt-1" style={{ color: "#1A2B1E" }}>
            コンテンツID: {id}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "#3C6B4F" }}
          >
            {saving ? "保存中…" : saved ? "✓ 保存済み" : "保存する"}
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* ── 基本情報 ── */}
        <section className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
          <h2 className="text-base font-bold mb-5" style={{ color: "#3C6B4F" }}>
            基本情報
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ color: "#1A2B1E" }}>アンサンブル名</label>
              <input
                className={inputClass}
                style={inputStyle}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#1A2B1E" }}>サブタイトル（地名）</label>
              <input
                className={inputClass}
                style={inputStyle}
                value={form.sub}
                onChange={(e) => set("sub", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#1A2B1E" }}>地域</label>
              <input
                className={inputClass}
                style={inputStyle}
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: "#1A2B1E" }}>地域カラー（HEX）</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={form.regionColor}
                  onChange={(e) => set("regionColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border cursor-pointer"
                  style={{ borderColor: "rgba(0,95,2,0.15)" }}
                />
                <input
                  className={inputClass}
                  style={inputStyle}
                  value={form.regionColor}
                  onChange={(e) => set("regionColor", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass} style={{ color: "#1A2B1E" }}>タグライン</label>
            <input
              className={inputClass}
              style={inputStyle}
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="例：十勝の大地で、食べられる森をつくる。"
            />
          </div>

          <div className="mt-4">
            <label className={labelClass} style={{ color: "#1A2B1E" }}>概要説明文</label>
            <textarea
              className={`${inputClass} resize-none`}
              style={{ ...inputStyle, minHeight: "80px" }}
              value={form.desc}
              onChange={(e) => set("desc", e.target.value)}
              rows={3}
            />
          </div>

          <div className="mt-4">
            <label className={labelClass} style={{ color: "#1A2B1E" }}>メイン画像URL</label>
            <div className="flex gap-3 items-start">
              <input
                className={`${inputClass} flex-1`}
                style={inputStyle}
                value={form.img}
                onChange={(e) => set("img", e.target.value)}
                placeholder="https://..."
              />
              {form.img && (
                <div
                  className="flex-shrink-0 rounded-xl overflow-hidden"
                  style={{ width: "64px", height: "64px", border: "1px solid rgba(0,95,2,0.15)" }}
                >
                  <img src={form.img} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── フィロソフィー ── */}
        <section className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
          <h2 className="text-base font-bold mb-2" style={{ color: "#3C6B4F" }}>
            フィロソフィー
          </h2>
          <p className="text-xs mb-4" style={{ color: "#1A2B1E" }}>
            この拠点が大切にしていること・活動の背景（リッチテキスト）
          </p>
          <RichTextEditor
            content={form.philosophy}
            onChange={(html) => set("philosophy", html)}
            placeholder="ここに哲学・背景を入力してください…"
          />
        </section>

        {/* ── 活動・体験 ── */}
        <section className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold" style={{ color: "#3C6B4F" }}>
              活動・体験
            </h2>
            <button
              type="button"
              onClick={addActivity}
              className="text-xs px-4 py-1.5 rounded-full border transition-all hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F]"
              style={{ borderColor: "#3C6B4F", color: "#1A2B1E" }}
            >
              ＋ 追加
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {form.activities.map((act, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-4 rounded-xl"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <input
                  className="w-14 px-2 py-2.5 rounded-lg text-center text-lg border outline-none"
                  style={{ borderColor: "rgba(0,95,2,0.15)", backgroundColor: "white" }}
                  value={act.icon}
                  onChange={(e) => setActivity(i, "icon", e.target.value)}
                  placeholder="🌿"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={act.title}
                    onChange={(e) => setActivity(i, "title", e.target.value)}
                    placeholder="タイトル"
                  />
                  <textarea
                    className={`${inputClass} resize-none`}
                    style={{ ...inputStyle, minHeight: "60px" }}
                    value={act.desc}
                    onChange={(e) => setActivity(i, "desc", e.target.value)}
                    placeholder="説明文"
                    rows={2}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeActivity(i)}
                  className="text-xs px-2 py-1.5 rounded-lg transition-colors hover:bg-red-50 hover:text-red-400"
                  style={{ color: "#1A2B1E" }}
                >
                  ✕
                </button>
              </div>
            ))}
            {form.activities.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: "#1A2B1E" }}>
                活動を追加してください
              </p>
            )}
          </div>
        </section>

        {/* ── 統計 ── */}
        <section className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold" style={{ color: "#3C6B4F" }}>
              統計データ
            </h2>
            <button
              type="button"
              onClick={addStat}
              className="text-xs px-4 py-1.5 rounded-full border transition-all hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F]"
              style={{ borderColor: "#3C6B4F", color: "#1A2B1E" }}
            >
              ＋ 追加
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {form.stats.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  className={`${inputClass} flex-1`}
                  style={inputStyle}
                  value={s.label}
                  onChange={(e) => setStat(i, "label", e.target.value)}
                  placeholder="ラベル（例：活動開始）"
                />
                <input
                  className={`${inputClass} flex-1`}
                  style={inputStyle}
                  value={s.value}
                  onChange={(e) => setStat(i, "value", e.target.value)}
                  placeholder="値（例：2022年）"
                />
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  className="text-xs px-2 py-1.5 rounded-lg transition-colors hover:bg-red-50 hover:text-red-400"
                  style={{ color: "#1A2B1E" }}
                >
                  ✕
                </button>
              </div>
            ))}
            {form.stats.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: "#1A2B1E" }}>
                統計を追加してください
              </p>
            )}
          </div>
        </section>

        {/* ── プレビューリンク ── */}
        <div className="flex justify-between items-center pb-4">
          <a
            href={`/ensembles/${id}`}
            target="_blank"
            className="text-xs hover:underline"
            style={{ color: "#1A2B1E" }}
          >
            公開ページを見る →
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-full text-sm font-medium text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "#3C6B4F" }}
          >
            {saving ? "保存中…" : "保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}
