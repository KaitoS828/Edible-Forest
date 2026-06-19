import { getNews, getPageByLocale, getReports } from "@/lib/cms";
import HomeClient, { type SlideView, type NewsView } from "./HomeClient";

export const revalidate = 60;

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const locale = lang === "en" ? "en" : "ja";
  const [top, newsItems, reports] = await Promise.all([
    getPageByLocale("top", locale).catch(() => null),
    getNews(locale).catch(() => []),
    getReports(locale).catch(() => []),
  ]);

  // Hero スライド：CMS の pages.top.slides があればそれ、無ければ HomeClient のデフォルト
  const slides: SlideView[] | undefined = top?.slides?.length
    ? top.slides.map((s) => ({
        img: s.image?.url ?? "",
        label: s.label ?? "",
        title: s.title ?? "",
        link: s.link ?? "/",
        linkLabel: s.linkLabel ?? "詳しくみる",
      }))
    : undefined;

  // 更新履歴：Firestore の news を優先し、未登録時だけ既存レポートから補完
  const news: NewsView[] | undefined = newsItems.length
    ? newsItems.slice(0, 4).map((item) => ({
        date: item.date ? item.date.replace(/-/g, ".").slice(0, 7) : "",
        label: item.label ?? "",
        text: item.title,
        href: item.href || "/",
      }))
    : reports.length
      ? reports.slice(0, 4).map((r) => ({
        date: r.date ? r.date.replace(/-/g, ".").slice(0, 7) : "",
        label: "",
        text: r.title,
        href: `/reports/${r.id}`,
      }))
      : undefined;

  const concept =
    top?.conceptTag || top?.conceptTitle || top?.conceptLinkLabel
      ? { tag: top?.conceptTag, title: top?.conceptTitle, linkLabel: top?.conceptLinkLabel }
      : undefined;

  return (
    <HomeClient
      slides={slides}
      news={news}
      concept={concept}
      forestSectionTitle={top?.forestSectionTitle}
      ensembleSectionTitle={top?.ensembleSectionTitle}
    />
  );
}
