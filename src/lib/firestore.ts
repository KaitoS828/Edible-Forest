import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { MemberType } from "./access";

// ─────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────
export type UserRole = "member" | "admin";

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing" | "none";

export type { MemberType };

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
  // 会員プロフィール（2026-06-13 確定スキーマ）
  registeredAs?: "participant" | "organizer"; // 登録時に選んだ種別
  lastName?: string;          // 姓
  firstName?: string;         // 名
  lastNameKana?: string;      // 姓フリガナ
  firstNameKana?: string;     // 名フリガナ
  country?: string;           // 居住国
  address?: string;           // 住所
  contactEmail?: string;      // 連絡用メールアドレス
  phone?: string;             // 電話番号
  interests?: string[];       // 興味分野（複数）
  occupation?: string;        // 職業
  comment?: string;           // コメント（自己紹介）
  referrer?: string;          // 紹介者
  operatingBodyName?: string; // 登録施設の運営母体名（開催会員）
  facilityIds?: string[];     // 登録した宿泊施設ID
  fieldUpdatedAt?: Record<string, number>; // 各項目の最終更新日（unix ms）
  // 旧仮項目（後方互換）
  region?: string;
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
  const snap = await adminDb.collection("users").get();
  const docs = snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserDoc);
  return docs.sort((a, b) => {
    const aMs = typeof a.createdAt?.toMillis === "function" ? a.createdAt.toMillis() : 0;
    const bMs = typeof b.createdAt?.toMillis === "function" ? b.createdAt.toMillis() : 0;
    return bMs - aMs;
  });
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
  bookingUrl?: string; // 外部予約URL
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

export async function getAllSpots(): Promise<SpotDoc[]> {
  const snap = await adminDb
    .collection("spots")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SpotDoc);
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
// CMS Pages / Reports（自作CMS）
// ─────────────────────────────────────────
export type CmsSlide = {
  fieldId: string;
  image?: { url: string };
  label?: string;
  title?: string;
  link?: string;
  linkLabel?: string;
};

export type CmsPageDoc = {
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
  slides?: CmsSlide[];
  active: boolean;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
  publishedAt?: FirebaseFirestore.Timestamp;
};

export type CmsReportStatus = "draft" | "published";

export type CmsReportDoc = {
  id: string;
  title: string;
  date?: string;
  category?: string;
  image?: { url: string };
  body?: string;
  status: CmsReportStatus;
  active: boolean;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
  publishedAt?: FirebaseFirestore.Timestamp;
};

export type CmsNewsStatus = "draft" | "published";

export type CmsNewsDoc = {
  id: string;
  title: string;
  date?: string;
  label?: string;
  href?: string;
  category?: string;
  image?: { url: string };
  body?: string;
  status: CmsNewsStatus;
  active: boolean;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
  publishedAt?: FirebaseFirestore.Timestamp;
};

export async function getCmsPage(pageId: string): Promise<CmsPageDoc | null> {
  const snap = await adminDb.collection("cmsPages").doc(pageId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as CmsPageDoc;
}

export async function getAllCmsPages(): Promise<CmsPageDoc[]> {
  const snap = await adminDb.collection("cmsPages").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CmsPageDoc);
}

export async function upsertCmsPage(pageId: string, data: Partial<Omit<CmsPageDoc, "id" | "createdAt" | "updatedAt">>) {
  const ref = adminDb.collection("cmsPages").doc(pageId);
  const exists = (await ref.get()).exists;
  await ref.set(
    {
      pageId,
      active: data.active ?? true,
      ...data,
      ...(exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      updatedAt: FieldValue.serverTimestamp(),
      publishedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getCmsReport(id: string): Promise<CmsReportDoc | null> {
  const snap = await adminDb.collection("reports").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as CmsReportDoc;
}

export async function getAllCmsReports(): Promise<CmsReportDoc[]> {
  const snap = await adminDb.collection("reports").get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CmsReportDoc);
  return docs.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function upsertCmsReport(
  id: string,
  data: Partial<Omit<CmsReportDoc, "id" | "createdAt" | "updatedAt">>
) {
  const ref = adminDb.collection("reports").doc(id);
  const exists = (await ref.get()).exists;
  await ref.set(
    {
      active: data.active ?? true,
      status: data.status ?? "draft",
      ...data,
      ...(exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      updatedAt: FieldValue.serverTimestamp(),
      ...(data.status === "published" ? { publishedAt: FieldValue.serverTimestamp() } : {}),
    },
    { merge: true }
  );
}

export async function deleteCmsReport(id: string) {
  await adminDb.collection("reports").doc(id).delete();
}

export async function getCmsNews(id: string): Promise<CmsNewsDoc | null> {
  const snap = await adminDb.collection("news").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as CmsNewsDoc;
}

export async function getAllCmsNews(): Promise<CmsNewsDoc[]> {
  const snap = await adminDb.collection("news").get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CmsNewsDoc);
  return docs.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function getPublishedCmsNews(): Promise<CmsNewsDoc[]> {
  const snap = await adminDb
    .collection("news")
    .where("status", "==", "published")
    .where("active", "==", true)
    .get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CmsNewsDoc);
  return docs.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function upsertCmsNews(
  id: string,
  data: Partial<Omit<CmsNewsDoc, "id" | "createdAt" | "updatedAt">>
) {
  const ref = adminDb.collection("news").doc(id);
  const exists = (await ref.get()).exists;
  await ref.set(
    {
      active: data.active ?? true,
      status: data.status ?? "draft",
      ...data,
      ...(exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      updatedAt: FieldValue.serverTimestamp(),
      ...(data.status === "published" ? { publishedAt: FieldValue.serverTimestamp() } : {}),
    },
    { merge: true }
  );
}

export async function deleteCmsNews(id: string) {
  await adminDb.collection("news").doc(id).delete();
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

// ─────────────────────────────────────────
// Facilities（開催会員が登録する宿泊施設・要審査）
// ─────────────────────────────────────────
export type FacilityStatus = "pending" | "approved" | "rejected"; // 審査中/承認/却下

export type FacilityDoc = {
  id: string;
  ownerId: string;        // 開催会員 uid
  ownerName: string;
  name: string;           // 施設名
  operatingBody?: string; // 運営母体名
  region?: string;
  address?: string;
  status: FacilityStatus; // 登録時は pending（審査中）
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};

export async function createFacility(
  data: Omit<FacilityDoc, "id" | "status" | "createdAt" | "updatedAt"> & { status?: FacilityStatus }
): Promise<string> {
  const ref = await adminDb.collection("facilities").add({
    ...data,
    status: data.status ?? "pending",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function getFacility(id: string): Promise<FacilityDoc | null> {
  const snap = await adminDb.collection("facilities").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as FacilityDoc;
}

export async function getOwnerFacilities(ownerId: string): Promise<FacilityDoc[]> {
  const snap = await adminDb.collection("facilities").where("ownerId", "==", ownerId).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FacilityDoc);
}

/** 承認済みの自施設のみ（イベント会場のラジオ選択用） */
export async function getApprovedOwnerFacilities(ownerId: string): Promise<FacilityDoc[]> {
  const list = await getOwnerFacilities(ownerId);
  return list.filter((f) => f.status === "approved");
}

export async function getAllFacilities(): Promise<FacilityDoc[]> {
  const snap = await adminDb.collection("facilities").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FacilityDoc);
}

export async function updateFacility(id: string, data: Partial<Omit<FacilityDoc, "id" | "createdAt">>) {
  await adminDb.collection("facilities").doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

/** 管理側が審査フラグを更新（pending → approved 等） */
export async function updateFacilityStatus(id: string, status: FacilityStatus) {
  await updateFacility(id, { status });
}

export async function deleteFacility(id: string) {
  await adminDb.collection("facilities").doc(id).delete();
}

// ─────────────────────────────────────────
// Events（開催会員以上が登録するイベント）
// ─────────────────────────────────────────
export type EventFormat = "onsite" | "online" | "both"; // 現地/オンライン/両方

export type EventDoc = {
  id: string;
  organizerId: string;          // 主催者 uid
  organizerName: string;        // 主催者氏名
  organizerFacilityId?: string; // 主催者として選んだ登録施設
  organizerBodyName?: string;   // 運営母体名
  title: string;
  summary: string;
  startAt?: number;             // 開催日時（unix ms）
  endAt?: number;               // 終了日時（unix ms）
  venueFacilityId?: string;     // 会場（審査済み自施設）
  format: EventFormat;
  image?: string;
  terms?: string;               // イベント規約
  memberOnly: boolean;          // true=会員限定 / false=オープン
  status: "draft" | "published";
  participants?: string[];      // 参加者 uid
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};

export async function createEvent(
  data: Omit<EventDoc, "id" | "createdAt" | "updatedAt" | "participants"> & { participants?: string[] }
): Promise<string> {
  const ref = await adminDb.collection("events").add({
    participants: [],
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function getEvent(id: string): Promise<EventDoc | null> {
  const snap = await adminDb.collection("events").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as EventDoc;
}

export async function getPublishedEvents(): Promise<EventDoc[]> {
  const snap = await adminDb.collection("events").where("status", "==", "published").get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EventDoc);
  return docs.sort((a, b) => (b.startAt ?? 0) - (a.startAt ?? 0));
}

export async function getOrganizerEvents(organizerId: string): Promise<EventDoc[]> {
  const snap = await adminDb.collection("events").where("organizerId", "==", organizerId).get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EventDoc);
  return docs.sort((a, b) => {
    const at = a.updatedAt?.toMillis?.() ?? 0;
    const bt = b.updatedAt?.toMillis?.() ?? 0;
    return bt - at;
  });
}

export async function updateEvent(id: string, data: Partial<Omit<EventDoc, "id" | "createdAt">>) {
  await adminDb.collection("events").doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteEvent(id: string) {
  await adminDb.collection("events").doc(id).delete();
}

/** イベントに参加（参加者 uid を追加） */
export async function joinEvent(eventId: string, uid: string) {
  await adminDb.collection("events").doc(eventId).update({
    participants: FieldValue.arrayUnion(uid),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

/** マイページの「イベント開催・参加履歴」用：主催 or 参加したイベント */
export async function getUserEventHistory(uid: string): Promise<{ organized: EventDoc[]; joined: EventDoc[] }> {
  const [orgSnap, joinSnap] = await Promise.all([
    adminDb.collection("events").where("organizerId", "==", uid).get(),
    adminDb.collection("events").where("participants", "array-contains", uid).get(),
  ]);
  return {
    organized: orgSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as EventDoc),
    joined: joinSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as EventDoc),
  };
}
