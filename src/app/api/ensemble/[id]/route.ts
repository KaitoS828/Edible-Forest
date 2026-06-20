import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteEnsemble, updateEnsemble, type EnsembleDoc } from "@/lib/firestore";

type Ctx = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return Boolean((session.user as Record<string, unknown>).isAdmin);
}

function getOptionalBoolean(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "boolean" ? value : undefined;
}

export async function PATCH(
  req: NextRequest,
  { params }: Ctx
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown>;
  const locale = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "ja";
  const status: EnsembleDoc["status"] = body.status === "published" ? "published" : "draft";

  const str = (v: unknown) => (typeof v === "string" ? v : "");

  try {
    if (locale === "en") {
      // 英語版は同じコンテンツIDの translations.en にのみ保存（構造的な値は共有）
      await updateEnsemble(id, {
        translations: {
          en: {
            name: str(body.name),
            sub: str(body.sub),
            desc: str(body.desc),
            tagline: str(body.tagline),
            philosophy: str(body.philosophy),
          },
        },
        active: getOptionalBoolean(body, "active") ?? false,
        status,
        isOfficial: getOptionalBoolean(body, "isOfficial") ?? false,
      });
    } else {
      await updateEnsemble(id, {
        ...body,
        active: getOptionalBoolean(body, "active") ?? false,
        status,
        isOfficial: getOptionalBoolean(body, "isOfficial") ?? false,
      });
    }
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await deleteEnsemble(id);
  return NextResponse.json({ ok: true });
}
