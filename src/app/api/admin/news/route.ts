import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { upsertCmsNews, upsertCmsReport } from "@/lib/firestore";

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && (session.user as Record<string, unknown>).isAdmin);
}

function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug && /[a-z]/.test(slug) ? slug : `news-${Date.now()}`;
}

function imageData(value: unknown) {
  return typeof value === "string" && value.trim() ? { image: { url: value.trim() } } : {};
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const title = typeof body.title === "string" ? body.title : "";
  const id = typeof body.id === "string" && body.id.trim() ? slugify(body.id) : slugify(title);

  await upsertCmsNews(id, {
    title,
    date: typeof body.date === "string" ? body.date : "",
    label: typeof body.label === "string" ? body.label : "",
    href: typeof body.href === "string" && body.href ? body.href : `/reports/${id}`,
    category: typeof body.category === "string" ? body.category : "ニュース",
    ...imageData(body.imageUrl),
    body: typeof body.body === "string" ? body.body : "",
    status: body.status === "published" ? "published" : "draft",
    active: body.active !== false,
  });

  await upsertCmsReport(id, {
    title,
    date: typeof body.date === "string" ? body.date : "",
    category: typeof body.category === "string" && body.category ? body.category : "ニュース",
    ...imageData(body.imageUrl),
    body: typeof body.body === "string" ? body.body : "",
    status: body.status === "published" ? "published" : "draft",
    active: body.active !== false,
  });

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath(`/reports/${id}`);

  return NextResponse.json({ ok: true, id });
}
