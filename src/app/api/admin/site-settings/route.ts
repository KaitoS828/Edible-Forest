import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { upsertSiteSettings } from "@/lib/site-settings";
import type { SiteLocale } from "@/data/siteSettings";

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && (session.user as Record<string, unknown>).isAdmin);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const locale: SiteLocale = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "ja";
  const body = await req.json();
  await upsertSiteSettings(body, locale);
  ["/", "/concept", "/ensembles", "/spots", "/reports", "/events"].forEach((path) => {
    revalidatePath(path);
  });
  return NextResponse.json({ ok: true });
}
