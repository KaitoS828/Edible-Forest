/**
 * Firebase ユーザーに admin Custom Claim を付与するスクリプト
 *
 * 使い方:
 *   npx tsx scripts/set-admin.ts add    admin@example.com
 *   npx tsx scripts/set-admin.ts remove admin@example.com
 *   npx tsx scripts/set-admin.ts list
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

const adminAuth = getAuth();
const [,, command, email] = process.argv;

async function addAdmin(email: string) {
  let user;
  try {
    user = await adminAuth.getUserByEmail(email);
  } catch {
    // ユーザーが存在しない場合は作成（仮パスワードを要求）
    const password = process.argv[4];
    if (!password) {
      console.error("❌ ユーザーが存在しません。パスワードを第3引数に指定して新規作成してください:");
      console.error("   npx tsx --env-file=.env.local scripts/set-admin.ts add <email> <password>");
      process.exit(1);
    }
    user = await adminAuth.createUser({ email, password });
    console.log(`👤 ユーザーを新規作成しました (uid: ${user.uid})`);
  }
  await adminAuth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`✅ ${email} に admin クレームを付与しました (uid: ${user.uid})`);
}

async function removeAdmin(email: string) {
  const user = await adminAuth.getUserByEmail(email);
  await adminAuth.setCustomUserClaims(user.uid, { admin: false });
  console.log(`🗑️  ${email} の admin クレームを削除しました`);
}

async function listAdmins() {
  const result = await adminAuth.listUsers(1000);
  const admins = result.users.filter((u) => u.customClaims?.admin === true);
  if (admins.length === 0) {
    console.log("管理者ユーザーはいません");
  } else {
    console.log("管理者一覧:");
    admins.forEach((u) => console.log(`  - ${u.email} (${u.uid})`));
  }
}

(async () => {
  try {
    if (command === "add" && email)    { await addAdmin(email);    }
    else if (command === "remove" && email) { await removeAdmin(email); }
    else if (command === "list")       { await listAdmins();        }
    else {
      console.log("使い方:");
      console.log("  npx tsx scripts/set-admin.ts add    <email>");
      console.log("  npx tsx scripts/set-admin.ts remove <email>");
      console.log("  npx tsx scripts/set-admin.ts list");
    }
  } catch (e: unknown) {
    if (e instanceof Error) console.error("❌", e.message);
    process.exit(1);
  }
})();
