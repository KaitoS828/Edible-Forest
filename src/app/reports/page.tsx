import { getReports } from "@/lib/cms";
import { getSiteSettings } from "@/lib/site-settings";
import ReportsClient from "./ReportsClient";

export const revalidate = 60;

export default async function ReportsPage() {
  const [reports, settings] = await Promise.all([
    getReports().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);
  return <ReportsClient reports={reports} pageText={settings?.pages.reports} />;
}
