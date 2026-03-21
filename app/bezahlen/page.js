"use client";

import Link from "next/link";
import { useState } from "react";

export default function BezahlenPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onCheckout() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data?.url) {
        setLoading(false);
        setError(data?.error || "Checkout konnte nicht gestartet werden.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setLoading(false);
      setError("Checkout konnte nicht gestartet werden.");
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/dashboard" className="text-lg font-extrabold text-[#1e3a8a]">
          ⭐ ReviewPilot
        </Link>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">
            ReviewPilot Pro – €9,90/Monat
          </h1>
          <p className="mt-2 text-zinc-600">
            Starte jetzt mit allen Funktionen für automatisierte Bewertungen.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-zinc-700">
            <li>✓ Unbegrenzte Termine</li>
            <li>✓ Automatische SMS nach Termin</li>
            <li>✓ Terminbestätigung per SMS</li>
            <li>✓ Dashboard & Kalenderansicht</li>
            <li>✓ DSGVO-konforme Prozesse</li>
            <li>✓ E-Mail Support</li>
          </ul>

          {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}

          <button
            onClick={onCheckout}
            disabled={loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Weiterleitung zu Stripe..." : "Jetzt kaufen"}
          </button>
        </div>
      </div>
    </div>
  );
}
