import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateEnsemble } from "@/lib/firestore";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(session.user as Record<string, unknown>)?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const locale = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "ja";

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
      });
    } else {
      await updateEnsemble(id, body);
    }
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
