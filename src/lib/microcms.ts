import { createClient } from "microcms-js-sdk";

// ─────────────────────────────────────────
// クライアント（未設定時は null → 各関数が安全な空値を返す）
// ─────────────────────────────────────────
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;
export const isCmsConfigured = !!serviceDomain && !!apiKey;

const client = isCmsConfigured
  ? createClient({ serviceDomain: serviceDomain!, apiKey: apiKey! })
  : null;

// ─────────────────────────────────────────
// 共通型
// ─────────────────────────────────────────
export type MicroCMSImage = { url: string; height?: number; width?: number };

export type StatItem = { fieldId: string; label: string; value: string };

export type ActivityItem = {
  fieldId: string;
  name?: string;
  title?: string;
  description?: string;
  desc?: string;
  icon?: string;
  image?: MicroCMSImage[];
};

// ─────────────────────────────────────────
// ensembles（type=ensemble / type=spot を内包）
// ─────────────────────────────────────────
export type Ensemble = {
  id: string;
  type?: "ensemble" | "spot";
  title: string;
  sub?: string;
  forestType?: string;
  tags?: string;
  heroImage?: MicroCMSImage;
  philosophy?: string;
  caution?: string;
  travelConditions?: string;
  stats?: StatItem[];
  activity?: ActivityItem[];
  gallery?: MicroCMSImage[];
  bookingUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export async function getEnsembles(): Promise<Ensemble[]> {
  if (!client) return [];
  try {
    const res = await client.getList<Ensemble>({
      endpoint: "ensembles",
      queries: { filters: "type[equals]ensemble", limit: 100 },
    });
    return res.contents;
  } catch {
    return [];
  }
}

export async function getEnsemble(id: string): Promise<Ensemble | null> {
  if (!client) return null;
  try {
    return await client.getListDetail<Ensemble>({ endpoint: "ensembles", contentId: id });
  } catch {
    return null;
  }
}

export async function getSpots(): Promise<Ensemble[]> {
  if (!client) return [];
  try {
    const res = await client.getList<Ensemble>({
      endpoint: "ensembles",
      queries: { filters: "type[equals]spot", limit: 100 },
    });
    return res.contents;
  } catch {
    return [];
  }
}

/** ensembles エンドポイント全件（type 問わず） */
export async function getAllEnsembleEntries(): Promise<Ensemble[]> {
  if (!client) return [];
  try {
    const res = await client.getList<Ensemble>({ endpoint: "ensembles", queries: { limit: 100 } });
    return res.contents;
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────
// pages（公開ページの文言を丸ごとCMS管理）
// ─────────────────────────────────────────
export type Slide = {
  fieldId: string;
  image?: MicroCMSImage;
  label?: string;
  title?: string;
  link?: string;
  linkLabel?: string;
};

export type Page = {
  id: string;
  pageId: string;
  heroTitle?: string;
  heroCaption?: string;
  body?: string;
  conceptTag?: string;
  conceptLinkLabel?: string;
  slides?: Slide[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export async function getPage(pageId: string): Promise<Page | null> {
  if (!client) return null;
  try {
    const res = await client.getList<Page>({
      endpoint: "pages",
      queries: { filters: `pageId[equals]${pageId}`, limit: 1 },
    });
    return res.contents[0] ?? null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────
// reports（活動レポート）
// ─────────────────────────────────────────
export type Report = {
  id: string;
  title: string;
  date?: string;
  category?: string;
  image?: MicroCMSImage;
  body?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export async function getReports(): Promise<Report[]> {
  if (!client) return [];
  try {
    const res = await client.getList<Report>({
      endpoint: "reports",
      queries: { limit: 100, orders: "-publishedAt" },
    });
    return res.contents;
  } catch {
    return [];
  }
}

export async function getReport(id: string): Promise<Report | null> {
  if (!client) return null;
  try {
    return await client.getListDetail<Report>({ endpoint: "reports", contentId: id });
  } catch {
    return null;
  }
}
