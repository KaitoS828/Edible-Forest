// ─────────────────────────────────────────
// 会員種別 × アクセス制御（中心抽象）— 2026-06-13 確定仕様
//
// 権限序列: 管理側 ＞ 森の奥(inner) ＞ 開催会員(organizer) ＞ 参加会員(participant) ＞ 非会員
//   - 管理側 は NextAuth + Custom Claim 側で扱う（members コレクションの memberType とは別軸）。
//   - 森の奥(inner) は本部事務局が管理画面から登録する（自己登録ではない）。
//   - イベント参加は「会員登録すれば全員が全イベントに参加可」。
//     種別で効くのは「イベント開催権限(organizer+)」「他メンバー閲覧(inner)」。
// ─────────────────────────────────────────

export const MEMBER_TYPES = ["participant", "organizer", "inner"] as const;
export type MemberType = (typeof MEMBER_TYPES)[number];

export const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  participant: "参加会員",
  organizer: "開催会員",
  inner: "森の奥",
};

/** 登録フォームで選べる種別（森の奥・管理は自己登録不可） */
export const SELF_REGISTERABLE_TYPES: MemberType[] = ["participant", "organizer"];

/** 序列（数値が大きいほど上位）。非会員=0 / 管理側はこれより上として別途扱う */
export const MEMBER_TYPE_RANK: Record<MemberType, number> = {
  participant: 1,
  organizer: 2,
  inner: 3,
};

// ─────────────────────────────────────────
// ケイパビリティ
// ─────────────────────────────────────────
export type Capability =
  | "join_event"        // イベントに参加（全会員）
  | "create_event"      // イベントを開催・登録（開催会員以上）
  | "register_facility" // 宿泊施設を登録（開催会員以上）
  | "view_members";     // 他メンバーのプロフィール閲覧（森の奥）

export const CAPABILITIES: Record<MemberType, Capability[]> = {
  participant: ["join_event"],
  organizer: ["join_event", "create_event", "register_facility"],
  inner: ["join_event", "create_event", "register_facility", "view_members"],
};

// ─────────────────────────────────────────
// ヘルパー
// ─────────────────────────────────────────

/** memberType が capability を持つか。isAdmin=true（管理側）は全許可。未ログインは false */
export function can(
  memberType: MemberType | undefined | null,
  capability: Capability,
  isAdmin = false
): boolean {
  if (isAdmin) return true;
  if (!memberType) return false;
  return CAPABILITIES[memberType]?.includes(capability) ?? false;
}

/** 表示用ラベル。未ログインは「非会員」、管理側は「管理」 */
export function memberTypeLabel(
  memberType: MemberType | undefined | null,
  isAdmin = false
): string {
  if (isAdmin) return "管理";
  return memberType ? MEMBER_TYPE_LABELS[memberType] : "非会員";
}

/** target 以上の種別か（序列比較）。管理側は常に true */
export function isAtLeast(
  memberType: MemberType | undefined | null,
  target: MemberType,
  isAdmin = false
): boolean {
  if (isAdmin) return true;
  if (!memberType) return false;
  return MEMBER_TYPE_RANK[memberType] >= MEMBER_TYPE_RANK[target];
}

// ─────────────────────────────────────────
// イベント参加ボタンの表示状態
// 仕様: 会員登録すれば全員が全イベントに参加可。
//       非会員は「オープン」イベントなら参加可、「会員限定」なら会員登録に誘導。
// ─────────────────────────────────────────
export type EventGateState =
  | { kind: "open" }        // オープンイベント → 誰でも参加可
  | { kind: "joinable" }    // ログイン済み会員 → 参加可
  | { kind: "needs_login" } // 非会員 ×会員限定 → 「無料会員登録して参加」

/**
 * @param memberOnly  会員限定イベントか（false=オープン）
 * @param isLoggedIn  ログイン済み（＝何らかの会員）か
 */
export function resolveEventGate({
  memberOnly,
  isLoggedIn,
}: {
  memberOnly: boolean;
  isLoggedIn: boolean;
  /** 後方互換のため受け取るが現仕様では未使用（全会員が参加可） */
  memberType?: MemberType | null;
  requiredType?: MemberType;
}): EventGateState {
  if (!memberOnly) return { kind: "open" };
  if (isLoggedIn) return { kind: "joinable" };
  return { kind: "needs_login" };
}

// ─────────────────────────────────────────
// 興味分野（選択式・複数）
// ─────────────────────────────────────────
export const INTEREST_OPTIONS = [
  "森林", "山", "海", "川", "自然観察", "環境学", "スポーツ", "野鳥",
  "菌類", "地理", "旅行", "教育", "セラピー", "心理学", "社会学",
  "コミュニティ運営", "その他",
] as const;
export type Interest = (typeof INTEREST_OPTIONS)[number];
