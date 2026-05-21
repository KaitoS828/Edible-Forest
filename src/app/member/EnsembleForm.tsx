"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { EnsembleDoc } from "@/lib/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-2xl bg-gray-50" /> }
);

interface Props {
  mode: "new" | "edit";
  ensembleId?: string;
  authorId: string;
  authorName: string;
  initialData?: EnsembleDoc;
}

const REGIONS = ["北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州・沖縄"];
const FOREST_TYPES = ["里山の森", "海の森", "川の森", "農の森", "都市の森", "その他"];

export default function EnsembleForm({ mode, ensembleId, authorId, authorName, initialData }: Props) {
  const d = initialData;

  // 基本情報
  const [name, setName]               = useState(d?.name ?? "");
  const [region, setRegion]           = useState(d?.region ?? "北海道");
  const [forestType, setForestType]   = useState(d?.forestType ?? "");
  const [desc, setDesc]               = useState(d?.desc ?? "");
  const [img, setImg]                 = useState(d?.img ?? "");
  const [imgUploading, setImgUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // 開催概要（固定6項目）
  const findStat = (label: string) => d?.stats?.find((s) => s.label === label)?.value ?? "";
  const [location, setLocation]       = useState(findStat("開催地"));
  const [period, setPeriod]           = useState(findStat("開催期間"));
  const [duration, setDuration]       = useState(findStat("所要時間"));
  const [price, setPrice]             = useState(findStat("料金"));
  const [capacity, setCapacity]         = useState(findStat("定員"));
  const [meetingPlace, setMeetingPlace] = useState(findStat("集合場所"));
  const [belongings, setBelongings]     = useState(findStat("持ち物"));

  // 理念・活動内容
  const [philosophy, setPhilosophy] = useState(d?.philosophy ?? "");
  const handlePhilosophyChange = useCallback((html: string) => setPhilosophy(html), []);

  // 注意事項
  const [notes, setNotes] = useState<string[]>(
    d?.notes?.length ? d.notes : [""]
  );

  // 旅行条件等
  const [travelConditions, setTravelConditions] = useState(d?.travelConditions ?? "");

  // アクティビティ
  const [activities, setActivities] = useState<{ icon: string; title: string; desc: string }[]>(
    d?.activities?.length ? d.activities : [{ icon: "", title: "", desc: "" }]
  );

  // オーガナイザー
  const [hasOrganizer, setHasOrganizer] = useState(!!d?.organizer);
  const [organizer, setOrganizer] = useState(d?.organizer ?? { name: "", role: "", bio: "" });

  // ギャラリー
  const [gallery, setGallery]               = useState<string[]>(d?.gallery ?? []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // 公開設定
  const [status, setStatus] = useState<"draft" | "published">(d?.status ?? "draft");

  // 送信状態
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const r = ref(storage, `covers/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      setImg(await getDownloadURL(r));
    } catch {
      alert("画像のアップロードに失敗しました");
    } finally {
      setImgUploading(false);
      e.target.value = "";
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setGalleryUploading(true);
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const r = ref(storage, `gallery/${Date.now()}_${file.name}`);
          await uploadBytes(r, file);
          return getDownloadURL(r);
        })
      );
      setGallery((prev) => [...prev, ...urls]);
    } catch {
      alert("画像のアップロードに失敗しました");
    } finally {
      setGalleryUploading(false);
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
      sub: "",
      tagline: "",
      region,
      regionColor: "#3C6B4F",
      forestType,
      desc,
      philosophy,
      notes: notes.filter(Boolean),
      travelConditions,
      img,
      activities: activities.filter((a) => a.title),
      stats: [
        { label: "開催地", value: location },
        { label: "開催期間", value: period },
        { label: "所要時間", value: duration },
        { label: "料金", value: price },
        { label: "定員", value: capacity },
        { label: "集合場所", value: meetingPlace },
        { label: "持ち物", value: belongings },
      ].filter((s) => s.value),
      gallery,
      organizer: hasOrganizer ? organizer : null,
      active: status === "published",
      status,
      isOfficial: false,
    };

    try {
      const url    = mode === "new" ? "/api/member/ensemble" : `/api/member/ensemble/${ensembleId}`;
      const method = mode === "new" ? "POST" : "PATCH";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
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

  const busy = saving || imgUploading || galleryUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-sm py-3 px-4 rounded-2xl bg-red-50 text-red-600">{error}</p>}
      {saved  && <p className="text-sm py-3 px-4 rounded-2xl bg-green-50 text-green-700">✓ 保存しました</p>}

      {/* ── 基本情報 ── */}
      <Section title="基本情報">
        <Field label="アンサンブル名 *">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="例：浦幌アンサンブル"
            className={ic}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="地域">
            <select value={region} onChange={(e) => setRegion(e.target.value)} className={ic}>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="森の種類">
            <select value={forestType} onChange={(e) => setForestType(e.target.value)} className={ic}>
              <option value="">選択してください</option>
              {FOREST_TYPES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
        </div>

        <Field label="概要（一覧カード用）">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            placeholder="アンサンブルの概要を簡潔に説明してください"
            className={ic}
          />
        </Field>

        <Field label="カバー画像">
          <div className="space-y-2">
            <UploadBtn onClick={() => coverInputRef.current?.click()} loading={imgUploading} label="ファイルを選択" />
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            {img && (
              <div className="relative">
                <img src={img} alt="cover" className="rounded-xl object-cover w-full h-48" />
                <RemoveBtn onClick={() => setImg("")} />
              </div>
            )}
          </div>
        </Field>
      </Section>

      {/* ── 開催概要 ── */}
      <Section title="開催概要">
        <div className="grid grid-cols-2 gap-3">
          <Field label="開催地">
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="例：北海道浦幌町" className={ic} />
          </Field>
          <Field label="開催期間">
            <input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="例：2024年8月〜9月" className={ic} />
          </Field>
          <Field label="所要時間">
            <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="例：1泊2日" className={ic} />
          </Field>
          <Field label="料金">
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="例：¥15,000（税込）" className={ic} />
          </Field>
          <Field label="定員">
            <input value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="例：各回10名限定" className={ic} />
          </Field>
          <Field label="持ち物">
            <input value={belongings} onChange={(e) => setBelongings(e.target.value)} placeholder="例：動きやすい服装、長靴" className={ic} />
          </Field>
        </div>
        <Field label="集合場所（住所を入力するとマップが自動表示されます）">
          <input value={meetingPlace} onChange={(e) => setMeetingPlace(e.target.value)} placeholder="例：北海道中川郡浦幌町字浦幌484" className={ic} />
        </Field>
      </Section>

      {/* ── 理念・活動内容 ── */}
      <Section title="理念・活動内容">
        <p className="text-xs -mt-1 mb-2" style={{ color: "#999" }}>
          アンサンブルの想いや体験ストーリーを自由に書いてください。
        </p>
        <RichTextEditor
          content={philosophy}
          onChange={handlePhilosophyChange}
          placeholder="アンサンブルの活動内容や想いを自由に書いてください。画像も挿入できます。"
        />
      </Section>

      {/* ── 注意事項 ── */}
      <Section title="注意事項">
        <div className="space-y-2">
          {notes.map((note, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={note}
                onChange={(e) => { const n = [...notes]; n[i] = e.target.value; setNotes(n); }}
                placeholder="例：お子様連れの方は動きやすい服装でお越しください"
                className={`${ic} flex-1`}
              />
              {notes.length > 1 && (
                <button type="button" onClick={() => setNotes(notes.filter((_, j) => j !== i))} className={delBtn}>✕</button>
              )}
            </div>
          ))}
        </div>
        <AddBtn onClick={() => setNotes([...notes, ""])} label="注意事項を追加" />
      </Section>

      {/* ── 旅行条件等 ── */}
      <Section title="旅行条件等">
        <p className="text-xs -mt-1 mb-2" style={{ color: "#999" }}>
          旅行業者情報・キャンセル規定などを入力してください。
        </p>
        <textarea
          value={travelConditions}
          onChange={(e) => setTravelConditions(e.target.value)}
          rows={5}
          placeholder="旅行業者名、旅行業登録番号、旅程管理主任者名、取消規定 など"
          className={ic}
        />
      </Section>

      {/* ── アクティビティ ── */}
      <Section title="アクティビティ">
        <p className="text-xs -mt-1 mb-2" style={{ color: "#999" }}>
          体験プログラムをカード形式で登録します。
        </p>
        <div className="space-y-3">
          {activities.map((act, i) => (
            <div key={i} className="p-4 rounded-2xl space-y-2" style={{ backgroundColor: "#F8FAF8", border: "1px solid rgba(0,95,2,0.1)" }}>
              <div className="flex gap-2 items-center">
                <input
                  value={act.icon}
                  onChange={(e) => { const n = [...activities]; n[i] = { ...n[i], icon: e.target.value }; setActivities(n); }}
                  placeholder="絵文字"
                  className={`${ic} w-16 text-center`}
                />
                <input
                  value={act.title}
                  onChange={(e) => { const n = [...activities]; n[i] = { ...n[i], title: e.target.value }; setActivities(n); }}
                  placeholder="タイトル（例：森の散策）"
                  className={`${ic} flex-1`}
                />
                {activities.length > 1 && (
                  <button type="button" onClick={() => setActivities(activities.filter((_, j) => j !== i))} className={delBtn}>✕</button>
                )}
              </div>
              <textarea
                value={act.desc}
                onChange={(e) => { const n = [...activities]; n[i] = { ...n[i], desc: e.target.value }; setActivities(n); }}
                rows={2}
                placeholder="内容の説明"
                className={ic}
              />
            </div>
          ))}
        </div>
        <AddBtn onClick={() => setActivities([...activities, { icon: "", title: "", desc: "" }])} label="アクティビティを追加" />
      </Section>

      {/* ── オーガナイザー ── */}
      <Section title="オーガナイザー">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasOrganizer}
            onChange={(e) => setHasOrganizer(e.target.checked)}
            className="accent-green-700"
          />
          <span className="text-sm" style={{ color: "#555" }}>オーガナイザー情報を登録する</span>
        </label>
        {hasOrganizer && (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="名前">
                <input
                  value={organizer.name}
                  onChange={(e) => setOrganizer({ ...organizer, name: e.target.value })}
                  placeholder="例：山田 太郎"
                  className={ic}
                />
              </Field>
              <Field label="肩書き">
                <input
                  value={organizer.role}
                  onChange={(e) => setOrganizer({ ...organizer, role: e.target.value })}
                  placeholder="例：食べられる森コーディネーター"
                  className={ic}
                />
              </Field>
            </div>
            <Field label="紹介文">
              <textarea
                value={organizer.bio}
                onChange={(e) => setOrganizer({ ...organizer, bio: e.target.value })}
                rows={3}
                placeholder="オーガナイザーの紹介文"
                className={ic}
              />
            </Field>
          </div>
        )}
      </Section>

      {/* ── ギャラリー ── */}
      <Section title="ギャラリー">
        <p className="text-xs -mt-1 mb-3" style={{ color: "#999" }}>
          活動の様子の写真を複数枚アップロードできます。
        </p>
        {gallery.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {gallery.map((url, i) => (
              <div key={i} className="relative w-24 h-24">
                <img src={url} alt="" className="w-24 h-24 rounded-xl object-cover" />
                <RemoveBtn onClick={() => setGallery(gallery.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
        )}
        <UploadBtn onClick={() => galleryInputRef.current?.click()} loading={galleryUploading} label="写真を追加（複数選択可）" />
        <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
      </Section>

      {/* ── 公開設定 ── */}
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
              <span className="text-sm" style={{ color: "#555" }}>
                {s === "draft" ? "下書き保存" : "公開する"}
              </span>
            </label>
          ))}
        </div>
        {status === "published" && (
          <p className="text-xs mt-2" style={{ color: "#1A2B1E" }}>
            公開するとサイトのアンサンブル一覧に表示されます。
          </p>
        )}
      </Section>

      {/* ── 保存ボタン ── */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 py-3 rounded-full text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: "#3C6B4F" }}
        >
          {saving ? "保存中..." : mode === "new" ? "作成する" : "更新する"}
        </button>
        <a
          href="/member"
          className="px-6 py-3 rounded-full text-sm font-medium border hover:opacity-70 transition-opacity"
          style={{ color: "#555", borderColor: "rgba(0,95,2,0.15)" }}
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
      <h2 className="text-base font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#777" }}>{label}</label>
      {children}
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border transition-opacity hover:opacity-70"
      style={{ color: "#3C6B4F", borderColor: "rgba(0,95,2,0.3)" }}
    >
      + {label}
    </button>
  );
}

function UploadBtn({ onClick, loading, label }: { onClick: () => void; loading: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm border hover:opacity-80 transition-opacity disabled:opacity-50"
      style={{ borderColor: "rgba(0,95,2,0.15)", color: "#555" }}
    >
      {loading
        ? <><span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />アップロード中…</>
        : <>📎 {label}</>
      }
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-1 right-1 bg-white bg-opacity-90 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-red-500 hover:bg-opacity-100"
    >
      ✕
    </button>
  );
}

const ic = "w-full px-4 py-2.5 rounded-2xl text-sm outline-none bg-gray-50 border border-transparent focus:border-green-700 transition-colors";
const delBtn = "text-red-400 hover:text-red-600 text-sm px-2 flex-shrink-0";
