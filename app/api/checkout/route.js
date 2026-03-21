import { NextResponse } from "next/server";

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const APP_BASE = "https://reviewpilot-gray.vercel.app";

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe-Konfiguration fehlt (STRIPE_SECRET_KEY)." },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "ReviewPilot Pro",
              description: "ReviewPilot Pro – €9,90/Monat",
            },
            unit_amount: 990,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${APP_BASE}/dashboard?success=true`,
      cancel_url: `${APP_BASE}/bezahlen`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Stripe Checkout konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
