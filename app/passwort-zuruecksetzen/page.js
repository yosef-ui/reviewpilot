"use client";

import Link from "next/link";
import { BrandLogoLink } from "../../components/BrandLogo";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

/**
 * Ziel nach Klick auf den Link in der Supabase-Passwort-Reset-Mail.
 * URL muss in Supabase → Authentication → URL configuration als Redirect erlaubt sein.
 */
export default function PasswortZuruecksetzenPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    let cancelled = false;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!cancelled) {
        setHasSession(!!session);
        setChecking(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled && session) {
        setHasSession(true);
        setChecking(false);
      }
    });

    check();
    const t = setTimeout(check, 500);

    return () => {
      cancelled = true;
      clearTimeout(t);
      subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    if (password.length < 6) {
      setError("Passwort mindestens 6 Zeichen.");
      return;
    }

    if (!supabase) {
      setError("Supabase-Konfiguration fehlt.");
      return;
    }

    setLoading(true);
    const { error: upErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (upErr) {
      setError(upErr.message);
      return;
    }

    await supabase.auth.signOut();
    router.push("/login");
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-zinc-600">
        Lade…
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-white text-zinc-900">
        <div className="mx-auto max-w-xl px-6 py-10">
          <BrandLogoLink />
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-black tracking-tight">Link ungültig</h1>
            <p className="mt-2 text-zinc-600">
              Dieser Link ist abgelaufen oder ungültig. Bitte fordere einen neuen Reset-Link an.
            </p>
            <p className="mt-6">
              <Link
                href="/passwort-vergessen"
                className="font-semibold text-blue-700 hover:text-blue-800"
              >
                Passwort vergessen?
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-xl px-6 py-10">
        <BrandLogoLink />

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">Neues Passwort setzen</h1>
          <p className="mt-2 text-zinc-600">Wähle ein sicheres neues Passwort.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">Neues Passwort</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">
                Passwort wiederholen
              </span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
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
              {loading ? "Speichern…" : "Passwort speichern"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Zur Anmeldung
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
