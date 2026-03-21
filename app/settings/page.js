"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import AppShell from "../../components/AppShell";
import { SMS_STOP_FOOTER } from "../../lib/smsTemplates";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    firmenname: "",
    googleReviewLink: "",
    customSmsNachricht: "",
  });

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError("Supabase-Konfiguration fehlt.");
        setLoading(false);
        return;
      }
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("firmenname, google_review_link, custom_sms_nachricht")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (pErr) {
        setError(pErr.message);
        setLoading(false);
        return;
      }

      setForm({
        firmenname: profile?.firmenname?.trim() ?? "",
        googleReviewLink: profile?.google_review_link?.trim() ?? "",
        customSmsNachricht: profile?.custom_sms_nachricht?.trim() ?? "",
      });
      setLoading(false);
    }
    load();
  }, [router]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    if (!supabase) {
      setError("Supabase-Konfiguration fehlt.");
      return;
    }

    const firmenname = form.firmenname.trim();
    const googleReviewLink = form.googleReviewLink.trim();
    const customRaw = form.customSmsNachricht.trim();

    if (!firmenname || !googleReviewLink) {
      setError("Firmenname und Google-Bewertungslink sind Pflichtfelder.");
      return;
    }
    try {
      new URL(googleReviewLink);
    } catch {
      setError("Bitte einen gültigen Link eingeben (https://…).");
      return;
    }

    setSaving(true);
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      setSaving(false);
      router.replace("/login");
      return;
    }

    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        firmenname,
        google_review_link: googleReviewLink,
        custom_sms_nachricht: customRaw || null,
      })
      .eq("user_id", session.user.id);

    setSaving(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    setOk("Änderungen gespeichert.");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-zinc-600">
        Lade Einstellungen…
      </div>
    );
  }

  return (
    <AppShell activeNav="settings">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Meine Einstellungen</h1>
        <p className="mt-2 text-zinc-600">
          Firmenname, Bewertungslink und SMS-Text kannst du hier jederzeit anpassen.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 max-w-xl space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Firmenname
            </span>
            <input
              name="firmenname"
              value={form.firmenname}
              onChange={onChange}
              required
              className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Link zur Google-Bewertung
            </span>
            <input
              name="googleReviewLink"
              type="url"
              value={form.googleReviewLink}
              onChange={onChange}
              required
              className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <div className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              SMS-Nachricht anpassen (optional)
            </span>
            <textarea
              name="customSmsNachricht"
              value={form.customSmsNachricht}
              onChange={onChange}
              rows={5}
              placeholder="Leer lassen für die Standard-Bewertungsanfrage per SMS."
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Der letzte Satz wird automatisch hinzugefügt: {SMS_STOP_FOOTER}
            </p>
          </div>

          {error ? (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          ) : null}
          {ok ? (
            <p className="text-sm font-medium text-emerald-700">{ok}</p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6366f1] px-6 text-sm font-semibold text-white transition hover:bg-[#4f46e5] disabled:opacity-60"
            >
              {saving ? "Speichern…" : "Speichern"}
            </button>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 px-6 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Zurück zum Dashboard
            </Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
