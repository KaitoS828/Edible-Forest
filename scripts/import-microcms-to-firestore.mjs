/**
 * microCMS から Firestore 自作CMSへ既存コンテンツを移行します。
 *
 * Dry run:
 *   node scripts/import-microcms-to-firestore.mjs --dry-run
 *
 * Import:
 *   node scripts/import-microcms-to-firestore.mjs --write
 *
 * Required env:
 *   MICROCMS_SERVICE_DOMAIN
 *   MICROCMS_API_KEY
 *   FIREBASE_ADMIN_PROJECT_ID
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

loadEnvFile(".env.local");

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const dryRun = args.has("--dry-run") || !write;

const serviceDomain = requiredEnv("MICROCMS_SERVICE_DOMAIN");
const apiKey = requiredEnv("MICROCMS_API_KEY");
const baseUrl = `https://${serviceDomain}.microcms.io/api/v1`;

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: requiredEnv("FIREBASE_ADMIN_PROJECT_ID"),
      clientEmail: requiredEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
      privateKey: requiredEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

function loadEnvFile(fileName) {
  try {
    const envPath = resolve(process.cwd(), fileName);
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Environment variables may be supplied directly in CI/Vercel.
  }
}

function requiredEnv(key) {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function timestamp(value) {
  if (!value) return Timestamp.now();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? Timestamp.now() : Timestamp.fromDate(date);
}

function imageUrl(image) {
  return image?.url ?? "";
}

function galleryUrls(gallery) {
  return Array.isArray(gallery) ? gallery.map((item) => item?.url).filter(Boolean) : [];
}

function normalizeStats(stats) {
  if (!Array.isArray(stats)) return [];
  return stats
    .map((item) => ({
      label: String(item?.label ?? "").trim(),
      value: String(item?.value ?? "").trim(),
    }))
    .filter((item) => item.label && item.value);
}

function statValue(stats, labels) {
  const normalized = normalizeStats(stats);
  const found = normalized.find((item) => labels.includes(item.label));
  return found?.value ?? "";
}

function normalizeActivities(activity) {
  if (!Array.isArray(activity)) return [];
  return activity
    .map((item) => ({
      icon: String(item?.icon ?? "").trim(),
      title: String(item?.title ?? item?.name ?? "").trim(),
      desc: String(item?.desc ?? item?.description ?? "").trim(),
      img: imageUrl(item?.image?.[0]),
    }))
    .filter((item) => item.title || item.desc || item.icon || item.img);
}

function commonTimestamps(content) {
  return {
    createdAt: timestamp(content.createdAt),
    updatedAt: timestamp(content.updatedAt),
  };
}

async function fetchList(endpoint, queries = {}) {
  const all = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const url = new URL(`${baseUrl}/${endpoint}`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    for (const [key, value] of Object.entries(queries)) {
      url.searchParams.set(key, String(value));
    }

    const res = await fetch(url, {
      headers: { "X-MICROCMS-API-KEY": apiKey },
    });
    if (!res.ok) {
      throw new Error(`microCMS ${endpoint} fetch failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    all.push(...(data.contents ?? []));
    if (all.length >= (data.totalCount ?? 0) || (data.contents ?? []).length === 0) break;
    offset += limit;
  }

  return all;
}

function mapPage(content) {
  return {
    pageId: content.pageId,
    heroTitle: content.heroTitle ?? "",
    heroCaption: content.heroCaption ?? "",
    body: content.body ?? "",
    conceptTag: content.conceptTag ?? "",
    conceptLinkLabel: content.conceptLinkLabel ?? "",
    slides: Array.isArray(content.slides)
      ? content.slides.map((slide, index) => ({
          fieldId: String(slide?.fieldId ?? index),
          image: slide?.image?.url ? { url: slide.image.url } : undefined,
          label: slide?.label ?? "",
          title: slide?.title ?? "",
          link: slide?.link ?? "",
          linkLabel: slide?.linkLabel ?? "",
        }))
      : [],
    active: true,
    publishedAt: timestamp(content.publishedAt),
    ...commonTimestamps(content),
  };
}

function mapEnsemble(content) {
  const stats = normalizeStats(content.stats);
  return {
    authorId: "system",
    authorName: "システム",
    name: content.title ?? "",
    sub: content.sub ?? "",
    region: content.sub ?? "未設定",
    regionColor: "#3C6B4F",
    forestType: content.forestType ?? "",
    desc: content.caution ?? "",
    tagline: content.heroCaption ?? "",
    philosophy: content.philosophy ?? "",
    img: imageUrl(content.heroImage),
    activities: normalizeActivities(content.activity),
    stats,
    gallery: galleryUrls(content.gallery),
    notes: content.caution ? [content.caution] : [],
    travelConditions: content.travelConditions ?? "",
    active: true,
    status: "published",
    isOfficial: true,
    ...commonTimestamps(content),
  };
}

function mapSpot(content) {
  return {
    authorId: "system",
    authorName: "システム",
    name: content.title ?? "",
    sub: content.sub ?? "",
    region: content.sub ?? "未設定",
    regionColor: "#3C6B4F",
    forestType: content.forestType ?? "",
    desc: content.caution ?? "",
    content: content.philosophy ?? "",
    img: imageUrl(content.heroImage),
    address: statValue(content.stats, ["住所", "所在地", "集合場所"]),
    capacity: statValue(content.stats, ["定員"]),
    price: statValue(content.stats, ["料金", "宿泊料金"]),
    access: statValue(content.stats, ["アクセス"]),
    bookingUrl: content.bookingUrl ?? "",
    active: true,
    status: "published",
    isOfficial: true,
    ...commonTimestamps(content),
  };
}

function mapReport(content) {
  return {
    title: content.title ?? "",
    date: content.date ?? "",
    category: content.category ?? "",
    image: content.image?.url ? { url: content.image.url } : undefined,
    body: content.body ?? "",
    status: "published",
    active: true,
    publishedAt: timestamp(content.publishedAt),
    ...commonTimestamps(content),
  };
}

function stripUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(stripUndefined).filter((item) => item !== undefined);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)])
    );
  }
  return value;
}

async function setDoc(collection, id, data) {
  if (dryRun) return;
  await db.collection(collection).doc(id).set(stripUndefined(data), { merge: true });
}

async function main() {
  console.log(dryRun ? "Dry run: Firestoreには書き込みません" : "Write mode: Firestoreへ書き込みます");

  const [pages, ensembleEntries, reports] = await Promise.all([
    fetchList("pages"),
    fetchList("ensembles"),
    fetchList("reports", { orders: "-publishedAt" }),
  ]);

  let pageCount = 0;
  let ensembleCount = 0;
  let spotCount = 0;
  let reportCount = 0;

  for (const page of pages) {
    if (!page.pageId) {
      console.warn(`Skip page without pageId: ${page.id}`);
      continue;
    }
    await setDoc("cmsPages", page.pageId, mapPage(page));
    pageCount += 1;
    console.log(`cmsPages/${page.pageId}`);
  }

  for (const entry of ensembleEntries) {
    if (entry.type === "spot") {
      await setDoc("spots", entry.id, mapSpot(entry));
      spotCount += 1;
      console.log(`spots/${entry.id}`);
    } else {
      await setDoc("ensembles", entry.id, mapEnsemble(entry));
      ensembleCount += 1;
      console.log(`ensembles/${entry.id}`);
    }
  }

  for (const report of reports) {
    await setDoc("reports", report.id, mapReport(report));
    reportCount += 1;
    console.log(`reports/${report.id}`);
  }

  console.log("");
  console.log("Import summary");
  console.log(`- cmsPages: ${pageCount}`);
  console.log(`- ensembles: ${ensembleCount}`);
  console.log(`- spots: ${spotCount}`);
  console.log(`- reports: ${reportCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
