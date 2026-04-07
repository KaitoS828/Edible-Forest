/**
 * 静的データ（src/data/ensembles.ts）をFirestoreにインポートするスクリプト
 * 使い方: npm run seed:ensembles
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// .env.local を手動でロード
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local が存在しない場合はスキップ（環境変数が直接設定されている前提）
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

async function seed() {
  const { ENSEMBLES } = await import("../src/data/ensembles");

  console.log(`${ENSEMBLES.length} 件のアンサンブルをFirestoreにインポートします...`);

  for (const e of ENSEMBLES) {
    const data: Record<string, unknown> = {
      authorId: "system",
      authorName: "システム",
      name: e.name,
      sub: e.sub,
      region: e.region,
      regionColor: e.regionColor,
      desc: e.desc,
      tagline: e.tagline ?? "",
      philosophy: e.philosophy ?? "",
      img: e.img,
      activities: e.activities ?? [],
      stats: e.stats ?? [],
      gallery: e.gallery ?? [],
      active: e.active,
      status: "published",
      isOfficial: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (e.organizer) data.organizer = e.organizer;

    await db.collection("ensembles").doc(e.id).set(data);
    console.log(`✓ ${e.id}: ${e.name}`);
  }

  console.log("\n完了！");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
