"use client";

import { BrandLogoLink } from "../../components/BrandLogo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firmenname: "",
    googleReviewLink: "",
  });
  /** Nach erfolgreichem Speichern: Name für Erfolgs-Screen + Auto-Redirect */
  const [doneFirmenname, setDoneFirmenname] = useState(null);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError("Supabase-Konfiguration fehlt.");
        setLoading(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("firmenname, google_review_link, onboarding_done")
        .eq("user_id", user.id)
        .single();

      if (profile?.onboarding_done === true) {
        router.replace("/dashboard");
        return;
      }

      setForm({
        firmenname: profile?.firmenname?.trim() ?? "",
        googleReviewLink: profile?.google_review_link?.trim() ?? "",
      });
      setLoading(false);
    }
    load();
  }, [router]);

  useEffect(() => {
    if (!doneFirmenname) return;
    const id = setTimeout(() => {
      router.replace("/dashboard");
    }, 2800);
    return () => clearTimeout(id);
  }, [doneFirmenname, router]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!supabase) {
      setError("Supabase-Konfiguration fehlt.");
      return;
    }
    const firmenname = form.firmenname.trim();
    const googleReviewLink = form.googleReviewLink.trim();
    if (!firmenname || !googleReviewLink) {
      setError("Bitte Firmennamen und Google-Bewertungslink ausfüllen.");
      return;
    }
    try {
      new URL(googleReviewLink);
    } catch {
      setError("Bitte einen gültigen Link eingeben (beginnt mit https://).");
      return;
    }

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      router.replace("/login");
      return;
    }

    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        firmenname,
        google_review_link: googleReviewLink,
        onboarding_done: true,
      })
      .eq("user_id", user.id);

    setSaving(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    setDoneFirmenname(firmenname);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-zinc-600">
        Lade Onboarding...
      </div>
    );
  }

  if (doneFirmenname) {
    return (
      <div className="min-h-screen bg-white text-zinc-900">
        <div className="mx-auto max-w-xl px-6 py-10">
          <BrandLogoLink />
          <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/80 p-8 text-center shadow-sm">
            <p className="text-xl font-bold text-zinc-900">
              Hallo {doneFirmenname}! Alles bereit.
            </p>
            <p className="mt-3 text-sm text-zinc-600">
              Du wirst gleich zum Dashboard weitergeleitet …
            </p>
            <button
              type="button"
              onClick={() => router.replace("/dashboard")}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#6366f1] px-6 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
            >
              Zum Dashboard
            </button>
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
          <h1 className="text-3xl font-black tracking-tight">Willkommen!</h1>
          <p className="mt-2 text-zinc-600">
            Damit deine SMS-Bewertungsanfragen zu deinem Betrieb passen, brauchen
            wir noch zwei Angaben.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">
                Firmenname
              </span>
              <input
                name="firmenname"
                value={form.firmenname}
                onChange={onChange}
                required
                placeholder="z. B. Musterfriseur Berlin"
                className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <div className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">
                Link zur Google-Bewertung
              </span>
              <div className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-3 text-sm leading-relaxed text-zinc-800">
                <p className="m-0">
                  Deinen Google Review Link kostenlos erstellen: Geh auf
                  whitespark.ca/google-review-link-generator, gib deinen
                  Firmennamen ein und kopiere den Link.
                </p>
                <a
                  href="https://whitespark.ca/google-review-link-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-10 items-center justify-center rounded-lg border border-indigo-300 bg-white px-4 text-sm font-semibold text-indigo-800 shadow-sm transition hover:bg-indigo-100"
                >
                  Link Generator öffnen
                </a>
              </div>
              <input
                name="googleReviewLink"
                type="url"
                value={form.googleReviewLink}
                onChange={onChange}
                required
                placeholder="https://g.page/.../review"
                className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {error ? (
              <p className="text-sm font-medium text-rose-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Speichern…" : "Weiter zum Dashboard →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
