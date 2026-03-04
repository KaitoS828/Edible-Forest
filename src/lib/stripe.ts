import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
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
    name: "食べられる森アンサンブル倶楽部 月会費",
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
