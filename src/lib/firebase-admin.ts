import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function normalizePrivateKey(value?: string) {
  return value
    ?.replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");
}

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey  = normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    (projectId ? `${projectId}.firebasestorage.app` : undefined);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin 環境変数が未設定です (FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY)");
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    ...(storageBucket ? { storageBucket } : {}),
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

export function getAdminBucket() {
  const bucket =
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    (process.env.FIREBASE_ADMIN_PROJECT_ID
      ? `${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebasestorage.app`
      : undefined);

  if (!bucket) {
    throw new Error("Firebase Storage bucket が未設定です (FIREBASE_STORAGE_BUCKET または NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)");
  }

  return getStorage(getAdminApp()).bucket(bucket);
}
