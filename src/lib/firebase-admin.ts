import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin 環境変数が未設定です (FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY)");
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

// ── 遅延初期化 Proxy ────────────────────────────────────────────
// ビルド時はインスタンスを作らず、初回メソッド呼び出し時にのみ初期化する。
// これにより Vercel ビルド時に環境変数がなくてもエラーが出ない。

function lazyProxy<T extends object>(factory: () => T): T {
  let instance: T | null = null;
  return new Proxy({} as T, {
    get(_, prop, receiver) {
      if (!instance) instance = factory();
      const value = Reflect.get(instance as object, prop, receiver);
      return typeof value === "function" ? (value as Function).bind(instance) : value;
    },
  });
}

export const adminAuth = lazyProxy(() => getAuth(getAdminApp()));
export const adminDb   = lazyProxy(() => getFirestore(getAdminApp()));
