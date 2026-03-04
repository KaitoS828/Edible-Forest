import { NextRequest, NextResponse } from "next/server";
import { stripe, getOrCreateMonthlyPriceId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, metadata } = body as {
      email: string;
      name: string;
      metadata?: Record<string, string>;
    };

    if (!email || !name) {
      return NextResponse.json({ error: "email と name は必須です" }, { status: 400 });
    }

    const priceId = await getOrCreateMonthlyPriceId();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

    // Stripe Customer 作成
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: metadata ?? {},
    });

    // Checkout Session 作成
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/join/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/join?canceled=1`,
      locale: "ja",
      metadata: {
        customerName: name,
        ...(metadata ?? {}),
      },
      subscription_data: {
        metadata: {
          customerEmail: email,
          customerName: name,
          ...(metadata ?? {}),
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Checkout Session の作成に失敗しました" }, { status: 500 });
  }
}
