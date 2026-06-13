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
      <h2 className="text-base font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif", color: "#1A2B1E" }}>
        会員種別・設定
      </h2>

      <div className="grid grid-cols-1 gap-2 mb-6">
        {MEMBER_TYPES.map((t) => (
          <label
            key={t.value}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
            style={{
              border: `1.5px solid ${memberType === t.value ? "#3C6B4F" : "rgba(60,107,79,0.15)"}`,
              backgroundColor: memberType === t.value ? "#F0F6F2" : "white",
            }}
          >
            <input
              type="radio"
              name="memberType"
              value={t.value}
              checked={memberType === t.value}
              onChange={() => setMemberType(t.value)}
              className="accent-[#3C6B4F]"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: "#1A2B1E" }}>{t.label}</p>
              <p className="text-xs" style={{ color: "#1A2B1E", opacity: 0.5 }}>{t.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-xs font-medium mb-2" style={{ color: "#1A2B1E" }}>
          本部メモ（会員には表示されません）
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="備考・経緯などを記入..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{ border: "1.5px solid rgba(60,107,79,0.2)", backgroundColor: "white", color: "#1A2B1E" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(60,107,79,0.2)")}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-full text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: "#3C6B4F" }}
        >
          {saving ? "保存中..." : "保存する"}
        </button>
        {saved && <span className="text-xs" style={{ color: "#3C6B4F" }}>✓ 保存しました</span>}
      </div>
    </div>
  );
}
