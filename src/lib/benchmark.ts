// ─────────────────────────────────────────
// Benchmark Email API ラッパ（新 REST API / リージョン別エンドポイント）
//
// 公式: https://developers.benchmarkemail.io/
// 認証 : ヘッダ  X-API-Key: bme_xxx
// Base : リージョン別（例 https://api-ap-northeast-1-a.benchmarkemail.io）
//        ※ Account Settings > API Keys に表示される自分のベースURLを使う
//
// コンタクト追加: POST /api/contact
//   body: { key:<email>, contactStructureId:<id>, listIds:[<listId>], fields:[{_id,value}] }
//   - key  … メールアドレス（必須）
//   - fields … 任意。名/姓は account 固有の field _id が必要（env で指定）
//
// 必須 env が未設定なら no-op（{ ok:false, skipped:true }）でビルド・実行を壊さない。
// ─────────────────────────────────────────

const API_BASE = process.env.BENCHMARK_API_BASE;
const API_KEY = process.env.BENCHMARK_API_KEY;
const LIST_ID = process.env.BENCHMARK_LIST_ID;
const CONTACT_STRUCTURE_ID = process.env.BENCHMARK_CONTACT_STRUCTURE_ID;
const FIELD_FIRSTNAME_ID = process.env.BENCHMARK_FIELD_FIRSTNAME_ID;
const FIELD_LASTNAME_ID = process.env.BENCHMARK_FIELD_LASTNAME_ID;

export const isBenchmarkConfigured = !!(API_BASE && API_KEY && LIST_ID && CONTACT_STRUCTURE_ID);

export type AddContactResult = {
  ok: boolean;
  skipped?: boolean;
  contactId?: string;
  error?: string;
};

/**
 * Benchmark のメルマガリストにコントタクトを1件追加する。
 * 必須 env 未設定時は no-op（{ ok:false, skipped:true }）を返し、ビルド・実行を壊さない。
 */
export async function addContactToList(
  email: string,
  fields?: { firstName?: string; lastName?: string }
): Promise<AddContactResult> {
  if (!isBenchmarkConfigured) return { ok: false, skipped: true };

  const fieldArr: { _id: string; value: string }[] = [];
  if (fields?.firstName && FIELD_FIRSTNAME_ID) {
    fieldArr.push({ _id: FIELD_FIRSTNAME_ID, value: fields.firstName });
  }
  if (fields?.lastName && FIELD_LASTNAME_ID) {
    fieldArr.push({ _id: FIELD_LASTNAME_ID, value: fields.lastName });
  }

  const body = {
    key: email,
    contactStructureId: CONTACT_STRUCTURE_ID,
    listIds: [LIST_ID],
    fields: fieldArr,
  };

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `Benchmark API ${res.status}: ${text.slice(0, 200)}` };
    }

    const data = (await res.json().catch(() => null)) as { _id?: string } | null;
    return { ok: true, contactId: data?._id ? String(data._id) : undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Benchmark API request failed" };
  }
}
