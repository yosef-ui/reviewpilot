"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single Supabase client instance per browser session.
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const GOOGLE_REVIEW_LINK_FALLBACK = "https://www.google.com/maps";

export default function KalenderPage() {
  const [kundenname, setKundenname] = useState("");
  const [telefonnummer, setTelefonnummer] = useState("");
  const [datum, setDatum] = useState("");
  const [uhrzeit, setUhrzeit] = useState("");
  const [optIn, setOptIn] = useState(false);

  const [termine, setTermine] = useState([]);
  const [status, setStatus] = useState("");
  const [smsSendingForId, setSmsSendingForId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabase) {
        // Avoid setting state synchronously in the effect body.
        setTimeout(() => {
          if (!cancelled) {
            setStatus("Supabase-Konfiguration fehlt. Bitte .env.local prüfen.");
          }
        }, 0);
        return;
      }

      const { data, error } = await supabase
        .from("Termine")
        .select("*")
        .order("datum", { ascending: true })
        .order("uhrzeit", { ascending: true });

      if (cancelled) return;

      if (error) {
        setStatus(`Fehler beim Laden der Termine: ${error.message}`);
        setTermine([]);
        return;
      }

      setTermine(Array.isArray(data) ? data : []);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedTermine = useMemo(() => {
    const toTs = (t) => {
      const datePart = t?.datum ? `${t.datum}` : "";
      const timePart = t?.uhrzeit ? `${t.uhrzeit}` : "00:00";
      const ts = Date.parse(`${datePart}T${timePart}`);
      return Number.isFinite(ts) ? ts : 0;
    };

    return [...termine].sort((a, b) => toTs(a) - toTs(b));
  }, [termine]);

  async function refetchTermine() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("Termine")
      .select("*")
      .order("datum", { ascending: true })
      .order("uhrzeit", { ascending: true });

    if (error) {
      setStatus(`Fehler beim Laden der Termine: ${error.message}`);
      setTermine([]);
      return;
    }

    setTermine(Array.isArray(data) ? data : []);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");

    if (!kundenname.trim()) {
      setStatus("Bitte gib einen Kundenname ein.");
      return;
    }
    if (!telefonnummer.trim()) {
      setStatus("Bitte gib eine Telefonnummer ein.");
      return;
    }
    if (!datum) {
      setStatus("Bitte wähle ein Datum.");
      return;
    }
    if (!uhrzeit) {
      setStatus("Bitte wähle eine Uhrzeit.");
      return;
    }

    if (!supabase) {
      setStatus("Supabase ist nicht verfügbar. Bitte .env.local prüfen.");
      return;
    }

    const trimmedName = kundenname.trim();
    const trimmedTel = telefonnummer.trim();

    const payload = {
      kundenname: trimmedName,
      telefonnummer: trimmedTel,
      datum,
      uhrzeit,
      optin: optIn,
      sms_gesendet: false,
      link_geklickt: false,
      bewertet: false,
    };

    setStatus("Speichere Termin...");
    const { error } = await supabase.from("Termine").insert(payload);

    if (error) {
      setStatus(`Fehler beim Speichern: ${error.message}`);
      return;
    }

    setStatus("Termin gespeichert.");

    // Automatische Terminbestätigung (nur bei Opt-in).
    if (optIn) {
      const bestatigungstext = `Hallo ${trimmedName}, Ihr Termin am ${datum} um ${uhrzeit} ist bestätigt! Bei Fragen einfach anrufen. Ihr ReviewPilot Team 😊`;

      let confirmRes;
      try {
        confirmRes = await fetch("/api/sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kundenname: trimmedName,
            telefonnummer: trimmedTel,
            text: bestatigungstext,
          }),
        });
      } catch {
        setStatus(
          "Termin gespeichert, aber Bestätigungs-SMS konnte nicht gesendet werden."
        );
      }

      if (confirmRes && !confirmRes.ok) {
        let message = "Bestätigungs-SMS konnte nicht gesendet werden.";
        try {
          const payload = await confirmRes.json();
          message = payload?.error || message;
        } catch {
          // ignore
        }
        setStatus(`Termin gespeichert, ${message}`);
      }

      // Wichtiger Hinweis: Wir setzen hier KEIN `sms_gesendet`, da dieser Status für
      // die spätere "Termin erledigt"-SMS gedacht ist.
    }

    setKundenname("");
    setTelefonnummer("");
    setDatum("");
    setUhrzeit("");
    setOptIn(false);

    await refetchTermine();
  }

  async function removeTermin(termin) {
    if (!supabase) return;

    setStatus("Termin wird gelöscht...");
    const terminId = termin?.id;

    if (terminId !== undefined && terminId !== null) {
      const { error } = await supabase
        .from("Termine")
        .delete()
        .eq("id", terminId);

      if (error) {
        setStatus(`Fehler beim Löschen: ${error.message}`);
        return;
      }

      setStatus("Termin gelöscht.");
      await refetchTermine();
      return;
    }

    // Fallback: Löschung über mehrere Spalten (kann bei Dubletten mehrere Zeilen treffen).
    const match = {
      kundenname: termin?.kundenname,
      telefonnummer: termin?.telefonnummer,
      datum: termin?.datum,
      uhrzeit: termin?.uhrzeit,
      optin: termin?.optin,
      sms_gesendet: termin?.sms_gesendet ?? false,
      link_geklickt: termin?.link_geklickt ?? false,
      bewertet: termin?.bewertet ?? false,
    };

    const { error } = await supabase.from("Termine").delete().match(match);
    if (error) {
      setStatus(`Fehler beim Löschen: ${error.message}`);
      return;
    }

    setStatus("Termin gelöscht.");
    await refetchTermine();
  }

  async function markTerminErledigt(termin) {
    if (!supabase) {
      setStatus("Supabase ist nicht verfügbar.");
      return;
    }

    if (termin?.sms_gesendet) {
      setStatus("SMS wurde bereits gesendet.");
      return;
    }

    if (!termin?.optin) {
      setStatus("Kein Opt-in vorhanden. SMS wird nicht gesendet.");
      return;
    }

    const id = termin?.id;
    setSmsSendingForId(id ?? "no-id");
    setStatus("SMS wird gesendet...");

    let res;
    try {
      res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kundenname: termin?.kundenname,
          telefonnummer: termin?.telefonnummer,
          link: GOOGLE_REVIEW_LINK_FALLBACK,
        }),
      });
    } catch {
      setStatus("SMS konnte nicht gesendet werden (Netzwerkfehler).");
      setSmsSendingForId(null);
      return;
    }

    if (!res.ok) {
      let message = "SMS konnte nicht gesendet werden.";
      try {
        const payload = await res.json();
        message = payload?.error || message;
      } catch {
        // ignore
      }
      setStatus(message);
      setSmsSendingForId(null);
      return;
    }

    // Only update Supabase after Vonage confirmed the send request.
    if (id !== undefined && id !== null) {
      const { error } = await supabase
        .from("Termine")
        .update({ sms_gesendet: true })
        .eq("id", id);

      if (error) {
        setStatus(`Fehler beim Update in Supabase: ${error.message}`);
        setSmsSendingForId(null);
        return;
      }
    } else {
      const match = {
        kundenname: termin?.kundenname,
        telefonnummer: termin?.telefonnummer,
        datum: termin?.datum,
        uhrzeit: termin?.uhrzeit,
        optin: termin?.optin,
        sms_gesendet: termin?.sms_gesendet ?? false,
        link_geklickt: termin?.link_geklickt ?? false,
        bewertet: termin?.bewertet ?? false,
      };

      const { error } = await supabase
        .from("Termine")
        .update({ sms_gesendet: true })
        .match(match);

      if (error) {
        setStatus(`Fehler beim Update in Supabase: ${error.message}`);
        setSmsSendingForId(null);
        return;
      }
    }

    setStatus("Termin erledigt. SMS gesendet.");
    setSmsSendingForId(null);
    await refetchTermine();
  }

  async function deleteAllTermine() {
    if (!supabase) return;
    setStatus("Alle Termine werden gelöscht...");

    // PostgREST benötigt normalerweise eine Filterbedingung für DELETE.
    const { error } = await supabase
      .from("Termine")
      .delete()
      .neq("kundenname", "");

    if (error) {
      setStatus(`Fehler beim Löschen aller Termine: ${error.message}`);
      return;
    }

    setStatus("Alle Termine gelöscht.");
    await refetchTermine();
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white/70 px-4 text-sm font-semibold text-zinc-900 ring-1 ring-black/5 transition hover:bg-white dark:bg-white/5 dark:text-zinc-50 dark:ring-white/10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 18 9 12l6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Zurück
          </Link>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">Terminkalender</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Daten in Supabase speichern
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Neuen Termin anlegen
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Trage den Termin ein. Wenn der Kunde zustimmt, wird automatisch
              die SMS-Bewertungsanfrage vorbereitet (Opt-in).
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Kundenname</span>
                  <input
                    value={kundenname}
                    onChange={(e) => setKundenname(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5"
                    placeholder="z.B. Anna Müller"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Telefonnummer</span>
                  <input
                    value={telefonnummer}
                    onChange={(e) => setTelefonnummer(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5"
                    placeholder="z.B. +49 170 1234567"
                    inputMode="tel"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Datum</span>
                  <input
                    type="date"
                    value={datum}
                    onChange={(e) => setDatum(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Uhrzeit</span>
                  <input
                    type="time"
                    value={uhrzeit}
                    onChange={(e) => setUhrzeit(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5"
                    required
                  />
                </label>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white/60 p-4 text-sm dark:border-white/10 dark:bg-white/5">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-black/20 text-indigo-600 focus:ring-indigo-500/20 dark:border-white/20 dark:bg-black"
                />
                <span className="leading-relaxed">
                  Kunde hat SMS-Bewertungsanfrage zugestimmt (Opt-in)
                </span>
              </label>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Termin speichern
                </button>
              </div>

              {status ? (
                <p
                  role="status"
                  className={`text-sm font-medium ${
                    status.startsWith("Bitte")
                      ? "text-rose-700 dark:text-rose-300"
                      : "text-indigo-700 dark:text-indigo-300"
                  }`}
                >
                  {status}
                </p>
              ) : null}
            </form>
          </div>

          <div className="rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Gespeicherte Termine
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {sortedTermine.length === 0
                    ? "Noch keine Termine hinzugefügt."
                    : `${sortedTermine.length} Termin(e)`}
                </p>
              </div>
              {sortedTermine.length > 0 ? (
                <button
                  type="button"
                  onClick={() => deleteAllTermine()}
                  className="rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-800 ring-1 ring-black/5 transition hover:bg-white dark:bg-white/5 dark:text-zinc-50 dark:ring-white/10"
                >
                  Alle löschen
                </button>
              ) : null}
            </div>

            {sortedTermine.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-white/40 p-4 text-sm text-zinc-600 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300">
                Tipp: Lege einen Termin an und aktiviere den Opt-in, wenn der
                Kunde SMS-Bewertungsanfragen zustimmt.
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {sortedTermine.map((t) => {
                  const dateStr = t.datum;
                  const timeStr = t.uhrzeit;
                  const rowKey =
                    t.id ??
                    `${t.kundenname}-${t.telefonnummer}-${t.datum}-${t.uhrzeit}-${String(
                      t.optin
                    )}`;
                  const smsAlreadySent = Boolean(t.sms_gesendet);
                  return (
                    <li
                      key={rowKey}
                      className="rounded-2xl bg-white/60 p-4 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold">
                            {t.kundenname}
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-300">
                            {t.telefonnummer}
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {dateStr} · {timeStr}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-300">
                            Opt-in:{" "}
                            {t.optin ? (
                              <span className="text-emerald-700 dark:text-emerald-300">
                                Ja
                              </span>
                            ) : (
                              <span className="text-zinc-600 dark:text-zinc-400">
                                Nein
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-300">
                            SMS:{" "}
                            {smsAlreadySent ? (
                              <span className="text-emerald-700 dark:text-emerald-300">
                                Gesendet
                              </span>
                            ) : (
                              <span className="text-zinc-600 dark:text-zinc-400">
                                Offen
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => markTerminErledigt(t)}
                            disabled={smsAlreadySent || smsSendingForId === (t.id ?? "no-id")}
                            className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {smsAlreadySent ? "Erledigt" : "Termin erledigt"}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeTermin(t)}
                            className="inline-flex h-10 items-center justify-center rounded-full bg-white/70 px-4 text-sm font-semibold text-zinc-800 ring-1 ring-black/5 transition hover:bg-white dark:bg-white/5 dark:text-zinc-50 dark:ring-white/10"
                          >
                            Entfernen
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

