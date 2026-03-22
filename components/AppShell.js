"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { BrandLogoLink } from "./BrandLogo";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kalender-ansicht", label: "Kalender" },
  { href: "/termine", label: "Termine" },
  { href: "/settings", label: "Einstellungen" },
  { href: "/abrechnung", label: "Abrechnung" },
];

/**
 * @param {object} props
 * @param {'dashboard' | 'kalender' | 'termine' | 'settings' | 'abrechnung'} props.activeNav
 * @param {React.ReactNode} props.children
 */
export default function AppShell({ activeNav, children }) {
  const router = useRouter();

  async function onSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-6 py-2">
          <BrandLogoLink className="max-w-[min(100%,280px)]" />
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Einstellungen
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:gap-10">
        <aside className="shrink-0 lg:w-56">
          <nav
            className="flex flex-row gap-1 overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-50/90 p-2 shadow-sm lg:flex-col lg:overflow-visible"
            aria-label="Hauptnavigation"
          >
            {navItems.map((item) => {
              const active =
                (activeNav === "dashboard" && item.href === "/dashboard") ||
                (activeNav === "kalender" && item.href === "/kalender-ansicht") ||
                (activeNav === "termine" && item.href === "/termine") ||
                (activeNav === "settings" && item.href === "/settings") ||
                (activeNav === "abrechnung" && item.href === "/abrechnung");
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition lg:whitespace-normal ${
                    active
                      ? "bg-white text-[#1e3a8a] shadow-sm ring-1 ring-zinc-200"
                      : "text-zinc-600 hover:bg-white/80 hover:text-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
