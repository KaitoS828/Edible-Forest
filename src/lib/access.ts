// ─────────────────────────────────────────
// 会員種別 × アクセス制御（中心抽象）
//
// ⚠ 6/12 確定のスプレッドシートが届いたら、原則このファイルの
//    CAPABILITIES と MEMBER_TYPE_* を差し替えるだけで
//    サイト全体（マイページ表示・イベント参加可否・予約可否）に反映される。
// ─────────────────────────────────────────

export const MEMBER_TYPES = ["free", "member", "supporter", "organizer", "staff"] as const;
export type MemberType = (typeof MEMBER_TYPES)[number];

export const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  free: "無料会員",
  member: "正会員",
  supporter: "サポーター",
  organizer: "拠点運営者",
  staff: "スタッフ",
};

/** 種別の序列（数値が大きいほど上位権限）。UI のソートや「◯◯以上」判定に使う */
export const MEMBER_TYPE_RANK: Record<MemberType, number> = {
  free: 0,
  member: 1,
  supporter: 2,
  organizer: 3,
  staff: 4,
};

// ─────────────────────────────────────────
// ケイパビリティ（できること）
// ─────────────────────────────────────────
export type Capability =
  | "view_member_event"    // 会員限定イベントへの参加
  | "join_ensemble"        // アンサンブル（イベント）参加
  | "book_stay"            // 宿泊予約
  | "view_member_report"   // 会員限定レポート閲覧
  | "edit_own_spot"        // 自分の拠点を編集
  | "create_ensemble"      // アンサンブルを主催・作成
  | "manage";              // 運営管理（スタッフ）

/**
 * 会員種別ごとの許可ケイパビリティ（仮スキーマ）。
 * 6/12 のアクセス範囲定義が来たらここを上書きする。
 */
export const CAPABILITIES: Record<MemberType, Capability[]> = {
  free: [],
  member: ["view_member_event", "join_ensemble", "book_stay", "view_member_report"],
  supporter: ["view_member_event", "join_ensemble", "book_stay", "view_member_report"],
  organizer: [
    "view_member_event",
    "join_ensemble",
    "book_stay",
    "view_member_report",
    "edit_own_spot",
    "create_ensemble",
  ],
  staff: [
    "view_member_event",
    "join_ensemble",
    "book_stay",
    "view_member_report",
    "edit_own_spot",
    "create_ensemble",
    "manage",
  ],
};

// ─────────────────────────────────────────
// ヘルパー
// ─────────────────────────────────────────

/** 種別が capability を持つか。memberType 未設定（未ログイン/未承認）は false */
export function can(memberType: MemberType | undefined | null, capability: Capability): boolean {
  if (!memberType) return false;
  return CAPABILITIES[memberType]?.includes(capability) ?? false;
}

/** 表示用ラベル。未ログインは「ゲスト」 */
export function memberTypeLabel(memberType: MemberType | undefined | null): string {
  return memberType ? MEMBER_TYPE_LABELS[memberType] : "ゲスト";
}

/** target 以上の種別か（序列比較） */
export function isAtLeast(memberType: MemberType | undefined | null, target: MemberType): boolean {
  if (!memberType) return false;
  return MEMBER_TYPE_RANK[memberType] >= MEMBER_TYPE_RANK[target];
}

// ─────────────────────────────────────────
// イベント参加ボタンの表示状態
// （クライアント藤下さん要望：未ログインは「無料会員登録して参加」ボタン化）
// ─────────────────────────────────────────
export type EventGateState =
  | { kind: "open" }                 // 誰でも参加可（一般公開イベント）
  | { kind: "joinable" }             // ログイン済み & 権限あり → 参加可
  | { kind: "needs_login" }          // 未ログイン → 「無料会員登録して参加」
  | { kind: "needs_upgrade"; required: MemberType }; // ログイン済みだが種別不足

/**
 * イベントの参加ボタン状態を決定する。
 * @param memberOnly  会員限定イベントか
 * @param isLoggedIn  ログイン済みか
 * @param memberType  ログインユーザーの種別
 * @param requiredType 参加に必要な最低種別（省略時は member）
 */
export function resolveEventGate({
  memberOnly,
  isLoggedIn,
  memberType,
  requiredType = "member",
}: {
  memberOnly: boolean;
  isLoggedIn: boolean;
  memberType?: MemberType | null;
  requiredType?: MemberType;
}): EventGateState {
  if (!memberOnly) return { kind: "open" };
  if (!isLoggedIn) return { kind: "needs_login" };
  if (isAtLeast(memberType, requiredType)) return { kind: "joinable" };
  return { kind: "needs_upgrade", required: requiredType };
}
