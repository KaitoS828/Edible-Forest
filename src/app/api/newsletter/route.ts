import { NextRequest, NextResponse } from "next/server";
import { addContactToList } from "@/lib/benchmark";
import { upsertMailSubscriber } from "@/lib/firestore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST: メルマガ購読登録（Benchmark へ追加 ＋ Firestore に記録）
export async function POST(req: NextRequest) {
  const { email, firstName, lastName } = (await req.json()) as {
    email?: string;
    firstName?: string;
    lastName?: string;
  };

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "メールアドレスが不正です" }, { status: 400 });
  }

  const result = await addContactToList(email, { firstName, lastName });

  // Benchmark 連携が成功 → subscribed、未設定/失敗 → pending（Firestore には必ず残す）
  await upsertMailSubscriber({
    email,
    status: result.ok ? "subscribed" : "pending",
    benchmarkContactId: result.contactId,
  });

  return NextResponse.json({ ok: true, synced: result.ok, skipped: result.skipped ?? false });
}
