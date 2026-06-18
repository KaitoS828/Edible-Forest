"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MemberType } from "@/lib/firestore";

const MEMBER_TYPES: { value: MemberType; label: string; desc: string }[] = [
  { value: "participant", label: "参加会員",          desc: "イベント参加（全会員）" },
  { value: "organizer",   label: "開催会員",          desc: "イベント開催・施設登録" },
  { value: "inner",       label: "森の奥（本部が付与）", desc: "他メンバー閲覧・本部運営" },
];

type Props = { uid: string; currentType: MemberType; currentNote: string };

export default function MemberEditForm({ uid, currentType, currentNote }: Props) {
  const [memberType, setMemberType] = useState<MemberType>(currentType);
  const [note, setNote]             = useState(currentNote);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/members/${uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberType, note }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <h2 className="mb-4 text-base font-semibold" style={{ color: "#0F172A" }}>
        会員種別・設定
      </h2>

      <div className="mb-6 grid grid-cols-1 gap-2">
        {MEMBER_TYPES.map((t) => (
          <label
            key={t.value}
            className="flex cursor-pointer items-center gap-3 rounded-md p-3 transition-all"
            style={{
              border: `1px solid ${memberType === t.value ? "#94A3B8" : "#DCE3EA"}`,
              backgroundColor: memberType === t.value ? "#F8FAFC" : "white",
            }}
          >
            <input
              type="radio"
              name="memberType"
              value={t.value}
              checked={memberType === t.value}
              onChange={() => setMemberType(t.value)}
              className="accent-slate-700"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: "#0F172A" }}>{t.label}</p>
              <p className="text-xs" style={{ color: "#64748B" }}>{t.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-xs font-medium" style={{ color: "#475569" }}>
          本部メモ（会員には表示されません）
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="備考・経緯などを記入..."
          className="w-full resize-none rounded-md px-3 py-2 text-sm outline-none"
          style={{ border: "1px solid #CBD5E1", backgroundColor: "white", color: "#0F172A" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#64748B")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#CBD5E1")}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: "#0F172A" }}
        >
          {saving ? "保存中..." : "保存する"}
        </button>
        {saved && <span className="text-xs" style={{ color: "#166534" }}>保存しました</span>}
      </div>
    </div>
  );
}
