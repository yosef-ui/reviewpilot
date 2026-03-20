export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans dark:bg-black dark:text-zinc-50">
      {/* Background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/30 via-sky-500/25 to-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/15 to-amber-400/10 blur-3xl" />
      </div>

      <header className="relative mx-auto max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
              {/* Simple inline mark */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2.75c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M8.2 12.3 10.4 14.5 15.9 9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-wide">
              ReviewPilot
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 sm:flex">
            <a className="hover:text-zinc-900 dark:hover:text-zinc-50" href="#features">
              Funktionen
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-50" href="#zielgruppen">
              Für wen?
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-50" href="#cta">
              Starten
            </a>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="py-12 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-zinc-700 ring-1 ring-black/5 dark:bg-white/5 dark:text-zinc-200 dark:ring-white/10">
                Automatisch mehr Google-Bewertungen
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-400/20">
                  für Restaurants, Friseure & Handwerk
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                So bekommt ihr mühelos
                <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  mehr Google-Bewertungen
                </span>
                .
              </h1>

              <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                ReviewPilot hilft euch dabei, nach Terminen automatisch passende
                Erinnerungen zu senden und so eure Zufriedenen zu
                Bewertungen auf Google zu bewegen. Weniger Aufwand. Mehr Vertrauen
                für Neukunden.
              </p>

              <div id="cta" className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  href="#"
                >
                  Kostenlos starten
                </a>
                <a
                  className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-50 dark:hover:bg-white/10"
                  href="#features"
                >
                  So funktioniert’s
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <span className="inline-flex items-center gap-2">
                  <CheckIcon /> DSGVO-freundliche Abläufe
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckIcon /> Start in wenigen Minuten
                </span>
              </div>
            </div>

            {/* Right hero card */}
            <div className="relative">
              <div className="rounded-3xl bg-white/70 p-1 ring-1 ring-black/5 shadow-sm backdrop-blur dark:bg-white/5 dark:ring-white/10">
                <div className="rounded-[2.9rem] bg-gradient-to-b from-indigo-50/70 via-white/70 to-white p-6 dark:from-indigo-500/10 dark:via-white/5 dark:to-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Heute</p>
                      <p className="text-3xl font-semibold tracking-tight">
                        +12
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        wahrscheinliche Bewertungen
                      </p>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
                      <SparkIcon />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <TimelineRow
                      label="Termin erstellt"
                      sub="Kalender verbindet"
                      icon={<CalendarIcon />}
                    />
                    <TimelineRow
                      label="Nach dem Termin"
                      sub="Auto-SMS mit Bewertungslink"
                      icon={<SmsIcon />}
                    />
                    <TimelineRow
                      label="Neue Rezensionen"
                      sub="Mehr Sichtbarkeit auf Google"
                      icon={<StarIcon />}
                    />
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-indigo-500/15 blur-sm dark:bg-indigo-500/20" />
              <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-2xl bg-emerald-500/15 blur-sm dark:bg-emerald-500/20" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-6 sm:py-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Alles, was ihr braucht – automatisch.
              </h2>
              <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
                Drei Bausteine, die zusammenwirken: Termin → Nachricht →
                Bewertung. So bleibt ihr im Alltag fokussiert.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <FeatureCard
              title="Terminkalender"
              description="Verknüpft euren Kalender und erkennt Termine zuverlässig – damit die Automationen genau dann starten, wenn sie gebraucht werden."
              icon={<CalendarIcon />}
            />
            <FeatureCard
              title="Auto-SMS nach Termin"
              description="Nach dem Termin sendet ReviewPilot eine kurze SMS mit einem passenden Link. Auf Wunsch personalisiert."
              icon={<SmsIcon />}
            />
            <FeatureCard
              title="Mehr Google-Bewertungen"
              description="Mehr echte Bewertungen erhöhen Vertrauen, Sichtbarkeit und Buchungen. Ihr bekommt Ergebnisse, ohne ständig hinterher zu telefonieren."
              icon={<StarIcon />}
            />
          </div>
        </section>

        {/* Zielgruppen */}
        <section
          id="zielgruppen"
          className="py-8 sm:py-12"
        >
          <div className="rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Für euch gedacht, egal welche Branche.
                </h3>
                <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
                  ReviewPilot ist ideal für Restaurants, Friseure und
                  Handwerker – überall dort, wo ein Termin der beste Zeitpunkt
                  für Feedback ist.
                </p>
              </div>
              <a
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                href="#"
              >
                Kostenlos starten
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-12 pt-2 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {new Date().getFullYear()} ReviewPilot
            </span>
            <div className="flex gap-4">
              <a className="hover:text-zinc-700 dark:hover:text-zinc-200" href="#features">
                Funktionen
              </a>
              <a className="hover:text-zinc-700 dark:hover:text-zinc-200" href="#cta">
                Starten
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {description}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/10 to-emerald-500/10 opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}

function TimelineRow({ label, sub, icon }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white/60 p-3 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
      <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-zinc-900 ring-1 ring-black/5 dark:bg-black/20 dark:text-white dark:ring-white/10">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{sub}</p>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4.5 w-4.5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3v2M17 3v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 8h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 16h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SmsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 13h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="m12 2 3.1 6.6 7.3 1.1-5.2 5.1 1.3 7.2L12 18.9 5.5 22l1.3-7.2L1.6 9.7l7.3-1.1L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2l1.2 5.1L18 9l-4.8 1.9L12 16l-1.2-5.1L6 9l4.8-1.9L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 14l.7 2.6L23 17.3l-2.3.7L20 20l-.7-2.6-2.3-.7 2.3-.7L20 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
