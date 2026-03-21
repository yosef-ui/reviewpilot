"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import AppShell from "../../components/AppShell";
import { BrandMark } from "../../components/BrandLogo";

const STRIPE_BILLING_PORTAL_LINK =
  "https://billing.stripe.com/p/login/test_4gMeVd9IK90w54ibMw6g800";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function check() {
      if (!supabase) {
        setError("Supabase-Konfiguration fehlt.");
        setLoading(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setLoading(false);
    }
    check();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-zinc-700">Lade Einstellungen…</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-rose-600">{error}</div>
    );
  }

  return (
    <AppShell activeNav="settings">
      <BrandMark className="mb-6" />
      <h1 className="text-3xl font-black tracking-tight">Einstellungen</h1>
      <p className="mt-2 text-zinc-600">
        Abo, Zahlungsmittel und Rechnungen verwalten – sicher über Stripe.
      </p>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900">Abo &amp; Abrechnung</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Du wirst zum offiziellen Stripe-Kundenbereich weitergeleitet. Dort kannst du z. B.
          Zahlungsmittel ändern oder das Abo kündigen (je nach Stripe-Konfiguration).
        </p>

        <a
          href={STRIPE_BILLING_PORTAL_LINK}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Abo verwalten
        </a>
      </section>

      <p className="mt-6 text-xs text-zinc-500">
        Direktlink zum Stripe Customer Portal (Login).
      </p>
    </AppShell>
  );
}
