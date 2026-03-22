"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import AppShell from "../../components/AppShell";

const STRIPE_BILLING_PORTAL =
  "https://billing.stripe.com/p/login/test_4gMeVd9IK90w54ibMw6g800";

export default function AbrechnungPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace("/login");
        return;
      }
      setLoading(false);
    }
    check();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-zinc-600">Lade Abrechnung…</div>
    );
  }

  return (
    <AppShell activeNav="abrechnung">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Abrechnung</h1>
        <p className="mt-2 text-zinc-600">
          Verwalte dein Abo, Zahlungsmittel und Rechnungen im Stripe-Kundenportal.
        </p>

        <div className="mt-8 max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <a
            href={STRIPE_BILLING_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 sm:w-auto"
          >
            Abo verwalten
          </a>
          <p className="mt-4 text-sm text-zinc-500">
            Öffnet in einem neuen Tab (Stripe Billing Portal).
          </p>
        </div>

        <p className="mt-8">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            ← Zurück zum Dashboard
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
