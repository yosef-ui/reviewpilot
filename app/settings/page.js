"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

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
      <div className="min-h-screen bg-[#f8fafc] px-6 py-10 text-zinc-600">Lade Einstellungen…</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-extrabold text-[#1e3a8a]">
            ⭐ ReviewPilot
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
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

          {error ? (
            <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>
          ) : null}

          <a
            href={STRIPE_BILLING_PORTAL_LINK}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
          >
            Abo verwalten
          </a>
        </section>

        <p className="mt-6 text-xs text-zinc-500">
          Direktlink zum Stripe Customer Portal (Login).
        </p>
      </main>
    </div>
  );
}
