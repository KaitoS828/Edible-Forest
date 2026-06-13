"use client";

import { useState } from "react";
import type { EventFormat, FacilityDoc } from "@/lib/firestore";

interface OrganizerInfo {
  displayName: string;
  operatingBodyName?: string;
}

interface Props {
  user: OrganizerInfo;
  facilities: Pick<FacilityDoc, "id" | "name">[];
}

type OrganizerChoice =
  | { kind: "name" }
  | { kind: "facility"; facilityId: string }
  | { kind: "body" };

const FORMAT_LABELS: Record<EventFormat, string> = {
  onsite: "現地開催",
  online: "オンライン",
  both: "現地＋オンライン",
};

const TERMS_TEMPLATE_KEY = "edible-forest:event-terms-template";

export default function EventForm({ user, facilities }: Props) {
  const [organizer, setOrganizer] = useState<OrganizerChoice>({ kind: "name" });
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [venueFacilityId, setVenueFacilityId] = useState(facilities[0]?.id ?? "");
  const [format, setFormat] = useState<EventFormat>("onsite");
  const [image, setImage] = useState("");
  const [terms, setTerms] = useState("");
  const [memberOnly, setMemberOnly] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadTermsTemplate() {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(TERMS_TEMPLATE_KEY) : null;
    if (saved) setTerms(saved);
    else setError("保存済みのテンプレートがありません");
  }

  function saveTermsTemplate() {
    if (typeof window !== "undefined") window.localStorage.setItem(TERMS_TEMPLATE_KEY, terms);
  }

  function resolveOrganizer(): { organizerName: string; organizerFacilityId?: string; organizerBodyName?: string } {
    if (organizer.kind === "facility") {
      const f = facilities.find((x) => x.id === organizer.facilityId);
      return { organizerName: f?.name ?? user.displayName, organizerFacilityId: organizer.facilityId };
    }
    if (organizer.kind === "body") {
      return { organizerName: user.operatingBodyName ?? user.displayName, organizerBodyName: user.operatingBodyName };
    }
    return { organizerName: user.displayName };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      ...resolveOrganizer(),
      title,
      summary,
      startAt: startAt ? new Date(startAt).getTime() : undefined,
      endAt: endAt ? new Date(endAt).getTime() : undefined,
      venueFacilityId: venueFacilityId || undefined,
      format,
      image: image || undefined,
      terms: terms || undefined,
      memberOnly,
      status: "published" as const,
    };

    try {
      const res = await fetch("/api/member/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      window.location.href = `/events/${data.id}`;
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm py-3 px-4 rounded-2xl bg-red-50 text-red-600">{error}</p>}

      {/* 主催者 */}
      <Section title="主催者">
        <div className="space-y-2">
          <Radio
            checked={organizer.kind === "name"}
            onChange={() => setOrganizer({ kind: "name" })}
            label={`氏名（${user.displayName}）`}
          />
          {facilities.map((f) => (
            <Radio
              key={f.id}
              checked={organizer.kind === "facility" && organizer.facilityId === f.id}
              onChange={() => setOrganizer({ kind: "facility", facilityId: f.id })}
              label={`登録施設名（${f.name}）`}
            />
          ))}
          {user.operatingBodyName && (
            <Radio
              checked={organizer.kind === "body"}
              onChange={() => setOrganizer({ kind: "body" })}
              label={`運営母体名（${user.operatingBodyName}）`}
            />
          )}
        </div>
      </Section>

      {/* 開催情報 */}
      <Section title="開催情報">
        <Field label="イベントタイトル">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="例：森の収穫ワークショップ" className={ic} />
        </Field>
        <Field label="概要">
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} placeholder="イベントの内容を説明してください" className={ic} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="開催日時">
            <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} className={ic} />
          </Field>
          <Field label="終了日時">
            <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} className={ic} />
          </Field>
        </div>
        <Field label="開催形態">
          <div className="flex flex-wrap gap-4">
            {(["onsite", "online", "both"] as const).map((f) => (
              <Radio key={f} checked={format === f} onChange={() => setFormat(f)} label={FORMAT_LABELS[f]} />
            ))}
          </div>
        </Field>
        <Field label="会場（審査済みの登録施設）">
          {facilities.length === 0 ? (
            <p className="text-sm" style={{ color: "#1A2B1E", opacity: 0.6 }}>審査済みの施設がありません。施設登録・承認後に選択できます。</p>
          ) : (
            <div className="space-y-2">
              {facilities.map((f) => (
                <Radio
                  key={f.id}
                  checked={venueFacilityId === f.id}
                  onChange={() => setVenueFacilityId(f.id)}
                  label={f.name}
                />
              ))}
            </div>
          )}
        </Field>
      </Section>

      {/* 画像 */}
      <Section title="画像">
        <Field label="画像URL">
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className={ic} />
        </Field>
        {image && <img src={image} alt="preview" className="rounded-xl object-cover w-full h-48" />}
      </Section>

      {/* イベント規約 */}
      <Section title="イベント規約">
        <Field label="規約">
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={6} placeholder="参加にあたっての規約を記載してください" className={ic} />
        </Field>
        <div className="flex gap-3">
          <button type="button" onClick={loadTermsTemplate} className="text-sm px-4 py-2 rounded-full border hover:opacity-70 transition-opacity" style={{ color: "#3C6B4F", borderColor: "rgba(60,107,79,0.3)" }}>
            テンプレートを読み込む
          </button>
          <button type="button" onClick={saveTermsTemplate} className="text-sm px-4 py-2 rounded-full border hover:opacity-70 transition-opacity" style={{ color: "#3C6B4F", borderColor: "rgba(60,107,79,0.3)" }}>
            テンプレートとして保存
          </button>
        </div>
      </Section>

      {/* 公開範囲 */}
      <Section title="公開範囲">
        <div className="flex gap-4">
          <Radio checked={!memberOnly} onChange={() => setMemberOnly(false)} label="オープン（誰でも参加可）" />
          <Radio checked={memberOnly} onChange={() => setMemberOnly(true)} label="会員限定" />
        </div>
      </Section>

      {/* 保存 */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 rounded-full text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: "#3C6B4F" }}
        >
          {saving ? "保存中..." : "イベントを公開する"}
        </button>
        <a href="/member/dashboard" className="px-6 py-3 rounded-full text-sm font-medium border hover:opacity-70 transition-opacity" style={{ color: "#1A2B1E", borderColor: "rgba(60,107,79,0.15)" }}>
          キャンセル
        </a>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
      <h2 className="text-base font-bold mb-4" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#1A2B1E", opacity: 0.6 }}>{label}</label>
      {children}
    </div>
  );
}

function Radio({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" checked={checked} onChange={onChange} className="accent-green-700" />
      <span className="text-sm" style={{ color: "#1A2B1E" }}>{label}</span>
    </label>
  );
}

const ic = "w-full px-4 py-2.5 rounded-2xl text-sm outline-none bg-gray-50 border border-transparent focus:border-green-700 transition-colors";
