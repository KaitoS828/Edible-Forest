import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// ─────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────
export type UserRole = "member" | "admin";

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing" | "none";

export type MemberType = "free" | "member" | "supporter" | "organizer" | "staff";

export type UserDoc = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  memberType?: MemberType;
  memberNote?: string;
  approvedAt?: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
  // プロフィール
  bio?: string;
  avatarUrl?: string;
  profileCompleted?: boolean;
  // 会員登録フォームの追加項目（仮・6/12 確定）
  region?: string;
  phone?: string;
  motivation?: string;
  // Stripe
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionPeriodEnd?: number; // Unix timestamp
};

/** サブスクリプション情報をメールアドレスで管理（Firebase未登録ユーザー用） */
export type PendingSubscriptionDoc = {
  email: string;
  stripeCustomerId: string;
  subscriptionId: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPeriodEnd: number;
  customerName: string;
  createdAt: FirebaseFirestore.Timestamp;
};

export type EnsembleStatus = "draft" | "published";

export type EnsembleDoc = {
  id: string;
  authorId: string;
  authorName: string;
  name: string;
  sub: string;
  region: string;
  regionColor: string;
  forestType?: string;
  desc: string;
  tagline: string;
  philosophy: string;
  img: string;
  activities: { icon: string; title: string; desc: string; img?: string }[];
  stats:      { label: string; value: string }[];
  organizer?: { name: string; role: string; bio: string; avatar?: string };
  gallery:    string[];
  notes?:     string[];
  travelConditions?: string;
  active: boolean;
  status: EnsembleStatus;
  isOfficial: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};

// ─────────────────────────────────────────
// Users
// ─────────────────────────────────────────
export async function getUser(uid: string): Promise<UserDoc | null> {
  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return null;
  return { uid: snap.id, ...snap.data() } as UserDoc;
}

export async function upsertUser(uid: string, data: Partial<UserDoc>) {
  await adminDb.collection("users").doc(uid).set(
    { ...data, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
}

export async function getAllUsers(): Promise<UserDoc[]> {
  const snap = await adminDb.collection("users").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserDoc);
}

export async function updateUserMemberType(
  uid: string,
  memberType: MemberType,
  note?: string
): Promise<void> {
  await adminDb.collection("users").doc(uid).set(
    {
      memberType,
      ...(note !== undefined ? { memberNote: note } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserByEmail(email: string): Promise<UserDoc | null> {
  const snap = await adminDb.collection("users").where("email", "==", email).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { uid: doc.id, ...doc.data() } as UserDoc;
}

// ─────────────────────────────────────────
// Stripe / Subscriptions
// ─────────────────────────────────────────

/** Stripe決済完了時：ユーザーが既存なら直接更新、未登録ならpendingに保存 */
export async function upsertSubscription({
  email,
  stripeCustomerId,
  subscriptionId,
  subscriptionStatus,
  subscriptionPeriodEnd,
  customerName,
}: {
  email: string;
  stripeCustomerId: string;
  subscriptionId: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPeriodEnd: number;
  customerName: string;
}) {
  const subData = { stripeCustomerId, subscriptionId, subscriptionStatus, subscriptionPeriodEnd };

  // Firebaseユーザーが既に存在すれば直接更新
  const user = await getUserByEmail(email);
  if (user) {
    await upsertUser(user.uid, subData);
    return;
  }

  // 未登録の場合はpendingSubscriptionsに保存
  await adminDb.collection("pendingSubscriptions").doc(email).set({
    email,
    customerName,
    ...subData,
    createdAt: FieldValue.serverTimestamp(),
  });
}

/** Firebase signup時にpendingSubscriptionsを確認してマージ */
export async function mergePendingSubscription(uid: string, email: string) {
  const doc = await adminDb.collection("pendingSubscriptions").doc(email).get();
  if (!doc.exists) return;

  const data = doc.data() as PendingSubscriptionDoc;
  await upsertUser(uid, {
    stripeCustomerId: data.stripeCustomerId,
    subscriptionId: data.subscriptionId,
    subscriptionStatus: data.subscriptionStatus,
    subscriptionPeriodEnd: data.subscriptionPeriodEnd,
  });

  // pendingを削除
  await adminDb.collection("pendingSubscriptions").doc(email).delete();
}

// ─────────────────────────────────────────
// Ensembles
// ─────────────────────────────────────────
export async function getEnsembleDoc(id: string): Promise<EnsembleDoc | null> {
  const snap = await adminDb.collection("ensembles").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as EnsembleDoc;
}

export async function getPublishedEnsembles(): Promise<EnsembleDoc[]> {
  const snap = await adminDb
    .collection("ensembles")
    .where("status", "==", "published")
    .where("active", "==", true)
    .get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EnsembleDoc);
  return docs.sort((a, b) => {
    const at = a.createdAt?.toMillis?.() ?? 0;
    const bt = b.createdAt?.toMillis?.() ?? 0;
    return bt - at;
  });
}

export async function getMemberEnsembles(authorId: string): Promise<EnsembleDoc[]> {
  const snap = await adminDb
    .collection("ensembles")
    .where("authorId", "==", authorId)
    .get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EnsembleDoc);
  return docs.sort((a, b) => {
    const at = a.updatedAt?.toMillis?.() ?? 0;
    const bt = b.updatedAt?.toMillis?.() ?? 0;
    return bt - at;
  });
}

export async function getAllEnsembles(): Promise<EnsembleDoc[]> {
  const snap = await adminDb
    .collection("ensembles")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EnsembleDoc);
}

export async function createEnsemble(
  data: Omit<EnsembleDoc, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await adminDb.collection("ensembles").add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateEnsemble(
  id: string,
  data: Partial<Omit<EnsembleDoc, "id" | "createdAt">>
) {
  await adminDb.collection("ensembles").doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteEnsemble(id: string) {
  await adminDb.collection("ensembles").doc(id).delete();
}

// ─────────────────────────────────────────
// Spots（拠点・宿泊施設）
// ─────────────────────────────────────────
export type SpotDoc = {
  id: string;
  authorId: string;
  authorName: string;
  name: string;        // 施設名
  sub: string;         // サブタイトル
  region: string;
  regionColor: string;
  forestType: string;  // 食べられる森のタイプ（例：海の森、砂丘の森、都市の森）
  desc: string;        // 概要（カード表示用）
  content: string;     // リッチテキスト（詳細）
  img: string;         // カバー画像
  address: string;     // 住所
  capacity: string;    // 定員
  price: string;       // 料金
  access: string;      // アクセス
  active: boolean;
  status: "draft" | "published";
  isOfficial: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};

export async function getSpotDoc(id: string): Promise<SpotDoc | null> {
  const snap = await adminDb.collection("spots").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as SpotDoc;
}

export async function getPublishedSpots(): Promise<SpotDoc[]> {
  const snap = await adminDb
    .collection("spots")
    .where("status", "==", "published")
    .where("active", "==", true)
    .get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SpotDoc);
  return docs.sort((a, b) => {
    const at = a.createdAt?.toMillis?.() ?? 0;
    const bt = b.createdAt?.toMillis?.() ?? 0;
    return bt - at;
  });
}

export async function getMemberSpots(authorId: string): Promise<SpotDoc[]> {
  const snap = await adminDb
    .collection("spots")
    .where("authorId", "==", authorId)
    .get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SpotDoc);
  return docs.sort((a, b) => {
    const at = a.updatedAt?.toMillis?.() ?? 0;
    const bt = b.updatedAt?.toMillis?.() ?? 0;
    return bt - at;
  });
}

export async function createSpot(
  data: Omit<SpotDoc, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await adminDb.collection("spots").add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateSpot(
  id: string,
  data: Partial<Omit<SpotDoc, "id" | "createdAt">>
) {
  await adminDb.collection("spots").doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteSpot(id: string) {
  await adminDb.collection("spots").doc(id).delete();
}

// ─────────────────────────────────────────
// Mail Subscribers（メルマガ連携：Benchmark）
// ─────────────────────────────────────────
export type MailSubscriberStatus = "subscribed" | "pending";

export type MailSubscriberDoc = {
  email: string;
  status: MailSubscriberStatus;
  benchmarkContactId?: string;
  syncedAt: FirebaseFirestore.Timestamp;
};

/** メルマガ購読状態を保存（Benchmark未設定でも Firestore には残す）。email をドキュメントIDに使う */
export async function upsertMailSubscriber(data: {
  email: string;
  status: MailSubscriberStatus;
  benchmarkContactId?: string;
}) {
  await adminDb.collection("mailSubscribers").doc(data.email).set(
    {
      email: data.email,
      status: data.status,
      ...(data.benchmarkContactId ? { benchmarkContactId: data.benchmarkContactId } : {}),
      syncedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

// ─────────────────────────────────────────
// Inquiries（お問い合わせ）
// ─────────────────────────────────────────
export async function createInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await adminDb.collection("inquiries").add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
}
