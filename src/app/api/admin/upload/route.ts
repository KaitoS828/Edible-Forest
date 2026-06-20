import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB（Vercel のリクエストボディ上限 4.5MB 以下に収める）

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && (session.user as Record<string, unknown>).isAdmin);
}

function safeFileName(name: string) {
  return name.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
}

// 管理者専用：画像を Vercel Blob にアップロードし、公開 URL を返す。
export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "管理者ログインが必要です" }, { status: 403 });
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

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const base = safeFileName(file.name.replace(/\.[^.]+$/, ""));
    const path = `cms/${Date.now()}_${randomUUID()}_${base}.${ext}`;
    const blob = await put(path, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[admin/upload] failed", error);

    if (message.includes("No blob credentials") || message.includes("BLOB_READ_WRITE_TOKEN") || message.includes("token")) {
      return NextResponse.json(
        { error: "Vercel Blob の接続情報が見つかりません。Blob StoreをVercelプロジェクトに接続して再デプロイしてください。" },
        { status: 500 }
      );
    }

    if (message.includes("forbidden") || message.includes("403") || message.includes("unauthorized")) {
      return NextResponse.json(
        { error: "Vercel Blob への書き込み権限がありません。Blob token を確認してください。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "画像アップロードに失敗しました" }, { status: 500 });
  }
}
