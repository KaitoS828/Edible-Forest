import { getPage, getReports } from "@/lib/cms";
import HomeClient, { type SlideView, type NewsView } from "./HomeClient";

export const revalidate = 60;

export default async function Home() {
  const [top, reports] = await Promise.all([
    getPage("top").catch(() => null),
    getReports().catch(() => []),
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

  // 更新履歴：直近のレポートから生成（無ければ HomeClient のデフォルト）
  const news: NewsView[] | undefined = reports.length
    ? reports.slice(0, 4).map((r) => ({
        date: r.date ? r.date.replace(/-/g, ".").slice(0, 7) : "",
        label: "",
        text: r.title,
        href: `/reports/${r.id}`,
      }))
    : undefined;

  return <HomeClient slides={slides} news={news} />;
}
