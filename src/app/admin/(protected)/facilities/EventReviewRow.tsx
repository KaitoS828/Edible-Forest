"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EventFormat, EventStatus } from "@/lib/firestore";

type EventReview = {
  id: string;
  title: string;
  organizerName: string;
  startAt?: number;
  format: EventFormat;
  status: EventStatus;
};

const FORMAT_LABELS: Record<EventFormat, string> = {
  onsite: "現地開催",
  online: "オンライン",
  both: "現地＋オンライン",
};

const STATUS_BADGE: Record<EventStatus, { label: string; bg: string; color: string }> = {
  draft: { label: "下書き", bg: "#F1F5F9", color: "#64748B" },
  pending: { label: "審査中", bg: "#FEF3C7", color: "#92400E" },
  published: { label: "公開中", bg: "#DCFCE7", color: "#166534" },
  rejected: { label: "却下", bg: "#F1F5F9", color: "#64748B" },
};

function formatDate(ms?: number): string {
  if (!ms) return "日時未定";
  return new Date(ms).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventReviewRow({ event, isLast }: { event: EventReview; isLast: boolean }) {
  const [status, setStatus] = useState<EventStatus>(event.status);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function update(next: EventStatus) {
    setSaving(true);
    const res = await fetch(`/api/admin/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setStatus(next);
      router.refresh();
    }
    setSaving(false);
  }

  const badge = STATUS_BADGE[status];

  return (
    <tr style={{ borderBottom: isLast ? "none" : "1px solid #EEF2F6" }}>
      <td className="px-5 py-3.5">
        <span className="text-xs font-medium" style={{ color: "#0F172A" }}>{event.title || "—"}</span>
        <span className="block text-[11px]" style={{ color: "#64748B" }}>{event.id}</span>
      </td>
      <td className="px-5 py-3.5 text-xs" style={{ color: "#475569" }}>{event.organizerName || "—"}</td>
      <td className="px-5 py-3.5 text-xs" style={{ color: "#475569" }}>{formatDate(event.startAt)}</td>
      <td className="px-5 py-3.5 text-xs" style={{ color: "#475569" }}>{FORMAT_LABELS[event.format] ?? event.format}</td>
      <td className="px-5 py-3.5">
        <span className="rounded px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => update("published")}
            disabled={saving || status === "published"}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: "#166534" }}
          >
            公開
          </button>
          <button
            onClick={() => update("rejected")}
            disabled={saving || status === "rejected"}
            className="rounded-md border px-3 py-1.5 text-xs font-medium transition-all hover:bg-slate-50 disabled:opacity-40"
            style={{ borderColor: "#CBD5E1", color: "#334155" }}
          >
            却下
          </button>
        </div>
      </td>
    </tr>
  );
}
