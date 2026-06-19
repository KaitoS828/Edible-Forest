"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type {
  ConceptCardSetting,
  ExternalLinkSetting,
  FooterLinkSetting,
  ForestTypeSetting,
  LanguageLinkSetting,
  NavItemSetting,
  PageTextSetting,
  SiteLocale,
  SiteSettings,
} from "@/data/siteSettings";

type TabKey = "navigation" | "home" | "pages" | "concept" | "footer" | "advanced";

const TABS: Array<{ key: TabKey; label: string; desc: string }> = [
  { key: "navigation", label: "ヘッダー", desc: "メニュー、各種リンク、言語切替" },
  { key: "home", label: "トップ", desc: "森タイプ、参加カード、導線" },
  { key: "pages", label: "ページ文言", desc: "一覧ページの見出しとCTA" },
  { key: "concept", label: "コンセプト", desc: "補助カードとCTA" },
  { key: "footer", label: "フッター", desc: "リンクとコピーライト" },
  { key: "advanced", label: "上級設定", desc: "地図データなど" },
];

const PAGE_LABELS: Record<keyof SiteSettings["pages"], string> = {
  ensembles: "アンサンブル一覧",
  spots: "宿泊施設一覧",
  reports: "活動レポート",
  events: "イベント一覧",
};

const ICON_OPTIONS: Array<{ value: NonNullable<ExternalLinkSetting["icon"]>; label: string }> = [
  { value: "note", label: "note" },
  { value: "facebook", label: "Facebook" },
  { value: "x", label: "X" },
  { value: "link", label: "汎用リンク" },
];

function cloneSettings(settings: SiteSettings): SiteSettings {
  return JSON.parse(JSON.stringify(settings)) as SiteSettings;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold" style={{ color: "#334155" }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[11px] leading-relaxed" style={{ color: "#64748B" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

function TextInput(props: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:border-slate-500 ${props.className ?? ""}`}
      style={{ borderColor: "#CBD5E1", color: "#0F172A", backgroundColor: "#FFFFFF", ...props.style }}
    />
  );
}

function TextArea(props: React.ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border px-3 py-2 text-sm leading-relaxed outline-none transition-colors focus:border-slate-500 ${props.className ?? ""}`}
      style={{ borderColor: "#CBD5E1", color: "#0F172A", backgroundColor: "#FFFFFF", ...props.style }}
    />
  );
}

function Select(props: React.ComponentPropsWithoutRef<"select">) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:border-slate-500 ${props.className ?? ""}`}
      style={{ borderColor: "#CBD5E1", color: "#0F172A", backgroundColor: "#FFFFFF", ...props.style }}
    />
  );
}

function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-md border bg-white" style={{ borderColor: "#DCE3EA" }}>
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: "#E5EAF0" }}>
        <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>
          {title}
        </h2>
        {action}
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function SmallButton({
  children,
  onClick,
  tone = "plain",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "plain" | "danger" | "primary";
}) {
  const styles = {
    plain: { borderColor: "#CBD5E1", color: "#334155", backgroundColor: "#FFFFFF" },
    danger: { borderColor: "#FECACA", color: "#B42318", backgroundColor: "#FEF2F2" },
    primary: { borderColor: "#0F172A", color: "#FFFFFF", backgroundColor: "#0F172A" },
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
      style={styles}
    >
      {children}
    </button>
  );
}

export default function SiteSettingsForm({ initialData, locale = "ja" }: { initialData: SiteSettings; locale?: SiteLocale }) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(() => cloneSettings(initialData));
  const [activeTab, setActiveTab] = useState<TabKey>("navigation");
  const [advancedMapJson, setAdvancedMapJson] = useState(() => JSON.stringify(initialData.map.regions, null, 2));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languageLabel = locale === "en" ? "英語版" : "日本語版";
  const activeMeta = useMemo(() => TABS.find((tab) => tab.key === activeTab) ?? TABS[0], [activeTab]);

  function update(mutator: (draft: SiteSettings) => void) {
    setSettings((current) => {
      const draft = cloneSettings(current);
      mutator(draft);
      return draft;
    });
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      let next = settings;
      if (activeTab === "advanced") {
        next = cloneSettings(settings);
        next.map.regions = JSON.parse(advancedMapJson) as SiteSettings["map"]["regions"];
      }

      const res = await fetch(`/api/admin/site-settings?lang=${locale}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("保存に失敗しました");
      setSettings(next);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  const navItems = settings.navigation.headerItems;
  const externalLinks = settings.navigation.externalLinks ?? [];
  const languageLinks = settings.navigation.languageLinks ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(error || saved) && (
        <div
          className="rounded-md border px-4 py-3 text-sm"
          style={{
            borderColor: error ? "#FECACA" : "#BBF7D0",
            backgroundColor: error ? "#FEF2F2" : "#F0FDF4",
            color: error ? "#B42318" : "#166534",
          }}
        >
          {error ?? `${languageLabel}を保存しました。公開ページへ反映されます。`}
        </div>
      )}

      <div className="rounded-md border bg-white p-3" style={{ borderColor: "#DCE3EA" }}>
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className="rounded-md border px-3 py-3 text-left transition-colors"
                style={{
                  borderColor: active ? "#0F172A" : "#E2E8F0",
                  backgroundColor: active ? "#0F172A" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#334155",
                }}
              >
                <span className="block text-sm font-semibold">{tab.label}</span>
                <span className="mt-1 block text-[11px] leading-snug opacity-75">{tab.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          {languageLabel}
        </p>
        <h2 className="mt-1 text-xl font-semibold" style={{ color: "#0F172A" }}>
          {activeMeta.label}
        </h2>
      </div>

      {activeTab === "navigation" && (
        <div className="space-y-5">
          <Card
            title="ヘッダーメニュー"
            action={
              <SmallButton
                tone="primary"
                onClick={() => update((draft) => draft.navigation.headerItems.push({ label: "新しいメニュー", href: "/" }))}
              >
                追加
              </SmallButton>
            }
          >
            {navItems.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_1fr_auto]" style={{ borderColor: "#E2E8F0" }}>
                <Field label="表示名">
                  <TextInput value={item.label} onChange={(e) => update((draft) => { draft.navigation.headerItems[index].label = e.target.value; })} />
                </Field>
                <Field label="リンク先">
                  <TextInput value={item.href} onChange={(e) => update((draft) => { draft.navigation.headerItems[index].href = e.target.value; })} />
                </Field>
                <div className="flex items-end">
                  <SmallButton tone="danger" onClick={() => update((draft) => { draft.navigation.headerItems.splice(index, 1); })}>
                    削除
                  </SmallButton>
                </div>
              </div>
            ))}
          </Card>

          <Card title="会員導線">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="参加ボタン">
                <TextInput value={settings.navigation.joinLabel} onChange={(e) => update((draft) => { draft.navigation.joinLabel = e.target.value; })} />
              </Field>
              <Field label="ログイン">
                <TextInput value={settings.navigation.loginLabel} onChange={(e) => update((draft) => { draft.navigation.loginLabel = e.target.value; })} />
              </Field>
              <Field label="マイページ">
                <TextInput value={settings.navigation.myPageLabel} onChange={(e) => update((draft) => { draft.navigation.myPageLabel = e.target.value; })} />
              </Field>
              <Field label="ログアウト">
                <TextInput value={settings.navigation.logoutLabel} onChange={(e) => update((draft) => { draft.navigation.logoutLabel = e.target.value; })} />
              </Field>
            </div>
          </Card>

          <Card
            title="各種リンク"
            action={
              <SmallButton
                tone="primary"
                onClick={() => update((draft) => {
                  draft.navigation.externalLinks = draft.navigation.externalLinks ?? [];
                  draft.navigation.externalLinks.push({ label: "新しいリンク", href: "", icon: "link" });
                })}
              >
                追加
              </SmallButton>
            }
          >
            {externalLinks.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_1fr_160px_auto]" style={{ borderColor: "#E2E8F0" }}>
                <Field label="表示名">
                  <TextInput value={item.label} onChange={(e) => update((draft) => { draft.navigation.externalLinks![index].label = e.target.value; })} />
                </Field>
                <Field label="URL">
                  <TextInput value={item.href ?? ""} placeholder="空欄なら準備中表示" onChange={(e) => update((draft) => { draft.navigation.externalLinks![index].href = e.target.value || undefined; })} />
                </Field>
                <Field label="アイコン">
                  <Select value={item.icon ?? "link"} onChange={(e) => update((draft) => { draft.navigation.externalLinks![index].icon = e.target.value as ExternalLinkSetting["icon"]; })}>
                    {ICON_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </Select>
                </Field>
                <div className="flex items-end">
                  <SmallButton tone="danger" onClick={() => update((draft) => { draft.navigation.externalLinks!.splice(index, 1); })}>
                    削除
                  </SmallButton>
                </div>
              </div>
            ))}
          </Card>

          <Card title="言語切替">
            <div className="grid gap-3">
              {languageLinks.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_110px_1fr_100px]" style={{ borderColor: "#E2E8F0" }}>
                  <Field label="表示名">
                    <TextInput value={item.label} onChange={(e) => update((draft) => { draft.navigation.languageLinks![index].label = e.target.value; })} />
                  </Field>
                  <Field label="短縮">
                    <TextInput value={item.shortLabel} onChange={(e) => update((draft) => { draft.navigation.languageLinks![index].shortLabel = e.target.value; })} />
                  </Field>
                  <Field label="リンク先">
                    <TextInput value={item.href ?? ""} onChange={(e) => update((draft) => { draft.navigation.languageLinks![index].href = e.target.value || undefined; })} />
                  </Field>
                  <label className="flex items-end gap-2 pb-2 text-sm" style={{ color: "#334155" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(item.active)}
                      onChange={(e) => update((draft) => { draft.navigation.languageLinks![index].active = e.target.checked; })}
                    />
                    選択中
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "home" && (
        <div className="space-y-5">
          <EditableList<ForestTypeSetting>
            title="トップの森タイプ"
            items={settings.home.forestTypes}
            addLabel="森タイプを追加"
            createItem={() => ({ emoji: "🌿", label: "新しい森", href: "/spots" })}
            update={update}
            path={(draft) => draft.home.forestTypes}
            render={(item, index, set) => (
              <div className="grid gap-3 md:grid-cols-[100px_1fr_1fr]">
                <Field label="絵文字"><TextInput value={item.emoji} onChange={(e) => set(index, "emoji", e.target.value)} /></Field>
                <Field label="表示名"><TextInput value={item.label} onChange={(e) => set(index, "label", e.target.value)} /></Field>
                <Field label="リンク先"><TextInput value={item.href} onChange={(e) => set(index, "href", e.target.value)} /></Field>
              </div>
            )}
          />

          <EditableList<SiteSettings["home"]["ensembleCategories"][number]>
            title="アンサンブル参加カード"
            items={settings.home.ensembleCategories}
            addLabel="カードを追加"
            createItem={() => ({ sub: "", label: "新しいカード", img: "", href: "/join" })}
            update={update}
            path={(draft) => draft.home.ensembleCategories}
            render={(item, index, set) => (
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="小見出し"><TextInput value={item.sub} onChange={(e) => set(index, "sub", e.target.value)} /></Field>
                <Field label="タイトル"><TextInput value={item.label} onChange={(e) => set(index, "label", e.target.value)} /></Field>
                <ImageUpload label="画像" value={item.img} onChange={(url) => set(index, "img", url)} />
                <Field label="リンク先"><TextInput value={item.href} onChange={(e) => set(index, "href", e.target.value)} /></Field>
              </div>
            )}
          />

          <EditableList<SiteSettings["home"]["ensembleActions"][number]>
            title="トップ下部の導線"
            items={settings.home.ensembleActions}
            addLabel="導線を追加"
            createItem={() => ({ emoji: "🌿", title: "新しい導線", desc: "", href: "/" })}
            update={update}
            path={(draft) => draft.home.ensembleActions}
            render={(item, index, set) => (
              <div className="grid gap-3 md:grid-cols-[100px_1fr_1fr]">
                <Field label="絵文字"><TextInput value={item.emoji} onChange={(e) => set(index, "emoji", e.target.value)} /></Field>
                <Field label="タイトル"><TextInput value={item.title} onChange={(e) => set(index, "title", e.target.value)} /></Field>
                <Field label="リンク先"><TextInput value={item.href} onChange={(e) => set(index, "href", e.target.value)} /></Field>
                <div className="md:col-span-3">
                  <Field label="説明"><TextArea rows={3} value={item.desc} onChange={(e) => set(index, "desc", e.target.value)} /></Field>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {activeTab === "pages" && (
        <div className="space-y-5">
          {(Object.keys(settings.pages) as Array<keyof SiteSettings["pages"]>).map((key) => (
            <Card key={key} title={PAGE_LABELS[key]}>
              <PageTextEditor value={settings.pages[key]} onChange={(value) => update((draft) => { draft.pages[key] = value; })} />
            </Card>
          ))}
        </div>
      )}

      {activeTab === "concept" && (
        <div className="space-y-5">
          <Card title="コンセプトCTA">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="ボタン文言">
                <TextInput value={settings.concept.ctaLabel} onChange={(e) => update((draft) => { draft.concept.ctaLabel = e.target.value; })} />
              </Field>
              <Field label="リンク先">
                <TextInput value={settings.concept.ctaHref} onChange={(e) => update((draft) => { draft.concept.ctaHref = e.target.value; })} />
              </Field>
            </div>
          </Card>
          <EditableList<ConceptCardSetting>
            title="コンセプト補助カード"
            items={settings.concept.examples}
            addLabel="カードを追加"
            createItem={() => ({ emoji: "🌿", title: "新しいカード", desc: "" })}
            update={update}
            path={(draft) => draft.concept.examples}
            render={(item, index, set) => (
              <div className="grid gap-3 md:grid-cols-[100px_1fr]">
                <Field label="絵文字"><TextInput value={item.emoji} onChange={(e) => set(index, "emoji", e.target.value)} /></Field>
                <Field label="タイトル"><TextInput value={item.title} onChange={(e) => set(index, "title", e.target.value)} /></Field>
                <div className="md:col-span-2">
                  <Field label="説明"><TextArea rows={3} value={item.desc} onChange={(e) => set(index, "desc", e.target.value)} /></Field>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {activeTab === "footer" && (
        <div className="space-y-5">
          <Card title="コピーライト">
            <Field label="コピーライト表記">
              <TextInput value={settings.footer.copyright} onChange={(e) => update((draft) => { draft.footer.copyright = e.target.value; })} />
            </Field>
          </Card>
          <EditableList<FooterLinkSetting>
            title="フッターリンク"
            items={settings.footer.links}
            addLabel="リンクを追加"
            createItem={() => ({ label: "新しいリンク", href: "/" })}
            update={update}
            path={(draft) => draft.footer.links}
            render={(item, index, set) => (
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="表示名"><TextInput value={item.label} onChange={(e) => set(index, "label", e.target.value)} /></Field>
                <Field label="リンク先"><TextInput value={item.href} onChange={(e) => set(index, "href", e.target.value)} /></Field>
              </div>
            )}
          />
        </div>
      )}

      {activeTab === "advanced" && (
        <Card title="地図データ">
          <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
            地図データは構造が複雑なため、通常は編集しません。地域名・説明文・拠点データを一括で調整する必要がある場合のみ編集してください。
          </p>
          <TextArea
            rows={18}
            spellCheck={false}
            value={advancedMapJson}
            onChange={(e) => {
              setAdvancedMapJson(e.target.value);
              setSaved(false);
            }}
            className="font-mono text-xs"
            style={{ backgroundColor: "#F8FAFC" }}
          />
        </Card>
      )}

      <div className="sticky bottom-0 z-10 flex justify-end border-t bg-white/95 px-1 py-4 backdrop-blur" style={{ borderColor: "#DCE3EA" }}>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "#0F172A" }}
        >
          {saving ? "保存中..." : `${languageLabel}を保存`}
        </button>
      </div>
    </form>
  );
}

function EditableList<T extends Record<string, unknown>>({
  title,
  items,
  addLabel,
  createItem,
  update,
  path,
  render,
}: {
  title: string;
  items: T[];
  addLabel: string;
  createItem: () => T;
  update: (mutator: (draft: SiteSettings) => void) => void;
  path: (draft: SiteSettings) => T[];
  render: (item: T, index: number, set: <K extends keyof T>(index: number, key: K, value: T[K]) => void) => React.ReactNode;
}) {
  function set<K extends keyof T>(index: number, key: K, value: T[K]) {
    update((draft) => {
      path(draft)[index][key] = value;
    });
  }

  return (
    <Card
      title={title}
      action={
        <SmallButton tone="primary" onClick={() => update((draft) => path(draft).push(createItem()))}>
          {addLabel}
        </SmallButton>
      }
    >
      {items.length === 0 && (
        <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: "#CBD5E1", color: "#64748B" }}>
          まだ登録がありません。
        </p>
      )}
      {items.map((item, index) => (
        <div key={index} className="rounded-md border p-4" style={{ borderColor: "#E2E8F0" }}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold" style={{ color: "#64748B" }}>
              {index + 1}件目
            </span>
            <SmallButton tone="danger" onClick={() => update((draft) => path(draft).splice(index, 1))}>
              削除
            </SmallButton>
          </div>
          {render(item, index, set)}
        </div>
      ))}
    </Card>
  );
}

function PageTextEditor({ value, onChange }: { value: PageTextSetting; onChange: (value: PageTextSetting) => void }) {
  function set(key: keyof PageTextSetting, next: string) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="小見出し">
        <TextInput value={value.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} />
      </Field>
      <Field label="タイトル">
        <TextInput value={value.title ?? ""} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <div className="md:col-span-2">
        <Field label="説明文">
          <TextArea rows={3} value={value.description ?? ""} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </div>
      <Field label="CTA文言">
        <TextInput value={value.ctaLabel ?? ""} onChange={(e) => set("ctaLabel", e.target.value)} />
      </Field>
      <Field label="CTAリンク">
        <TextInput value={value.ctaHref ?? ""} onChange={(e) => set("ctaHref", e.target.value)} />
      </Field>
    </div>
  );
}
