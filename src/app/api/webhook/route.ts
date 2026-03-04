import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { upsertSubscription, getUserByEmail, upsertUser } from "@/lib/firestore";
import type { SubscriptionStatus } from "@/lib/firestore";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;

  try {
    if (webhookSecret && webhookSecret !== "whsec_placeholder") {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } else {
      // 開発時：署名検証をスキップ
      event = JSON.parse(payload) as Stripe.Event;
    }
  } catch (err) {
    console.error("[webhook] 署名検証失敗:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── 決済完了（初回サブスク作成） ─────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const email = session.customer_details?.email ?? "";
        const name = session.customer_details?.name ?? session.metadata?.customerName ?? "";

        // サブスク情報を取得
        // 次の課金日を取得（30日後の近似値 or invoiceから）
        const periodEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

        await upsertSubscription({
          email,
          stripeCustomerId: customerId,
          subscriptionId,
          subscriptionStatus: "active",
          subscriptionPeriodEnd: periodEnd,
          customerName: name,
        });

        console.log(`[webhook] checkout.session.completed: ${email}`);
        break;
      }

      // ── サブスク更新（継続課金・ステータス変化） ──────────
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer;
        const email = customer.email ?? "";
        if (!email) break;

        const status = sub.status as SubscriptionStatus;
        const user = await getUserByEmail(email);
        if (user) {
          await upsertUser(user.uid, {
            subscriptionStatus: status,
            subscriptionPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
          });
        }

        console.log(`[webhook] subscription.updated: ${email} → ${status}`);
        break;
      }

      // ── サブスク解約 ──────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer;
        const email = customer.email ?? "";
        if (!email) break;

        const user = await getUserByEmail(email);
        if (user) {
          await upsertUser(user.uid, { subscriptionStatus: "canceled" });
        }

        console.log(`[webhook] subscription.deleted: ${email}`);
        break;
      }

      // ── 継続課金失敗 ─────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const email = invoice.customer_email ?? "";
        if (!email) break;

        const user = await getUserByEmail(email);
        if (user) {
          await upsertUser(user.uid, { subscriptionStatus: "past_due" });
        }

        console.log(`[webhook] invoice.payment_failed: ${email}`);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[webhook] 処理エラー:", err);
    return NextResponse.json({ error: "処理に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
