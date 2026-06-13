import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getEvent, joinEvent } from "@/lib/firestore";

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

interface Ctx { params: Promise<{ id: string }> }

// POST: イベントに参加（ログイン会員のみ）
export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const event = await getEvent(id);
  if (!event || event.status !== "published") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await joinEvent(id, uid);
  return NextResponse.json({ ok: true });
}
