"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const GOOGLE_REVIEW_LINK_FALLBACK = "https://www.google.com/maps";

export default function KalenderPage() {
  const router = useRouter();
  const [kundenname, setKundenname] = useState("");
  const [telefonnummer, setTelefonnummer] = useState("");
  const [datum, setDatum] = useState("");
  const [uhrzeit, setUhrzeit] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [status, setStatus] = useState("");
  const [termine, setTermine] = useState([]);
  const [sendingId, setSendingId] = useState(null);
  const [userChecked, setUserChecked] = useState(false);

  const sortedTermine = useMemo(() => {
    return [...termine].sort((a, b) => {
      const aTs = Date.parse(`${a?.datum || ""}T${a?.uhrzeit || "00:00"}`);
      const bTs = Date.parse(`${b?.datum || ""}T${b?.uhrzeit || "00:00"}`);
      return (Number.isFinite(aTs) ? aTs : 0) - (Number.isFinite(bTs) ? bTs : 0);
    });
  }, [termine]);

  async function refetchTermine() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("Termine")
      .select("*")
      .order("datum", { ascending: true })
      .order("uhrzeit", { ascending: true });
    if (error) {
      setStatus(`Fehler beim Laden: ${error.message}`);
      return;
    }
    setTermine(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    async function boot() {
      if (!supabase) {
        setStatus("Supabase-Konfiguration fehlt.");
        setUserChecked(true);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserChecked(true);
      await refetchTermine();
    }
    boot();
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");

    if (!supabase) {
      setStatus("Supabase ist nicht verfügbar.");
      return;
    }
    if (!kundenname.trim() || !telefonnummer.trim() || !datum || !uhrzeit) {
      setStatus("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    const payload = {
      kundenname: kundenname.trim(),
      telefonnummer: telefonnummer.trim(),
      datum,
      uhrzeit,
      optin: optIn,
      sms_gesendet: false,
      link_geklickt: false,
      bewertet: false,
    };

    const { error } = await supabase.from("Termine").insert(payload);
    if (error) {
      setStatus(`Fehler beim Speichern: ${error.message}`);
      return;
    }

    if (optIn) {
      try {
        await fetch("/api/sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kundenname: payload.kundenname,
            telefonnummer: payload.telefonnummer,
            text: `Hallo ${payload.kundenname}, Ihr Termin am ${datum} um ${uhrzeit} ist bestätigt! Bei Fragen einfach anrufen. Ihr ReviewPilot Team 😊`,
          }),
        });
      } catch {
        // Best effort only
      }
    }

    setKundenname("");
    setTelefonnummer("");
    setDatum("");
    setUhrzeit("");
    setOptIn(false);
    setStatus("Termin gespeichert.");
    await refetchTermine();
  }

  async function markTerminErledigt(termin) {
    if (!supabase) return;
    if (termin?.sms_gesendet) return;
    if (!termin?.optin) {
      setStatus("Kein Opt-in vorhanden. SMS wird nicht gesendet.");
      return;
    }

    setSendingId(termin.id ?? "fallback");
    setStatus("Sende SMS...");

    let res;
    try {
      res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kundenname: termin.kundenname,
          telefonnummer: termin.telefonnummer,
          link: GOOGLE_REVIEW_LINK_FALLBACK,
        }),
      });
    } catch {
      setStatus("SMS konnte nicht gesendet werden.");
      setSendingId(null);
      return;
    }

    if (!res.ok) {
      setStatus("SMS konnte nicht gesendet werden.");
      setSendingId(null);
      return;
    }

    const query = supabase.from("Termine").update({ sms_gesendet: true });
    const { error } =
      termin.id !== undefined && termin.id !== null
        ? await query.eq("id", termin.id)
        : await query.match({
            kundenname: termin.kundenname,
            telefonnummer: termin.telefonnummer,
            datum: termin.datum,
            uhrzeit: termin.uhrzeit,
          });

    setSendingId(null);
    if (error) {
      setStatus(`Fehler beim Aktualisieren: ${error.message}`);
      return;
    }

    setStatus("Termin erledigt. SMS gesendet.");
    await refetchTermine();
  }

  async function removeTermin(termin) {
    if (!supabase) return;

    const query = supabase.from("Termine").delete();
    const { error } =
      termin.id !== undefined && termin.id !== null
        ? await query.eq("id", termin.id)
        : await query.match({
            kundenname: termin.kundenname,
            telefonnummer: termin.telefonnummer,
            datum: termin.datum,
            uhrzeit: termin.uhrzeit,
          });
    if (error) {
      setStatus(`Fehler beim Löschen: ${error.message}`);
      return;
    }
    setStatus("Termin gelöscht.");
    await refetchTermine();
  }

  async function onSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!userChecked) {
    return <div className="min-h-screen bg-white px-6 py-10 text-zinc-600">Lade...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-extrabold text-[#1e3a8a]">
            ⭐ ReviewPilot
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Dashboard
            </Link>
            <button
              onClick={onSignOut}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-black tracking-tight">Neuen Termin anlegen</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Trage den Termin ein und aktiviere optional SMS-Opt-in.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Kundenname"
                  value={kundenname}
                  onChange={setKundenname}
                  placeholder="z.B. Maria Müller"
                />
                <Field
                  label="Telefonnummer"
                  value={telefonnummer}
                  onChange={setTelefonnummer}
                  placeholder="+43 660 1234567"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Datum" type="date" value={datum} onChange={setDatum} />
                <Field label="Uhrzeit" type="time" value={uhrzeit} onChange={setUhrzeit} />
              </div>

              <label className="flex items-start gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                />
                Kunde hat SMS-Bewertungsanfrage zugestimmt (Opt-in)
              </label>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-purple-700"
              >
                Termin speichern
              </button>

              {status ? <p className="text-sm font-medium text-zinc-700">{status}</p> : null}
            </form>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight">Gespeicherte Termine</h2>
              <Link
                href="/termine"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Alle Termine →
              </Link>
            </div>

            <div className="space-y-3">
              {sortedTermine.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
                  Noch keine Termine gespeichert.
                </div>
              ) : (
                sortedTermine.map((t) => {
                  const smsSent = Boolean(t.sms_gesendet);
                  return (
                    <article key={t.id ?? `${t.kundenname}-${t.datum}-${t.uhrzeit}`} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <p className="text-lg font-bold text-zinc-900">{t.kundenname}</p>
                      <p className="text-sm text-zinc-500">{t.telefonnummer}</p>
                      <p className="mt-2 flex items-center gap-3 text-sm text-zinc-600">
                        <span>📅 {t.datum}</span>
                        <span>🕒 {t.uhrzeit}</span>
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.optin ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
                          {t.optin ? "OPT-IN: Ja" : "OPT-IN: Nein"}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${smsSent ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"}`}>
                          SMS: {smsSent ? "Gesendet" : "Offen"}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={smsSent || sendingId === (t.id ?? "fallback")}
                          onClick={() => markTerminErledigt(t)}
                          className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {smsSent ? "Erledigt" : "Termin erledigt"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTermin(t)}
                          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-200"
                        >
                          Entfernen
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

