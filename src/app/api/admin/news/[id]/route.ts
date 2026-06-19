import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { deleteCmsNews, deleteCmsReport, upsertCmsNews, upsertCmsReport } from "@/lib/firestore";

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
  const locale = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "ja";

  const newsData = {
    title: typeof body.title === "string" ? body.title : "",
    date: typeof body.date === "string" ? body.date : "",
    label: typeof body.label === "string" ? body.label : "",
    href: typeof body.href === "string" && body.href ? body.href : `/reports/${id}`,
    category: typeof body.category === "string" ? body.category : "ニュース",
    image: typeof body.imageUrl === "string" && body.imageUrl ? { url: body.imageUrl } : undefined,
    body: typeof body.body === "string" ? body.body : "",
    status: body.status === "published" ? "published" : "draft",
    active: body.active !== false,
  } as const;

  const reportData = {
    title: typeof body.title === "string" ? body.title : "",
    date: typeof body.date === "string" ? body.date : "",
    category: typeof body.category === "string" && body.category ? body.category : "ニュース",
    image: typeof body.imageUrl === "string" && body.imageUrl ? { url: body.imageUrl } : undefined,
    body: typeof body.body === "string" ? body.body : "",
    status: body.status === "published" ? "published" : "draft",
    active: body.active !== false,
  } as const;

  if (locale === "en") {
    await upsertCmsNews(id, {
      active: body.active !== false,
      status: body.status === "published" ? "published" : "draft",
      translations: { en: newsData },
    });
    await upsertCmsReport(id, {
      active: body.active !== false,
      status: body.status === "published" ? "published" : "draft",
      translations: { en: reportData },
    });
  } else {
    await upsertCmsNews(id, newsData);
    await upsertCmsReport(id, reportData);
  }

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath(`/reports/${id}`);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await deleteCmsNews(id);
  await deleteCmsReport(id);
  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath(`/reports/${id}`);
  return NextResponse.json({ ok: true });
}
