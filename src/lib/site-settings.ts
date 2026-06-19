import { adminDb } from "./firebase-admin";
import {
  SITE_SETTINGS_DEFAULT,
  SITE_SETTINGS_EN_DEFAULT,
  type SiteLocale,
  type SiteSettings,
} from "@/data/siteSettings";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (!isRecord(base)) {
    return (override === undefined ? base : override) as T;
  }

  const source = isRecord(override) ? override : {};
  const next: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(source)) {
    next[key] = key in next ? mergeDeep(next[key], value) : value;
  }
  return next as T;
}

function settingsDocId(locale: SiteLocale) {
  return locale === "en" ? "general_en" : "general";
}

function defaultSettings(locale: SiteLocale) {
  return locale === "en" ? SITE_SETTINGS_EN_DEFAULT : SITE_SETTINGS_DEFAULT;
}

export async function getSiteSettings(locale: SiteLocale = "ja"): Promise<SiteSettings> {
  const fallback = defaultSettings(locale);
  const snap = await adminDb.collection("siteSettings").doc(settingsDocId(locale)).get();
  if (!snap.exists) return fallback;
  return mergeDeep(fallback, snap.data());
}

export async function upsertSiteSettings(data: Partial<SiteSettings>, locale: SiteLocale = "ja") {
  await adminDb.collection("siteSettings").doc(settingsDocId(locale)).set(data, { merge: true });
}
