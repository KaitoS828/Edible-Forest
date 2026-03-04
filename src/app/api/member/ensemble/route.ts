import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { createEnsemble } from "@/lib/firestore";

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

// POST: 新規アンサンブル作成
export async function POST(req: NextRequest) {
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // authorId は必ずセッションの UID を使う（改ざん防止）
  const id = await createEnsemble({
    ...body,
    authorId: uid,
  });

  return NextResponse.json({ id }, { status: 201 });
}
