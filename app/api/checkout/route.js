import { NextResponse } from "next/server";
import Stripe from "stripe";

/** Stripe Node SDK braucht die Node-Runtime (nicht Edge). */
export const runtime = "nodejs";

/** Env-Variablen bei jedem Request frisch lesen (wichtig auf Vercel nach Env-Änderungen). */
export const dynamic = "force-dynamic";

function getStripeSecret() {
  const raw = process.env.STRIPE_SECRET_KEY;
  if (raw == null || String(raw).trim() === "") return null;
  return String(raw).trim();
}

export async function POST() {
  const secret = getStripeSecret();

  if (!secret) {
    return NextResponse.json(
      {
        error:
          "STRIPE_SECRET_KEY fehlt. In Vercel unter Project → Settings → Environment Variables setzen und neu deployen. Siehe docs/vercel-stripe.md",
      },
      { status: 500 }
    );
  }

  if (!secret.startsWith("sk_")) {
    return NextResponse.json(
      {
        error:
          "STRIPE_SECRET_KEY muss der Secret Key sein (sk_test_… oder sk_live_…), nicht der Publishable Key (pk_…).",
      },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "ReviewPilot Pro" },
            unit_amount: 990,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: "https://reviewpilot-gray.vercel.app/dashboard?success=true",
      cancel_url: "https://reviewpilot-gray.vercel.app/bezahlen",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
