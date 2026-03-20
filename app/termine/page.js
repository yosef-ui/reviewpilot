"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const FILTERS = ["Alle", "Offen", "Erledigt", "SMS gesendet"];

export default function TerminePage() {
  const router = useRouter();
  const [termine, setTermine] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Alle");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  async function refetch() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("Termine")
      .select("*")
      .order("datum", { ascending: false })
      .order("uhrzeit", { ascending: false });
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
      await refetch();
      setLoading(false);
    }
    boot();
  }, [router]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return termine.filter((t) => {
      const bySearch =
        !q ||
        `${t.kundenname || ""}`.toLowerCase().includes(q) ||
        `${t.telefonnummer || ""}`.toLowerCase().includes(q);

      const byFilter =
        filter === "Alle"
          ? true
          : filter === "Offen"
          ? !t.bewertet
          : filter === "Erledigt"
          ? Boolean(t.bewertet)
          : Boolean(t.sms_gesendet);

      return bySearch && byFilter;
    });
  }, [termine, search, filter]);

  async function markErledigt(termin) {
    if (!supabase) return;
    if (termin?.bewertet) return;
    setSavingId(termin.id ?? "fallback");

    const query = supabase.from("Termine").update({ bewertet: true });
    const { error } =
      termin.id !== undefined && termin.id !== null
        ? await query.eq("id", termin.id)
        : await query.match({
            kundenname: termin.kundenname,
            telefonnummer: termin.telefonnummer,
            datum: termin.datum,
            uhrzeit: termin.uhrzeit,
          });
    setSavingId(null);

    if (error) {
      setStatus(`Fehler beim Markieren: ${error.message}`);
      return;
    }
    setStatus("Termin als erledigt markiert.");
    await refetch();
  }

  if (loading) {
    return <div className="min-h-screen bg-white px-6 py-10 text-zinc-600">Lade Termine...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-extrabold text-[#1e3a8a]">
            ⭐ ReviewPilot
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
              Dashboard
            </Link>
            <Link href="/kalender" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              Neuer Termin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-black tracking-tight">Terminübersicht</h1>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suchen nach Name oder Telefon..."
              className="h-11 w-full max-w-sm rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {status ? <p className="mt-3 text-sm font-medium text-zinc-700">{status}</p> : null}

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Telefon</th>
                  <th className="px-3 py-2">Datum</th>
                  <th className="px-3 py-2">Uhrzeit</th>
                  <th className="px-3 py-2">Opt-in</th>
                  <th className="px-3 py-2">SMS Status</th>
                  <th className="px-3 py-2">Bewertet</th>
                  <th className="px-3 py-2">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id ?? `${t.kundenname}-${t.datum}-${t.uhrzeit}`} className="border-b border-zinc-100">
                    <td className="px-3 py-2 font-semibold text-zinc-900">{t.kundenname}</td>
                    <td className="px-3 py-2 text-zinc-600">{t.telefonnummer}</td>
                    <td className="px-3 py-2 text-zinc-600">{t.datum}</td>
                    <td className="px-3 py-2 text-zinc-600">{t.uhrzeit}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${t.optin ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {t.optin ? "Ja" : "Nein"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${t.sms_gesendet ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {t.sms_gesendet ? "Gesendet" : "Offen"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${t.bewertet ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {t.bewertet ? "Ja" : "Nein"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => markErledigt(t)}
                        disabled={Boolean(t.bewertet) || savingId === (t.id ?? "fallback")}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Erledigt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 ? (
              <p className="py-6 text-center text-zinc-500">Keine Termine gefunden.</p>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

