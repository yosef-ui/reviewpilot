"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

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
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight">
          Guten Morgen, {vorname || "du"}! 👋
        </h1>
        <p className="mt-2 text-zinc-600">Hier ist deine aktuelle Übersicht.</p>

        {!trialActive ? (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
            Dein Test ist abgelaufen – jetzt für €9,90/Monat weitermachen
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard title="Termine heute" value={stats.termineHeute} />
          <StatCard title="SMS gesendet" value={stats.smsGesendet} />
          <StatCard title="Bewertungen diese Woche" value={stats.bewertungenWoche} />
        </div>

        <div className="mt-8">
          <Link
            href="/kalender"
            className="inline-flex h-11 items-center rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Zum Kalender →
          </Link>
        </div>
      </div>
    </div>
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

