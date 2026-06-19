import { StaticDocPage } from "@/components/StaticDocPage";
import { getPage } from "@/lib/cms";
import { LEGAL_DEFAULTS } from "@/data/legalContent";

export const metadata = {
  title: "プライバシーポリシー | アンサンブル倶楽部～食べられる森を目指して～",
};

export const revalidate = 60;

export default async function PrivacyPage() {
  const page = await getPage("privacy").catch(() => null);
  return (
    <StaticDocPage
      title={page?.heroTitle || LEGAL_DEFAULTS.privacy.title}
      bodyHtml={page?.body || LEGAL_DEFAULTS.privacy.body}
    />
  );
}
