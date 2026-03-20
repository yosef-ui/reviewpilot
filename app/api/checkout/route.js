import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe-Konfiguration fehlt (STRIPE_SECRET_KEY)." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const origin = new URL(req.url).origin;

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
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/bezahlen?canceled=true`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Stripe Checkout konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}

