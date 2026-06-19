import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getEnsembleDoc, updateEnsemble, deleteEnsemble } from "@/lib/firestore";

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

// PATCH: 自分のアンサンブルを更新
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await getEnsembleDoc(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (doc.authorId !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const locale = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "ja";

  // authorId の上書きは禁止
  const { authorId: _, ...safe } = body;

  // lang=en の場合は translations.en にのみ保存
  const updateData = locale === "en"
    ? {
        translations: {
          en: {
            name: typeof safe.name === "string" ? safe.name : "",
            sub: typeof safe.sub === "string" ? safe.sub : "",
            desc: typeof safe.desc === "string" ? safe.desc : "",
            tagline: typeof safe.tagline === "string" ? safe.tagline : "",
            philosophy: typeof safe.philosophy === "string" ? safe.philosophy : "",
            travelConditions: typeof safe.travelConditions === "string" ? safe.travelConditions : undefined,
          },
        },
      }
    : safe;

  await updateEnsemble(id, updateData);

  return NextResponse.json({ ok: true });
}

// DELETE: 自分のアンサンブルを削除
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const uid = await getUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await getEnsembleDoc(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (doc.authorId !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await deleteEnsemble(id);
  return NextResponse.json({ ok: true });
}
