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
  approved: { label: "承認済み", bg: "#D1FAE5", color: "#065F46" },
  rejected: { label: "却下", bg: "#F3F4F6", color: "#6B7280" },
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
    <tr style={{ borderBottom: isLast ? "none" : "1px solid rgba(60,107,79,0.08)" }}>
      <td className="px-5 py-3.5">
        <span className="font-medium text-xs" style={{ color: "#1A2B1E" }}>{facility.name || "—"}</span>
        {facility.region && (
          <span className="block text-[11px]" style={{ color: "#1A2B1E", opacity: 0.5 }}>{facility.region}</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-xs" style={{ color: "#1A2B1E", opacity: 0.7 }}>{facility.operatingBody || "—"}</td>
      <td className="px-5 py-3.5 text-xs" style={{ color: "#1A2B1E", opacity: 0.7 }}>{facility.ownerName || "—"}</td>
      <td className="px-5 py-3.5">
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => update("approved")}
            disabled={saving || status === "approved"}
            className="text-xs font-medium px-3 py-1.5 rounded-full text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: "#3C6B4F" }}
          >
            承認
          </button>
          <button
            onClick={() => update("rejected")}
            disabled={saving || status === "rejected"}
            className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all disabled:opacity-40 hover:bg-[#F3F4F6]"
            style={{ borderColor: "rgba(60,107,79,0.3)", color: "#1A2B1E" }}
          >
            却下
          </button>
        </div>
      </td>
    </tr>
  );
}
