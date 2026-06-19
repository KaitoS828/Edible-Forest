import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteLocale } from "@/data/siteSettings";

export const dynamic = "force-dynamic";

function parseLocale(value: string | null): SiteLocale {
  return value === "en" ? "en" : "ja";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const settings = await getSiteSettings(parseLocale(url.searchParams.get("lang")));
  return NextResponse.json(settings);
}
