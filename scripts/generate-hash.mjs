/**
 * パスワードのbcryptハッシュを生成します
 * 使い方: node scripts/generate-hash.mjs <パスワード>
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("使い方: node scripts/generate-hash.mjs <パスワード>");
  process.exit(1);
}
const hash = await bcrypt.hash(password, 12);
console.log("\n.env.local に追加してください:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
