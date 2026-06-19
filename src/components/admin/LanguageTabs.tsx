import type { SiteLocale } from "@/data/siteSettings";

// 各CMS編集画面で日本語 / English を切り替える共通タブ。
// 英語は同じコンテンツIDの translations.en に保存する（?lang=en）。
export function LanguageTabs({ baseHref, locale }: { baseHref: string; locale: SiteLocale }) {
  const tabs = [
    { locale: "ja" as const, label: "日本語", href: baseHref },
    { locale: "en" as const, label: "English", href: `${baseHref}?lang=en` },
  ];

  return (
    <div className="flex flex-wrap gap-2 rounded-md border bg-white p-2" style={{ borderColor: "#DCE3EA" }}>
      {tabs.map((tab) => {
        const active = tab.locale === locale;
        return (
          <a
            key={tab.locale}
            href={tab.href}
            className="rounded-md px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: active ? "#0F172A" : "#FFFFFF",
              border: `1px solid ${active ? "#0F172A" : "#CBD5E1"}`,
              color: active ? "#FFFFFF" : "#334155",
            }}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}
