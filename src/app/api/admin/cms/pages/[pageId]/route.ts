import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { upsertCmsPage } from "@/lib/firestore";

interface Ctx {
  params: Promise<{ pageId: string }>;
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && (session.user as Record<string, unknown>).isAdmin);
}

function stringValue(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value : "";
}

function slidesValue(body: Record<string, unknown>) {
  const slides = body.slides;
  if (!Array.isArray(slides)) return [];
  return slides.map((item, index) => {
    const slide = item as Record<string, unknown>;
    const imageUrl = typeof slide.imageUrl === "string" ? slide.imageUrl : "";
    return {
      fieldId: String(slide.fieldId ?? index),
      image: imageUrl ? { url: imageUrl } : undefined,
      label: typeof slide.label === "string" ? slide.label : "",
      title: typeof slide.title === "string" ? slide.title : "",
      link: typeof slide.link === "string" ? slide.link : "",
      linkLabel: typeof slide.linkLabel === "string" ? slide.linkLabel : "",
    };
  });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { pageId } = await params;
  const body = (await req.json()) as Record<string, unknown>;

  await upsertCmsPage(pageId, {
    pageId,
    heroTitle: stringValue(body, "heroTitle"),
    heroCaption: stringValue(body, "heroCaption"),
    body: stringValue(body, "body"),
    conceptTag: stringValue(body, "conceptTag"),
    conceptLinkLabel: stringValue(body, "conceptLinkLabel"),
    slides: slidesValue(body),
    active: body.active !== false,
  });

  return NextResponse.json({ ok: true });
}
