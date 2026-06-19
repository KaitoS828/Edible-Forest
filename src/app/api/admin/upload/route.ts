import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { getAdminBucket } from "@/lib/firebase-admin";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB（Vercel のリクエストボディ上限 4.5MB 以下に収める）

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && (session.user as Record<string, unknown>).isAdmin);
}

// 管理者専用：画像を Firebase Storage にアップロードし、公開 URL を返す。
// admin SDK 経由のためクライアント側の Firebase 認証/Storage ルールに依存しない。
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file は必須です" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "画像ファイルのみアップロードできます" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "画像サイズは4MBまでです" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `cms/${Date.now()}_${randomUUID()}.${ext}`;
  const token = randomUUID();

  const bucket = getAdminBucket();
  await bucket.file(path).save(bytes, {
    contentType: file.type,
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
  return NextResponse.json({ url });
}
