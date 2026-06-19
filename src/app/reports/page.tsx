import { getReports } from "@/lib/cms";
import { getSiteSettings } from "@/lib/site-settings";
import ReportsClient from "./ReportsClient";
import type { SiteLocale } from "@/data/siteSettings";

export const revalidate = 60;

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const locale: SiteLocale = lang === "en" ? "en" : "ja";
  const [reports, settings] = await Promise.all([
    getReports(locale).catch(() => []),
    getSiteSettings(locale).catch(() => null),
  ]);
  return <ReportsClient reports={reports} pageText={settings?.pages.reports} />;
}
