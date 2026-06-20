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
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <a
          href="/admin/site-settings"
          className="rounded-md px-3 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "#0F172A" }}
        >
          日本語版
        </a>
        <a
          href="/admin/site-settings/en"
          className="rounded-md border px-3 py-2 text-sm font-medium"
          style={{ borderColor: "#CBD5E1", color: "#475569" }}
        >
          英語版
        </a>
      </div>

      <SiteSettingsForm initialData={settings} />
    </div>
  );
}
