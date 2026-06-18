import { getReports } from "@/lib/cms";
import ReportsClient from "./ReportsClient";

export const revalidate = 60;

export default async function ReportsPage() {
  const reports = await getReports().catch(() => []);
  return <ReportsClient reports={reports} />;
}
