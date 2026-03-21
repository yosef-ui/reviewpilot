"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import AppShell from "../../components/AppShell";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vorname, setVorname] = useState("");
  const [trialActive, setTrialActive] = useState(true);
  const [stats, setStats] = useState({
    termineHeute: 0,
    smsGesendet: 0,
    bewertungenWoche: 0,
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
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("vorname, trial_end")
        .eq("user_id", user.id)
        .single();

      if (!profileError && profile) {
        setVorname(profile.vorname || "");
        const active = profile.trial_end
          ? new Date(profile.trial_end).getTime() > new Date().getTime()
          : true;
        setTrialActive(active);
      }

      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 6);
      const weekStartStr = weekStart.toISOString().slice(0, 10);

      const [{ count: todayCount }, { count: smsCount }, { count: weekCount }] =
        await Promise.all([
          supabase
            .from("Termine")
            .select("*", { count: "exact", head: true })
            .eq("datum", todayStr),
          supabase
            .from("Termine")
            .select("*", { count: "exact", head: true })
            .eq("sms_gesendet", true),
          supabase
            .from("Termine")
            .select("*", { count: "exact", head: true })
            .eq("bewertet", true)
            .gte("datum", weekStartStr),
        ]);

      setStats({
        termineHeute: todayCount || 0,
        smsGesendet: smsCount || 0,
        bewertungenWoche: weekCount || 0,
      });

      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-zinc-700">Lade Dashboard...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-6 py-10 text-rose-600">{error}</div>
    );
  }

  return (
    <AppShell activeNav="dashboard">
      <h1 className="text-3xl font-black tracking-tight">Guten Morgen! 👋</h1>
      <p className="mt-2 text-zinc-600">Hier ist deine aktuelle Übersicht.</p>
      {vorname ? (
        <p className="mt-1 text-sm text-zinc-500">Willkommen zurück, {vorname}.</p>
      ) : null}

      {!trialActive ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold">Dein Test ist abgelaufen</p>
            <Link
              href="/bezahlen"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Jetzt für €9,90/Monat weitermachen
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard title="Termine heute" value={stats.termineHeute} />
        <StatCard title="SMS gesendet" value={stats.smsGesendet} />
        <StatCard title="Bewertungen diese Woche" value={stats.bewertungenWoche} />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:max-w-xl">
        <Link
          href="/kalender-ansicht"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          📅 Kalender öffnen
        </Link>
        <Link
          href="/termine"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
        >
          📊 Alle Termine
        </Link>
      </div>
    </AppShell>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-zinc-900">{value}</p>
    </div>
  );
}
