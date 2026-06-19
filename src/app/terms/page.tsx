import { StaticDocPage } from "@/components/StaticDocPage";
import { getPage } from "@/lib/cms";
import { LEGAL_DEFAULTS } from "@/data/legalContent";

export const metadata = {
  title: "利用規約 | アンサンブル倶楽部～食べられる森を目指して～",
};

export const revalidate = 60;

export default async function TermsPage() {
  const page = await getPage("terms").catch(() => null);
  return (
    <StaticDocPage
      title={page?.heroTitle || LEGAL_DEFAULTS.terms.title}
      bodyHtml={page?.body || LEGAL_DEFAULTS.terms.body}
    />
  );
}
