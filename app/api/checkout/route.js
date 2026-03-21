import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST() {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: 'Stripe-Konfiguration fehlt (STRIPE_SECRET_KEY).' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secret);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'ReviewPilot Pro' },
          unit_amount: 990,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      success_url: 'https://reviewpilot-gray.vercel.app/dashboard?success=true',
      cancel_url: 'https://reviewpilot-gray.vercel.app/bezahlen',
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message ?? 'Checkout fehlgeschlagen' },
      { status: 500 }
    );
  }
}
