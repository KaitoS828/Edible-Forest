"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FacilityStatus } from "@/lib/firestore";

type Facility = {
  id: string;
  name: string;
  operatingBody: string;
  ownerName: string;
  region: string;
  status: FacilityStatus;
};

const STATUS_BADGE: Record<FacilityStatus, { label: string; bg: string; color: string }> = {
  pending:  { label: "審査中", bg: "#FEF3C7", color: "#92400E" },
  approved: { label: "承認済み", bg: "#DCFCE7", color: "#166534" },
  rejected: { label: "却下", bg: "#F1F5F9", color: "#64748B" },
};

export default function FacilityRow({ facility, isLast }: { facility: Facility; isLast: boolean }) {
  const [status, setStatus] = useState<FacilityStatus>(facility.status);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function update(next: FacilityStatus) {
    setSaving(true);
    await fetch(`/api/admin/facilities/${facility.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setStatus(next);
    setSaving(false);
    router.refresh();
  }

  const badge = STATUS_BADGE[status];

  return (
    <tr style={{ borderBottom: isLast ? "none" : "1px solid #EEF2F6" }}>
      <td className="px-5 py-3.5">
        <span className="text-xs font-medium" style={{ color: "#0F172A" }}>{facility.name || "—"}</span>
        {facility.region && (
          <span className="block text-[11px]" style={{ color: "#64748B" }}>{facility.region}</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-xs" style={{ color: "#475569" }}>{facility.operatingBody || "—"}</td>
      <td className="px-5 py-3.5 text-xs" style={{ color: "#475569" }}>{facility.ownerName || "—"}</td>
      <td className="px-5 py-3.5">
        <span className="rounded px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => update("approved")}
            disabled={saving || status === "approved"}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: "#166534" }}
          >
            承認
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
