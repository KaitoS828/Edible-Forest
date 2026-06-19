import { StaticDocPage } from "@/components/StaticDocPage";
import { getPage } from "@/lib/cms";
import { LEGAL_DEFAULTS } from "@/data/legalContent";

export const metadata = {
  title: "運営会社 | アンサンブル倶楽部～食べられる森を目指して～",
};

export const revalidate = 60;

export default async function CompanyPage() {
  const page = await getPage("company").catch(() => null);
  return (
    <StaticDocPage
      title={page?.heroTitle || LEGAL_DEFAULTS.company.title}
      bodyHtml={page?.body || LEGAL_DEFAULTS.company.body}
    />
  );
}
