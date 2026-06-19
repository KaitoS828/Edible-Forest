import { getSiteSettings } from "@/lib/site-settings";
import SiteSettingsForm from "../SiteSettingsForm";

export default async function AdminEnglishSiteSettingsPage() {
  const settings = await getSiteSettings("en");

  return (
    <div>
      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          English CMS
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          英語版サイト設定
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
          英語版のナビゲーション・フッター・主要ページ文言をFirestoreで管理します
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <a
          href="/admin/site-settings"
          className="rounded-md border px-3 py-2 text-sm font-medium"
          style={{ borderColor: "#CBD5E1", color: "#475569" }}
        >
          日本語版
        </a>
        <a
          href="/admin/site-settings/en"
          className="rounded-md px-3 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "#0F172A" }}
        >
          英語版
        </a>
      </div>

      <SiteSettingsForm initialData={settings} locale="en" />
    </div>
  );
}
