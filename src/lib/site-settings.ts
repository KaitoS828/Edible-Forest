import { adminDb } from "./firebase-admin";
import { SITE_SETTINGS_DEFAULT, type SiteSettings } from "@/data/siteSettings";

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

export async function getSiteSettings(): Promise<SiteSettings> {
  const snap = await adminDb.collection("siteSettings").doc("general").get();
  if (!snap.exists) return SITE_SETTINGS_DEFAULT;
  return mergeDeep(SITE_SETTINGS_DEFAULT, snap.data());
}

export async function upsertSiteSettings(data: Partial<SiteSettings>) {
  await adminDb.collection("siteSettings").doc("general").set(data, { merge: true });
}
