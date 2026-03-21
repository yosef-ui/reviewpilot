"use client";

import Link from "next/link";
import { BrandLogoLink } from "../../components/BrandLogo";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { ensureKundeExists } from "../../lib/kunden";
import KundennameAutocomplete from "../../components/KundennameAutocomplete";

const START_HOUR = 8;
const END_HOUR = 20;
const SLOT_HOURS = END_HOUR - START_HOUR;
const HOUR_HEIGHT = 64;
const GOOGLE_REVIEW_FALLBACK = "https://www.google.com/maps";

export default function KalenderAnsichtPage() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [termine, setTermine] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    kundenname: "",
    telefonnummer: "",
    datum: "",
    uhrzeit: "",
    optin: false,
  });

  const [selectedTermin, setSelectedTermin] = useState(null);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState(null);
  /** Aus profiles – für SMS-Text (Firma + Bewertungslink) */
  const [smsContext, setSmsContext] = useState({
    firmenname: "",
    googleReviewLink: "",
  });

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const refetchWeek = useCallback(
    async (uid) => {
      if (!supabase || !uid) return;
      const start = toDateInput(weekStart);
      const end = toDateInput(addDays(weekStart, 6));
      const { data, error } = await supabase
        .from("Termine")
        .select("*")
        .eq("user_id", uid)
        .gte("datum", start)
        .lte("datum", end)
        .order("datum", { ascending: true })
        .order("uhrzeit", { ascending: true });
      if (error) {
        setStatus(`Fehler beim Laden: ${error.message}`);
        return;
      }
      setTermine(Array.isArray(data) ? data : []);
    },
    [weekStart]
  );

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
      setUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("firmenname, google_review_link, onboarding_done")
        .eq("user_id", user.id)
        .single();
      if (!profile || profile.onboarding_done !== true) {
        setLoading(false);
        router.replace("/onboarding");
        return;
      }
      setSmsContext({
        firmenname: profile?.firmenname ?? "",
        googleReviewLink: profile?.google_review_link ?? "",
      });
    }
    boot();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      await refetchWeek(userId);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, weekStart, refetchWeek]);

  async function onSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  }

  function openCreateModal(date, hour) {
    setCreateForm((prev) => ({
      ...prev,
      datum: toDateInput(date),
      uhrzeit: `${String(hour).padStart(2, "0")}:00`,
    }));
    setShowCreateModal(true);
  }

  async function onCreateTermin(e) {
    e.preventDefault();
    setStatus("");
    if (!supabase) return;
    if (
      !createForm.kundenname.trim() ||
      !createForm.telefonnummer.trim() ||
      !createForm.datum ||
      !createForm.uhrzeit
    ) {
      setStatus("Bitte alle Felder ausfüllen.");
      return;
    }

    if (!userId) {
      setStatus("Nicht angemeldet.");
      return;
    }

    const payload = {
      user_id: userId,
      kundenname: createForm.kundenname.trim(),
      telefonnummer: createForm.telefonnummer.trim(),
      datum: createForm.datum,
      uhrzeit: createForm.uhrzeit,
      optin: createForm.optin,
      sms_gesendet: false,
      link_geklickt: false,
      bewertet: false,
    };

    const { error } = await supabase.from("Termine").insert(payload);
    if (error) {
      setStatus(`Fehler beim Speichern: ${error.message}`);
      return;
    }

    let kundeErr = null;
    if (userId) {
      const res = await ensureKundeExists(
        supabase,
        userId,
        payload.kundenname,
        payload.telefonnummer
      );
      kundeErr = res.error;
    }
    if (kundeErr) {
      setStatus(`Termin gespeichert. Hinweis Kundenliste: ${kundeErr.message}`);
    }

    setShowCreateModal(false);
    setCreateForm({
      kundenname: "",
      telefonnummer: "",
      datum: "",
      uhrzeit: "",
      optin: false,
    });
    await refetchWeek(userId);
  }

  async function markTerminErledigt(termin) {
    if (!supabase || !userId || !termin || termin.sms_gesendet) return;
    if (!termin.optin) {
      setStatus("Kein Opt-in vorhanden. SMS wird nicht gesendet.");
      return;
    }

    setSending(true);
    setStatus("Sende SMS...");

    try {
      const link =
        (smsContext.googleReviewLink || "").trim() || GOOGLE_REVIEW_FALLBACK;
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kundenname: termin.kundenname,
          telefonnummer: termin.telefonnummer,
          link,
          firmenname: (smsContext.firmenname || "").trim() || undefined,
        }),
      });
      if (!res.ok) {
        setSending(false);
        setStatus("SMS konnte nicht gesendet werden.");
        return;
      }
    } catch {
      setSending(false);
      setStatus("SMS konnte nicht gesendet werden.");
      return;
    }

    const query = supabase
      .from("Termine")
      .update({ sms_gesendet: true })
      .eq("user_id", userId);
    const { error } =
      termin.id !== undefined && termin.id !== null
        ? await query.eq("id", termin.id)
        : await query.match({
            kundenname: termin.kundenname,
            telefonnummer: termin.telefonnummer,
            datum: termin.datum,
            uhrzeit: termin.uhrzeit,
          });
    setSending(false);

    if (error) {
      setStatus(`Fehler beim Aktualisieren: ${error.message}`);
      return;
    }

    setSelectedTermin(null);
    setStatus("Termin erledigt. SMS gesendet.");
    await refetchWeek(userId);
  }

  if (loading) {
    return <div className="min-h-screen bg-white px-6 py-10 text-zinc-600">Lade Kalender...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[4.25rem] max-w-[1200px] items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <BrandLogoLink className="max-w-[min(100%,200px)] shrink sm:max-w-[240px]" />

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setWeekStart((d) => addDays(d, -7))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              ←
            </button>
            <button
              onClick={() => setWeekStart((d) => addDays(d, 7))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              →
            </button>
            <button
              onClick={() => setWeekStart(getStartOfWeek(new Date()))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Heute
            </button>
          </div>

          <h1 className="hidden text-sm font-bold text-zinc-800 md:block lg:text-base">
            {formatWeekRange(weekStart)}
          </h1>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Dashboard
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + Termin
            </button>
            <button
              onClick={onSignOut}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Abmelden
            </button>
          </div>
        </div>
        <div className="border-t border-zinc-200 px-6 py-2 text-center text-sm font-semibold text-zinc-700 md:hidden">
          {formatWeekRange(weekStart)}
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        {status ? <p className="mb-3 text-sm font-medium text-zinc-700">{status}</p> : null}

        <div className="overflow-x-auto rounded-2xl border border-zinc-200">
          <div className="min-w-[1080px] bg-white">
            <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b border-zinc-200 bg-zinc-50">
              <div />
              {weekDays.map((day) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <div
                    key={day.toISOString()}
                    className={`px-2 py-3 text-center ${isToday ? "bg-blue-50" : ""}`}
                  >
                    <p className="text-xs font-semibold uppercase text-zinc-500">
                      {day.toLocaleDateString("de-DE", { weekday: "short" })}
                    </p>
                    <p className="text-sm font-bold text-zinc-800">{day.getDate()}</p>
                  </div>
                );
              })}
            </div>

            <div
              className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]"
              style={{ height: `${SLOT_HOURS * HOUR_HEIGHT}px` }}
            >
              <div className="relative border-r border-zinc-200">
                {Array.from({ length: SLOT_HOURS + 1 }, (_, i) => {
                  const hour = START_HOUR + i;
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-zinc-200 px-1 text-[11px] text-zinc-500"
                      style={{ top: `${i * HOUR_HEIGHT}px` }}
                    >
                      <span className="-translate-y-2 inline-block bg-white pr-1">
                        {String(hour).padStart(2, "0")}:00
                      </span>
                    </div>
                  );
                })}
              </div>

              {weekDays.map((day) => (
                <DayColumn
                  key={day.toISOString()}
                  day={day}
                  termine={termine}
                  onCellClick={openCreateModal}
                  onTerminClick={setSelectedTermin}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {showCreateModal ? (
        <Modal
          title="Neuen Termin anlegen"
          onClose={() => setShowCreateModal(false)}
        >
          <form onSubmit={onCreateTermin} className="space-y-4">
            <KundennameAutocomplete
              supabase={supabase}
              userId={userId}
              value={createForm.kundenname}
              onChange={(v) => setCreateForm((p) => ({ ...p, kundenname: v }))}
              onPhoneFill={(phone) =>
                setCreateForm((p) => ({ ...p, telefonnummer: phone }))
              }
            />
            <Field
              label="Telefon"
              value={createForm.telefonnummer}
              onChange={(v) => setCreateForm((p) => ({ ...p, telefonnummer: v }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Datum"
                type="date"
                value={createForm.datum}
                onChange={(v) => setCreateForm((p) => ({ ...p, datum: v }))}
              />
              <Field
                label="Uhrzeit"
                type="time"
                value={createForm.uhrzeit}
                onChange={(v) => setCreateForm((p) => ({ ...p, uhrzeit: v }))}
              />
            </div>
            <label className="flex items-start gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={createForm.optin}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, optin: e.target.checked }))
                }
                className="mt-1 h-4 w-4 rounded border-zinc-300"
              />
              Kunde hat SMS-Bewertungsanfrage zugestimmt (Opt-in)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-200"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Termin speichern
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {selectedTermin ? (
        <Modal title="Termin Details" onClose={() => setSelectedTermin(null)}>
          <div className="space-y-2 text-sm text-zinc-700">
            <p>
              <span className="font-semibold">Kunde:</span> {selectedTermin.kundenname}
            </p>
            <p>
              <span className="font-semibold">Telefon:</span> {selectedTermin.telefonnummer}
            </p>
            <p>
              <span className="font-semibold">Datum:</span> {selectedTermin.datum}
            </p>
            <p>
              <span className="font-semibold">Uhrzeit:</span> {selectedTermin.uhrzeit}
            </p>
            <p>
              <span className="font-semibold">OPT-IN:</span>{" "}
              {selectedTermin.optin ? "Ja" : "Nein"}
            </p>
            <p>
              <span className="font-semibold">SMS:</span>{" "}
              {selectedTermin.sms_gesendet ? "Gesendet" : "Offen"}
            </p>
          </div>
          <button
            onClick={() => markTerminErledigt(selectedTermin)}
            disabled={sending || selectedTermin.sms_gesendet}
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {selectedTermin.sms_gesendet
              ? "Bereits erledigt"
              : sending
              ? "Sende SMS..."
              : "Termin erledigt"}
          </button>
        </Modal>
      ) : null}
    </div>
  );
}

function DayColumn({ day, termine, onCellClick, onTerminClick }) {
  const dayKey = toDateInput(day);
  const entries = termine.filter((t) => t.datum === dayKey);
  const today = isSameDay(day, new Date());

  return (
    <div className={`relative border-r border-zinc-200 ${today ? "bg-blue-50/40" : ""}`}>
      {Array.from({ length: SLOT_HOURS + 1 }, (_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-zinc-200"
          style={{ top: `${i * HOUR_HEIGHT}px` }}
        />
      ))}

      {Array.from({ length: SLOT_HOURS }, (_, i) => {
        const hour = START_HOUR + i;
        return (
          <button
            key={hour}
            onClick={() => onCellClick(day, hour)}
            className="absolute left-0 right-0 z-0 w-full hover:bg-blue-100/30"
            style={{ top: `${i * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
            aria-label={`Termin am ${toDateInput(day)} um ${hour}:00 erstellen`}
          />
        );
      })}

      {entries.map((termin) => {
        const { hour, minute } = parseTime(termin.uhrzeit);
        if (hour < START_HOUR || hour > END_HOUR) return null;
        const top = ((hour - START_HOUR) + minute / 60) * HOUR_HEIGHT;

        const style = termin.sms_gesendet
          ? "border-purple-300 bg-purple-100 text-purple-800"
          : termin.optin
          ? "border-green-300 bg-green-100 text-green-800"
          : "border-zinc-300 bg-zinc-100 text-zinc-700";

        return (
          <button
            key={termin.id ?? `${termin.kundenname}-${termin.uhrzeit}`}
            onClick={(e) => {
              e.stopPropagation();
              onTerminClick(termin);
            }}
            className={`absolute left-1 right-1 z-10 rounded-xl border px-2 py-1.5 text-left text-xs shadow-sm ${style}`}
            style={{ top: `${top}px`, minHeight: "50px" }}
          >
            <p className="font-semibold">{termin.kundenname}</p>
            <p>{termin.uhrzeit}</p>
          </button>
        );
      })}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
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
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function parseTime(value) {
  const [h, m] = `${value || "00:00"}`.split(":");
  return { hour: Number(h) || 0, minute: Number(m) || 0 };
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatWeekRange(start) {
  const end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const year = start.getFullYear();
  const startDay = start.getDate();
  const endDay = end.getDate();
  const monthStart = start.toLocaleDateString("de-DE", { month: "long" });
  const monthEnd = end.toLocaleDateString("de-DE", { month: "long" });
  return sameMonth
    ? `${startDay}. ${monthStart} – ${endDay}. ${monthStart} ${year}`
    : `${startDay}. ${monthStart} – ${endDay}. ${monthEnd} ${year}`;
}

