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
        .select("firmenname, google_review_link")
        .eq("user_id", user.id)
        .single();

      if (
        profile?.firmenname?.trim() &&
        profile?.google_review_link?.trim()
      ) {
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
      })
      .eq("user_id", user.id);

    setSaving(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-zinc-600">
        Lade Onboarding...
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
                className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <div className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-700">
                Link zur Google-Bewertung
              </span>
              <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-3 text-sm leading-relaxed text-blue-950">
                <p className="m-0">
                  Deinen Google Review Link kostenlos erstellen: Geh auf
                  whitespark.ca/google-review-link-generator, gib deinen
                  Firmennamen ein und kopiere den Link.
                </p>
                <a
                  href="https://whitespark.ca/google-review-link-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-10 items-center justify-center rounded-lg border border-blue-300 bg-white px-4 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-100"
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
                className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {error ? (
              <p className="text-sm font-medium text-rose-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Speichern…" : "Weiter zum Dashboard →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
