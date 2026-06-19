/**
 * 規約・ポリシー系の固定ページ（privacy / terms / company）の
 * デフォルト文書を Firestore cmsPages に投入します。
 *
 *   node scripts/seed-legal-pages.mjs            (dry-run)
 *   node scripts/seed-legal-pages.mjs --write    (書き込み)
 *
 * Required env:
 *   FIREBASE_ADMIN_PROJECT_ID / FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

loadEnvFile(".env.local");

const args = new Set(process.argv.slice(2));
const write = args.has("--write");

const PAGES = {
  privacy: {
    heroTitle: "プライバシーポリシー",
    body: `<p>アンサンブル倶楽部～食べられる森を目指して～（以下「当倶楽部」といいます）は、会員および利用者の個人情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。</p>
<h2>1. 取得する情報</h2>
<p>氏名、メールアドレス、住所、電話番号など、会員登録やお問い合わせの際にご提供いただく情報を取得します。</p>
<h2>2. 利用目的</h2>
<ul><li>会員サービスの提供・運営</li><li>イベントやお知らせのご案内</li><li>お問い合わせへの対応</li><li>サービス改善のための分析</li></ul>
<h2>3. 第三者提供</h2>
<p>法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。</p>
<h2>4. 個人情報の開示・訂正・削除</h2>
<p>ご本人からの請求があった場合、合理的な範囲で個人情報の開示・訂正・削除に対応します。</p>
<h2>5. お問い合わせ</h2>
<p>本ポリシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。</p>
<p>制定日：2026年6月19日</p>`,
  },
  terms: {
    heroTitle: "利用規約",
    body: `<p>本利用規約（以下「本規約」といいます）は、アンサンブル倶楽部～食べられる森を目指して～（以下「当倶楽部」といいます）が提供するサービス（以下「本サービス」といいます）の利用条件を定めるものです。</p>
<h2>第1条（適用）</h2>
<p>本規約は、利用者と当倶楽部との間の本サービスの利用に関わる一切の関係に適用されます。</p>
<h2>第2条（利用登録）</h2>
<p>利用希望者が当倶楽部の定める方法により利用登録を申請し、当倶楽部が承認することで利用登録が完了します。</p>
<h2>第3条（禁止事項）</h2>
<ul><li>法令または公序良俗に違反する行為</li><li>当倶楽部または第三者の権利を侵害する行為</li><li>本サービスの運営を妨害する行為</li></ul>
<h2>第4条（免責事項）</h2>
<p>当倶楽部は、本サービスに関して利用者に生じた損害について、当倶楽部の故意または重過失による場合を除き、責任を負いません。</p>
<h2>第5条（規約の変更）</h2>
<p>当倶楽部は、必要と判断した場合、利用者への事前の通知なく本規約を変更できるものとします。</p>
<h2>第6条（準拠法・裁判管轄）</h2>
<p>本規約は日本法に準拠し、本サービスに関して紛争が生じた場合には当倶楽部所在地を管轄する裁判所を専属的合意管轄とします。</p>
<p>制定日：2026年6月19日</p>`,
  },
  company: {
    heroTitle: "運営会社",
    body: `<h2>運営者</h2>
<p>アンサンブル倶楽部～食べられる森を目指して～</p>
<h2>所在地</h2>
<p>（住所をご記入ください）</p>
<h2>代表者</h2>
<p>（代表者名をご記入ください）</p>
<h2>事業内容</h2>
<ul><li>会員制コミュニティの運営</li><li>各地の拠点・イベントの企画運営</li><li>食べられる森に関する情報発信</li></ul>
<h2>お問い合わせ</h2>
<p>お問い合わせフォームよりご連絡ください。</p>`,
  },
};

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

const run = async () => {
  for (const [pageId, data] of Object.entries(PAGES)) {
    const ref = db.collection("cmsPages").doc(pageId);
    const exists = (await ref.get()).exists;
    console.log(`${pageId}: ${exists ? "既存（上書きしません）" : "新規作成"}`);
    if (exists) continue; // 既に編集済みなら触らない
    if (!write) {
      console.log(`  [dry-run] cmsPages/${pageId} に投入予定`);
      continue;
    }
    await ref.set({
      pageId,
      heroTitle: data.heroTitle,
      body: data.body,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      publishedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  ✓ cmsPages/${pageId} 作成`);
  }
  console.log(write ? "完了（書き込み）" : "完了（dry-run）。実行するには --write を付与してください。");
};

run().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});

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
    // CI/Vercel では環境変数が直接渡される
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`環境変数 ${name} が設定されていません`);
    process.exit(1);
  }
  return value;
}
