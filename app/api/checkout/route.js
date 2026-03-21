import { NextResponse } from "next/server";
import Stripe from "stripe";

/** Liest den Secret Key aus der Umgebung (lokal: .env.local, Vercel: Environment Variables). */
function readStripeSecret() {
  const v = process.env.STRIPE_SECRET_KEY;
  if (v == null || String(v).trim() === "") return null;
  return String(v).trim();
}

export async function POST() {
  const secret = readStripeSecret();

  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY ist nicht gesetzt oder leer (Vercel: Production/Preview + Redeploy prüfen)." },
      { status: 500 }
    );
  }

  // Häufige Ursache für "Invalid API Key": pk_… statt sk_… oder Leerzeichen (wird oben getrimmt)
  if (!secret.startsWith("sk_")) {
    return NextResponse.json(
      {
        error:
          "STRIPE_SECRET_KEY muss ein Secret Key sein (beginnt mit sk_test_ oder sk_live_) – nicht der Publishable Key (pk_…).",
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
