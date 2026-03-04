import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getSpotDoc, updateSpot, deleteSpot } from "@/lib/firestore";

async function getUid(req: NextRequest): Promise<string | null> {
  const session = req.cookies.get("fb_session")?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded.uid;
  } catch { return null; }
}

interface Ctx { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const doc = await getSpotDoc(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (doc.authorId !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { authorId: _, ...safe } = await req.json();
  await updateSpot(id, safe);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const doc = await getSpotDoc(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (doc.authorId !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await deleteSpot(id);
  return NextResponse.json({ ok: true });
}
