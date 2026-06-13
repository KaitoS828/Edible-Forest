import Stripe from "stripe";

// 遅延初期化：STRIPE_SECRET_KEY 未設定でもモジュール読み込み（ビルド）は通し、
// 実際に Stripe を呼び出した時だけエラーにする（firebase-admin と同じ Proxy パターン）。
let _stripe: Stripe | null = null;
function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY が設定されていません");
    _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripeClient();
    const value = client[prop as keyof Stripe];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});

/** 月額 ¥1,000 の Price ID をキャッシュ（起動時に1回取得 or 作成） */
let cachedPriceId: string | null = null;

export async function getOrCreateMonthlyPriceId(): Promise<string> {
  if (cachedPriceId) return cachedPriceId;

  // 既存 Price を検索
  const prices = await stripe.prices.list({
    currency: "jpy",
    type: "recurring",
    active: true,
    limit: 10,
  });

  const existing = prices.data.find(
    (p) =>
      p.unit_amount === 1000 &&
      p.recurring?.interval === "month"
  );

  if (existing) {
    cachedPriceId = existing.id;
    return existing.id;
  }

  // 新規作成
  const product = await stripe.products.create({
    name: "アンサンブル倶楽部～食べられる森を目指して～ 月会費",
    description: "全国の拠点・イベントへのアクセス権",
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 1000,
    currency: "jpy",
    recurring: { interval: "month" },
  });

  cachedPriceId = price.id;
  return price.id;
}
