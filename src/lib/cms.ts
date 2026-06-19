import { adminDb } from "./firebase-admin";
import { getPublishedCmsNews, getPublishedEnsembles, getPublishedSpots } from "./firestore";
import { REPORTS as STATIC_REPORTS } from "@/data/reports";

export type CmsImage = { url: string; height?: number; width?: number };
export type StatItem = { fieldId: string; label: string; value: string };

export type ActivityItem = {
  fieldId: string;
  name?: string;
  title?: string;
  description?: string;
  desc?: string;
  icon?: string;
  image?: CmsImage[];
};

export type Ensemble = {
  id: string;
  type?: "ensemble" | "spot";
  title: string;
  sub?: string;
  forestType?: string;
  tags?: string;
  heroImage?: CmsImage;
  philosophy?: string;
  caution?: string;
  travelConditions?: string;
  stats?: StatItem[];
  activity?: ActivityItem[];
  gallery?: CmsImage[];
  bookingUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Slide = {
  fieldId: string;
  image?: CmsImage;
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
  conceptTitle?: string;
  conceptLinkLabel?: string;
  forestSectionTitle?: string;
  ensembleSectionTitle?: string;
  slides?: Slide[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Report = {
  id: string;
  title: string;
  date?: string;
  category?: string;
  image?: CmsImage;
  body?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type News = {
  id: string;
  title: string;
  date?: string;
  label?: string;
  href?: string;
  category?: string;
  image?: CmsImage;
  body?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

type CmsPageDoc = Omit<Page, "id" | "createdAt" | "updatedAt" | "publishedAt"> & {
  active?: boolean;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
  publishedAt?: FirebaseFirestore.Timestamp;
};

type CmsReportDoc = Omit<Report, "id" | "createdAt" | "updatedAt" | "publishedAt"> & {
  active?: boolean;
  status?: "draft" | "published";
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
  publishedAt?: FirebaseFirestore.Timestamp;
};

type CmsNewsDoc = Omit<News, "id" | "createdAt" | "updatedAt" | "publishedAt"> & {
  active?: boolean;
  status?: "draft" | "published";
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
  publishedAt?: FirebaseFirestore.Timestamp;
};

function ts(value?: FirebaseFirestore.Timestamp) {
  return value?.toDate?.().toISOString?.() ?? new Date(0).toISOString();
}

function image(url?: string): CmsImage | undefined {
  return url ? { url } : undefined;
}

function stat(label: string, value?: string): StatItem | null {
  return value ? { fieldId: label, label, value } : null;
}

function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter((item): item is T => Boolean(item));
}

export async function getEnsembles(): Promise<Ensemble[]> {
  const docs = await getPublishedEnsembles();
  return docs.map((doc) => ({
    id: doc.id,
    type: "ensemble",
    title: doc.name,
    sub: doc.sub || doc.region,
    forestType: doc.forestType,
    heroImage: image(doc.img),
    philosophy: doc.philosophy,
    caution: doc.notes?.join("\n"),
    travelConditions: doc.travelConditions,
    stats: doc.stats?.map((item) => ({ fieldId: item.label, ...item })) ?? [],
    activity: doc.activities?.map((item, index) => ({
      fieldId: String(index),
      title: item.title,
      name: item.title,
      desc: item.desc,
      description: item.desc,
      icon: item.icon,
      image: item.img ? [{ url: item.img }] : undefined,
    })) ?? [],
    gallery: doc.gallery?.map((url) => ({ url })) ?? [],
    createdAt: ts(doc.createdAt),
    updatedAt: ts(doc.updatedAt),
    publishedAt: ts(doc.updatedAt),
  }));
}

export async function getEnsemble(id: string): Promise<Ensemble | null> {
  const ensembles = await getEnsembles();
  const ensemble = ensembles.find((item) => item.id === id);
  if (ensemble) return ensemble;

  const spots = await getSpots();
  return spots.find((item) => item.id === id) ?? null;
}

export async function getSpots(): Promise<Ensemble[]> {
  const docs = await getPublishedSpots();
  return docs.map((doc) => ({
    id: doc.id,
    type: "spot",
    title: doc.name,
    sub: doc.sub || doc.region,
    forestType: doc.forestType,
    heroImage: image(doc.img),
    philosophy: doc.content,
    caution: doc.desc,
    stats: compact([
      stat("住所", doc.address),
      stat("定員", doc.capacity),
      stat("料金", doc.price),
      stat("アクセス", doc.access),
    ]),
    bookingUrl: doc.bookingUrl,
    gallery: doc.img ? [{ url: doc.img }] : [],
    createdAt: ts(doc.createdAt),
    updatedAt: ts(doc.updatedAt),
    publishedAt: ts(doc.updatedAt),
  }));
}

export async function getPage(pageId: string): Promise<Page | null> {
  const snap = await adminDb.collection("cmsPages").doc(pageId).get();
  if (!snap.exists) return null;
  const data = snap.data() as CmsPageDoc;
  if (data.active === false) return null;

  return {
    id: snap.id,
    pageId: data.pageId ?? pageId,
    heroTitle: data.heroTitle,
    heroCaption: data.heroCaption,
    body: data.body,
    conceptTag: data.conceptTag,
    conceptTitle: data.conceptTitle,
    conceptLinkLabel: data.conceptLinkLabel,
    forestSectionTitle: data.forestSectionTitle,
    ensembleSectionTitle: data.ensembleSectionTitle,
    slides: data.slides ?? [],
    createdAt: ts(data.createdAt),
    updatedAt: ts(data.updatedAt),
    publishedAt: ts(data.publishedAt ?? data.updatedAt),
  };
}

export async function getReports(): Promise<Report[]> {
  const snap = await adminDb
    .collection("reports")
    .where("status", "==", "published")
    .where("active", "==", true)
    .get();
  const reports = snap.docs.map((doc) => {
    const data = doc.data() as CmsReportDoc;
    return {
      id: doc.id,
      title: data.title,
      date: data.date,
      category: data.category,
      image: data.image,
      body: data.body,
      createdAt: ts(data.createdAt),
      updatedAt: ts(data.updatedAt),
      publishedAt: ts(data.publishedAt ?? data.updatedAt),
    };
  });

  if (reports.length > 0) {
    return reports.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  }

  return STATIC_REPORTS.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date.replace(/\//g, "-"),
    category: item.tags[0],
    image: image(item.img),
    body: item.body,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    publishedAt: item.date.replace(/\//g, "-"),
  }));
}

export async function getNews(): Promise<News[]> {
  const docs = await getPublishedCmsNews();
  return docs.map((data: CmsNewsDoc & { id: string }) => ({
    id: data.id,
    title: data.title,
    date: data.date,
    label: data.label,
    href: data.href,
    category: data.category,
    image: data.image,
    body: data.body,
    createdAt: ts(data.createdAt),
    updatedAt: ts(data.updatedAt),
    publishedAt: ts(data.publishedAt ?? data.updatedAt),
  }));
}

export async function getReport(id: string): Promise<Report | null> {
  const snap = await adminDb.collection("reports").doc(id).get();
  if (snap.exists) {
    const data = snap.data() as CmsReportDoc;
    if (data.active !== false && data.status === "published") {
      return {
        id: snap.id,
        title: data.title,
        date: data.date,
        category: data.category,
        image: data.image,
        body: data.body,
        createdAt: ts(data.createdAt),
        updatedAt: ts(data.updatedAt),
        publishedAt: ts(data.publishedAt ?? data.updatedAt),
      };
    }
  }

  const report = STATIC_REPORTS.find((item) => item.id === id);
  if (!report) return null;
  return {
    id: report.id,
    title: report.title,
    date: report.date.replace(/\//g, "-"),
    category: report.tags[0],
    image: image(report.img),
    body: report.body,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    publishedAt: report.date.replace(/\//g, "-"),
  };
}
