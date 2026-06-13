import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { createEvent, getUser } from "@/lib/firestore";
import { can } from "@/lib/access";

async function getUid(req: NextRequest): Promise<string | null> {
  const session = req.cookies.get("fb_session")?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

// POST: 新規イベント作成（開催会員以上のみ）
export async function POST(req: NextRequest) {
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUser(uid);
  if (!can(user?.memberType, "create_event")) {
    return NextResponse.json({ error: "イベントを開催する権限がありません" }, { status: 403 });
  }

  const body = await req.json();

  // organizerId / organizerName は必ずサーバー側のセッション情報を使う（改ざん防止）
  const id = await createEvent({
    ...body,
    organizerId: uid,
    organizerName: body.organizerName ?? user?.displayName ?? "メンバー",
  });

  return NextResponse.json({ id }, { status: 201 });
}
