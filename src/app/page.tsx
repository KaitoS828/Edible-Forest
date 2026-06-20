import { getReports } from "@/lib/cms";
import { getSiteSettings } from "@/lib/site-settings";
import { SITE_SETTINGS_DEFAULT, SITE_SETTINGS_EN_DEFAULT } from "@/data/siteSettings";
import HomeClient, { type SlideView, type NewsView } from "./HomeClient";

export const revalidate = 60;

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const locale = lang === "en" ? "en" : "ja";
  const [settings, reports] = await Promise.all([
    getSiteSettings(locale).catch(() => (locale === "en" ? SITE_SETTINGS_EN_DEFAULT : SITE_SETTINGS_DEFAULT)),
    getReports(locale).catch(() => []),
  ]);

  // Hero スライド：サイト設定の home.slides（未設定時は HomeClient のデフォルト）
  const slides: SlideView[] | undefined = settings.home.slides?.length
    ? settings.home.slides.map((s) => ({
        img: s.img,
        label: s.label,
        title: s.title,
        link: s.link || "/",
        linkLabel: s.linkLabel || "詳しくみる",
      }))
    : undefined;

  // 更新履歴：活動レポートを日付の新しい順に表示
  const news: NewsView[] | undefined = reports.length
    ? [...reports]
        .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
        .slice(0, 4)
        .map((r) => ({
          date: r.date ? r.date.replace(/-/g, ".").slice(0, 7) : "",
          label: "",
          text: r.title,
          href: `/reports/${r.id}`,
        }))
    : undefined;

  const concept = {
    tag: settings.home.conceptTag,
    title: settings.home.conceptTitle,
    linkLabel: settings.home.conceptLinkLabel,
  };

  return (
    <HomeClient
      slides={slides}
      news={news}
      concept={concept}
      forestSectionTitle={settings.home.forestSectionTitle}
      ensembleSectionTitle={settings.home.ensembleSectionTitle}
    />
  );
}
