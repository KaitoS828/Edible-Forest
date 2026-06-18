import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { upsertCmsReport } from "@/lib/firestore";

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && (session.user as Record<string, unknown>).isAdmin);
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `report-${Date.now()}`;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const title = typeof body.title === "string" ? body.title : "";
  const id = typeof body.id === "string" && body.id.trim() ? slugify(body.id) : slugify(title);

  await upsertCmsReport(id, {
    title,
    date: typeof body.date === "string" ? body.date : "",
    category: typeof body.category === "string" ? body.category : "",
    image: typeof body.imageUrl === "string" && body.imageUrl ? { url: body.imageUrl } : undefined,
    body: typeof body.body === "string" ? body.body : "",
    status: body.status === "published" ? "published" : "draft",
    active: body.active !== false,
  });

  return NextResponse.json({ ok: true, id });
}
