import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllUsers } from "@/lib/firestore";

function esc(val: unknown): string {
  const s = val == null ? "" : String(val);
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

const HEADERS = [
  "UID", "姓", "名", "姓フリガナ", "名フリガナ", "表示名",
  "ログインメール", "連絡メール", "電話番号", "居住国", "住所",
  "会員種別", "職業", "興味分野", "コメント", "紹介者", "団体名",
  "プロフィール完了", "登録日",
];

export async function GET() {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  if (!(session.user as Record<string, unknown>).isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const users = await getAllUsers();
  const today = new Date().toISOString().split("T")[0];

  const rows = users.map((u) => {
    const createdMs = typeof u.createdAt?.toMillis === "function"
      ? u.createdAt.toMillis()
      : (u.createdAt as unknown as number) ?? null;

    return [
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
      createdMs ? new Date(createdMs).toLocaleDateString("ja-JP") : "",
    ].map(esc).join(",");
  });

  const csv = "﻿" + [HEADERS.join(","), ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="members_${today}.csv"`,
    },
  });
}
