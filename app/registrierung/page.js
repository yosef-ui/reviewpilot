"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RegistrierungPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    vorname: "",
    nachname: "",
    email: "",
    passwort: "",
    passwortWdh: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!supabase) {
      setError("Supabase-Konfiguration fehlt.");
      return;
    }
    if (!form.vorname.trim() || !form.nachname.trim()) {
      setError("Bitte Vorname und Nachname eingeben.");
      return;
    }
    if (form.passwort.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    if (form.passwort !== form.passwortWdh) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    if (!form.agree) {
      setError("Bitte AGB und Datenschutzbestimmungen akzeptieren.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.passwort,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      setLoading(false);
      setError("Registrierung konnte nicht abgeschlossen werden.");
      return;
    }

    const trialStart = new Date();
    const trialEnd = new Date(trialStart);
    trialEnd.setDate(trialEnd.getDate() + 14);

    const { error: profileError } = await supabase.from("profiles").upsert({
      user_id: userId,
      vorname: form.vorname.trim(),
      nachname: form.nachname.trim(),
      trial_start: trialStart.toISOString(),
      trial_end: trialEnd.toISOString(),
      is_paid: false,
    });

    setLoading(false);

    if (profileError) {
      setError(`Konto erstellt, aber Profil fehlgeschlagen: ${profileError.message}`);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-xl px-6 py-10">
        <Link href="/" className="text-lg font-extrabold text-[#1e3a8a]">
          ⭐ ReviewPilot
        </Link>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">14 Tage kostenlos testen</h1>
          <p className="mt-2 text-zinc-600">Keine Kreditkarte nötig</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Vorname"
                name="vorname"
                value={form.vorname}
                onChange={onChange}
              />
              <Input
                label="Nachname"
                name="nachname"
                value={form.nachname}
                onChange={onChange}
              />
            </div>

            <Input
              label="E-Mail"
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
            />
            <Input
              label="Passwort"
              name="passwort"
              value={form.passwort}
              onChange={onChange}
              type="password"
            />
            <Input
              label="Passwort wiederholen"
              name="passwortWdh"
              value={form.passwortWdh}
              onChange={onChange}
              type="password"
            />

            <label className="flex items-start gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={onChange}
                className="mt-1 h-4 w-4 rounded border-zinc-300"
              />
              Ich stimme den AGB und Datenschutzbestimmungen zu
            </label>

            {error ? (
              <p className="text-sm font-medium text-rose-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Registriere..." : "Jetzt starten →"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-zinc-600">
            Bereits ein Konto?{" "}
            <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Anmelden
            </Link>
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-zinc-600">
            <span>✓ 14 Tage gratis</span>
            <span>✓ Keine Kreditkarte</span>
            <span>✓ DSGVO-konform</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required
        className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

