import { getSiteSettings } from "@/lib/site-settings";
import SiteSettingsForm from "./SiteSettingsForm";

export default async function AdminSiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          Site settings
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          サイト設定
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
          microCMSを使わず、ナビゲーション・フッター・主要ページ文言をFirestoreで管理します
        </p>
      </div>

      <SiteSettingsForm initialData={settings} />
    </div>
  );
}
