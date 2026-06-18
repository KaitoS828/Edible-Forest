import type { UserDoc } from "./firestore";
import { INTEREST_OPTIONS } from "./access";

// 会員プロフィールフォームのペイロード（クライアントから受け取る生データ）
export type ProfilePayload = {
  registeredAs?: "participant" | "organizer";
  lastName?: string;
  firstName?: string;
  lastNameKana?: string;
  firstNameKana?: string;
  country?: string;
  address?: string;
  contactEmail?: string;
  phone?: string;
  interests?: string[];
  occupation?: string;
  comment?: string;
  referrer?: string;
  operatingBodyName?: string;
  facilities?: { name?: string; address?: string; region?: string }[];
};

// users に保存できる文字列フィールドの許可リスト
const STRING_FIELDS = [
  "lastName",
  "firstName",
  "lastNameKana",
  "firstNameKana",
  "country",
  "address",
  "contactEmail",
  "phone",
  "occupation",
  "comment",
  "referrer",
  "operatingBodyName",
] as const;

const INTEREST_SET = new Set<string>(INTEREST_OPTIONS);

/**
 * フォームのペイロードを UserDoc の保存フィールドに変換する。
 * - 文字列項目は trim して空でなければ保存
 * - registeredAs は participant/organizer のみ受理し memberType も同値に設定
 * - interests は INTEREST_OPTIONS に含まれる値のみ
 * - fieldUpdatedAt に各保存項目の更新時刻(Date.now())を記録
 */
export function applyProfile(profile: ProfilePayload): Partial<UserDoc> {
  const out: Partial<UserDoc> = {};
  const now = Date.now();
  const updatedAt: Record<string, number> = {};

  for (const key of STRING_FIELDS) {
    const val = profile[key];
    if (typeof val === "string" && val.trim()) {
      out[key] = val.trim();
      updatedAt[key] = now;
    }
  }

  if (profile.registeredAs === "participant" || profile.registeredAs === "organizer") {
    out.registeredAs = profile.registeredAs;
    out.memberType = profile.registeredAs;
    updatedAt.registeredAs = now;
  }

  if (Array.isArray(profile.interests)) {
    const interests = profile.interests.filter(
      (v): v is string => typeof v === "string" && INTEREST_SET.has(v)
    );
    out.interests = interests;
    updatedAt.interests = now;
  }

  if (Object.keys(updatedAt).length) {
    out.fieldUpdatedAt = updatedAt;
  }

  return out;
}
