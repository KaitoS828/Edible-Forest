"use client";

interface UserRow {
  uid: string;
  lastName?: string;
  firstName?: string;
  lastNameKana?: string;
  firstNameKana?: string;
  displayName?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  country?: string;
  address?: string;
  memberType?: string;
  occupation?: string;
  interests?: string[];
  comment?: string;
  referrer?: string;
  operatingBodyName?: string;
  profileCompleted?: boolean;
  createdAtMs?: number | null;
}

const HEADERS = [
  "UID", "姓", "名", "姓フリガナ", "名フリガナ", "表示名",
  "ログインメール", "連絡メール", "電話番号", "居住国", "住所",
  "会員種別", "職業", "興味分野", "コメント", "紹介者", "団体名",
  "プロフィール完了", "登録日",
];

function esc(val: unknown): string {
  const s = val == null ? "" : String(val);
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

export function CsvDownloadButton({ users }: { users: UserRow[] }) {
  function handleDownload() {
    const rows = users.map((u) => [
      u.uid,
      u.lastName ?? "",
      u.firstName ?? "",
      u.lastNameKana ?? "",
      u.firstNameKana ?? "",
      u.displayName ?? "",
      u.email ?? "",
      u.contactEmail ?? "",
      u.phone ?? "",
      u.country ?? "",
      u.address ?? "",
      u.memberType ?? "participant",
      u.occupation ?? "",
      (u.interests ?? []).join("・"),
      u.comment ?? "",
      u.referrer ?? "",
      u.operatingBodyName ?? "",
      u.profileCompleted ? "完了" : "未完了",
      u.createdAtMs ? new Date(u.createdAtMs).toLocaleDateString("ja-JP") : "",
    ].map(esc).join(","));

    const csv = "﻿" + [HEADERS.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", color: "#334155" }}
    >
      <DownloadIcon />
      CSVエクスポート
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
