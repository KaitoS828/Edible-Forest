import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteCmsReport, upsertCmsReport } from "@/lib/firestore";

interface Ctx {
  params: Promise<{ id: string }>;
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && (session.user as Record<string, unknown>).isAdmin);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown>;

  await upsertCmsReport(id, {
    title: typeof body.title === "string" ? body.title : "",
    date: typeof body.date === "string" ? body.date : "",
    category: typeof body.category === "string" ? body.category : "",
    image: typeof body.imageUrl === "string" && body.imageUrl ? { url: body.imageUrl } : undefined,
    body: typeof body.body === "string" ? body.body : "",
    status: body.status === "published" ? "published" : "draft",
    active: body.active !== false,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await deleteCmsReport(id);
  return NextResponse.json({ ok: true });
}
