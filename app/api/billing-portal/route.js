import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { getAppOrigin } from "../../../lib/appOrigin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret?.startsWith("sk_")) return null;
  return new Stripe(secret);
}

export async function POST(req) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe ist nicht konfiguriert (STRIPE_SECRET_KEY)." },
      { status: 500 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json(
      { error: "Supabase-Umgebungsvariablen fehlen." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  if (!token) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const supabase = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Sitzung ungültig." }, { status: 401 });
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileErr) {
    return NextResponse.json(
      { error: profileErr.message || "Profil konnte nicht geladen werden." },
      { status: 500 }
    );
  }

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const email = user.email;
    if (!email) {
      return NextResponse.json(
        { error: "Keine E-Mail im Konto – Abo-Verwaltung nicht möglich." },
        { status: 400 }
      );
    }

    const customer = await stripe.customers.create({
      email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    const { error: upErr } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id);

    if (upErr) {
      return NextResponse.json(
        {
          error:
            upErr.message ||
            "stripe_customer_id konnte nicht gespeichert werden. Spalte in Supabase angelegt? Siehe supabase/profiles_stripe_customer_id.sql",
        },
        { status: 500 }
      );
    }
  }

  try {
    const returnUrl = `${getAppOrigin()}/settings`;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    if (!session?.url) {
      return NextResponse.json(
        { error: "Keine Portal-URL von Stripe erhalten." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Billing Portal fehlgeschlagen";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
