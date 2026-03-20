"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_ROW_HEIGHT = 64;

export default function KalenderAnsichtPage() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [termine, setTermine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    kundenname: "",
    telefonnummer: "",
    datum: toDateInputValue(new Date()),
    uhrzeit: "10:00",
    optin: false,
  });

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, idx) => addDays(weekStart, idx)),
    [weekStart]
  );

  const refetchWeek = useCallback(async () => {
    if (!supabase) return;
    const start = toDateInputValue(weekStart);
    const end = toDateInputValue(addDays(weekStart, 6));
    const { data, error } = await supabase
      .from("Termine")
      .select("*")
      .gte("datum", start)
      .lte("datum", end)
      .order("datum", { ascending: true })
      .order("uhrzeit", { ascending: true });
    if (error) {
      setStatus(`Fehler beim Laden: ${error.message}`);
      return;
    }
    setTermine(Array.isArray(data) ? data : []);
  }, [weekStart]);

  useEffect(() => {
    async function boot() {
      if (!supabase) {
        setStatus("Supabase-Konfiguration fehlt.");
        setLoading(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      await refetchWeek();
      setLoading(false);
    }
    boot();
  }, [router, refetchWeek]);

  async function onSaveTermin(e) {
    e.preventDefault();
    setStatus("");
    if (!supabase) return;
    if (
      !form.kundenname.trim() ||
      !form.telefonnummer.trim() ||
      !form.datum ||
      !form.uhrzeit
    ) {
      setStatus("Bitte alle Felder ausfüllen.");
      return;
    }

    const payload = {
      kundenname: form.kundenname.trim(),
      telefonnummer: form.telefonnummer.trim(),
      datum: form.datum,
      uhrzeit: form.uhrzeit,
      optin: form.optin,
      sms_gesendet: false,
      link_geklickt: false,
      bewertet: false,
    };

    const { error } = await supabase.from("Termine").insert(payload);
    if (error) {
      setStatus(`Fehler beim Speichern: ${error.message}`);
      return;
    }

    setShowModal(false);
    setForm((prev) => ({
      ...prev,
      kundenname: "",
      telefonnummer: "",
      datum: toDateInputValue(new Date()),
      uhrzeit: "10:00",
      optin: false,
    }));
    await refetchWeek();
  }

  async function onSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
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
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekStart((prev) => addDays(prev, -7))}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              ←
            </button>
            <button
              onClick={() => setWeekStart(getStartOfWeek(new Date()))}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Heute
            </button>
            <button
              onClick={() => setWeekStart((prev) => addDays(prev, 7))}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              →
            </button>
          </div>
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">
            Woche {formatWeekRange(weekStart)}
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-purple-700"
          >
            + Termin
          </button>
        </div>

        {status ? <p className="mb-4 text-sm font-medium text-zinc-700">{status}</p> : null}

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b border-zinc-200 bg-zinc-50">
              <div />
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="px-3 py-3 text-center">
                  <p className="text-xs font-semibold uppercase text-zinc-500">
                    {weekdayShort(day)}
                  </p>
                  <p className="text-sm font-bold text-zinc-800">{day.getDate()}</p>
                </div>
              ))}
            </div>

            <div
              className="relative grid grid-cols-[80px_repeat(7,minmax(0,1fr))]"
              style={{ height: `${(END_HOUR - START_HOUR) * HOUR_ROW_HEIGHT}px` }}
            >
              <div className="relative border-r border-zinc-200 bg-zinc-50">
                {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
                  const hour = START_HOUR + i;
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-zinc-200 text-[11px] text-zinc-500"
                      style={{ top: `${i * HOUR_ROW_HEIGHT}px` }}
                    >
                      <span className="-translate-y-2 inline-block bg-zinc-50 pr-2">
                        {String(hour).padStart(2, "0")}:00
                      </span>
                    </div>
                  );
                })}
              </div>

              {weekDays.map((day) => (
                <DayColumn key={day.toISOString()} day={day} termine={termine} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {showModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight">Neuen Termin anlegen</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSaveTermin} className="space-y-4">
              <Field
                label="Kundenname"
                value={form.kundenname}
                onChange={(value) => setForm((p) => ({ ...p, kundenname: value }))}
              />
              <Field
                label="Telefon"
                value={form.telefonnummer}
                onChange={(value) => setForm((p) => ({ ...p, telefonnummer: value }))}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Datum"
                  type="date"
                  value={form.datum}
                  onChange={(value) => setForm((p) => ({ ...p, datum: value }))}
                />
                <Field
                  label="Uhrzeit"
                  type="time"
                  value={form.uhrzeit}
                  onChange={(value) => setForm((p) => ({ ...p, uhrzeit: value }))}
                />
              </div>
              <label className="flex items-start gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={form.optin}
                  onChange={(e) => setForm((p) => ({ ...p, optin: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                />
                Kunde hat SMS-Bewertungsanfrage zugestimmt (Opt-in)
              </label>
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-purple-700"
              >
                Speichern
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DayColumn({ day, termine }) {
  const dayKey = toDateInputValue(day);
  const entries = termine.filter((t) => t.datum === dayKey);
  return (
    <div className="relative border-r border-zinc-200">
      {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-zinc-100"
          style={{ top: `${i * HOUR_ROW_HEIGHT}px` }}
        />
      ))}

      {entries.map((termin) => {
        const { hour, minute } = parseTime(termin.uhrzeit);
        const top = ((hour - START_HOUR) + minute / 60) * HOUR_ROW_HEIGHT;
        if (hour < START_HOUR || hour > END_HOUR) return null;

        const cls = termin.sms_gesendet
          ? "bg-purple-100 border-purple-300 text-purple-800"
          : termin.optin
          ? "bg-green-100 border-green-300 text-green-800"
          : "bg-zinc-100 border-zinc-300 text-zinc-700";

        return (
          <div
            key={termin.id ?? `${termin.kundenname}-${termin.uhrzeit}`}
            className={`absolute left-1 right-1 rounded-xl border px-2 py-1.5 text-xs shadow-sm ${cls}`}
            style={{ top: `${top}px`, minHeight: "48px" }}
          >
            <p className="font-semibold">{termin.kundenname}</p>
            <p className="opacity-80">{termin.uhrzeit}</p>
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // So=0
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function weekdayShort(date) {
  return date.toLocaleDateString("de-DE", { weekday: "short" });
}

function formatWeekRange(startDate) {
  const endDate = addDays(startDate, 6);
  return `${startDate.toLocaleDateString("de-DE")} – ${endDate.toLocaleDateString("de-DE")}`;
}

function parseTime(str) {
  const [h, m] = `${str || "00:00"}`.split(":");
  return { hour: Number(h) || 0, minute: Number(m) || 0 };
}

