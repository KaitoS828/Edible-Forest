import { StaticDocPage } from "@/components/StaticDocPage";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "運営会社 | アンサンブル倶楽部～食べられる森を目指して～",
};

export const revalidate = 60;

export default async function CompanyPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const locale = lang === "en" ? "en" : "ja";
  const settings = await getSiteSettings(locale).catch(() => null);
  const doc = settings?.legal.company;
  return <StaticDocPage title={doc?.title || "運営会社"} bodyHtml={doc?.body || ""} />;
}
