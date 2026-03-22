"use client";

import Link from "next/link";
import { BrandLogoLink } from "../../components/BrandLogo";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!supabase) {
      setError("Supabase-Konfiguration fehlt.");
      return;
    }

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }

    setLoading(true);
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/passwort-zuruecksetzen`
        : undefined;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      trimmed,
      redirectTo ? { redirectTo } : undefined
    );
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-xl px-6 py-10">
        <BrandLogoLink />

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">Passwort zurücksetzen</h1>
          <p className="mt-2 text-zinc-600">
            Wir senden dir einen Link zum Festlegen eines neuen Passworts.
          </p>

          {sent ? (
            <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              Wenn ein Konto mit dieser E-Mail existiert, erhältst du gleich eine E-Mail mit
              weiteren Schritten.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-zinc-700">E-Mail</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              {error ? (
                <p className="text-sm font-medium text-rose-600">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Senden…" : "Reset-Link senden"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-zinc-600">
            <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              ← Zurück zur Anmeldung
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
