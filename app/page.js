import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30">
              <SparkIcon />
            </div>
            <span className="text-sm font-semibold tracking-wide text-zinc-100">
              ReviewPilot
            </span>
          </div>
          <Link
            href="/kalender"
            className="inline-flex h-10 items-center rounded-full border border-cyan-400/40 px-4 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
          >
            Kostenlos starten
          </Link>
        </header>

        <main className="mt-14 sm:mt-20">
          <section className="text-center">
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              Mehr Google-Bewertungen. Automatisch.
            </h1>
            <div className="mt-8">
              <Link
                href="/kalender"
                className="inline-flex h-12 items-center justify-center rounded-full bg-cyan-500 px-7 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Kostenlos starten
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                  alt="Max Gruber"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-cyan-400/30"
                />
                <div>
                  <p className="text-lg font-semibold text-white">
                    Max Gruber, Inhaber Salon Max Wien
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    &quot;Seit ich ReviewPilot nutze bekomme ich jede Woche neue
                    Bewertungen – ohne einen Finger zu rühren.&quot;
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              So funktioniert’s
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
              <StepCard icon={<PhoneIcon />} text="Termin vereinbaren" />
              <Arrow />
              <StepCard icon={<CalendarIcon />} text="In ReviewPilot eintragen" />
              <Arrow />
              <StepCard icon={<GoogleReviewIcon />} text="5 Sterne auf Google" />
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              Automatische SMS im richtigen Moment
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <PhoneMockup
                title="Terminbestätigung"
                text="Hallo Maria, Ihr Termin am 25. März um 14:00 ist bestätigt! Salon Max 😊"
              />
              <PhoneMockup
                title="Bewertungsanfrage"
                text="Hallo Maria, danke für Ihren Besuch! Wir freuen uns über eine Bewertung 🌟 [Link] Diese Nachricht kommt nur einmal – versprochen! 😊"
              />
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              So sieht die neue Bewertung aus
            </h2>
            <div className="mx-auto mt-8 max-w-md">
              <GoogleReviewCard />
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              Ein fairer Preis
            </h2>
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-cyan-400/30 bg-cyan-500/10 p-8 text-center">
              <p className="text-4xl font-bold tracking-tight text-cyan-200">€9,90/Monat</p>
              <p className="mt-3 text-base font-medium text-zinc-200">
                ein einziges Abo, alles inklusive
              </p>
              <Link
                href="/kalender"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-cyan-500 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Jetzt kostenlos starten
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StepCard({ icon, text }) {
  return (
    <div className="flex h-44 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-sm">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/30">
        {icon}
      </div>
      <p className="mt-4 text-base font-semibold text-zinc-100">{text}</p>
    </div>
  );
}

function PhoneMockup({ title, text }) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-[2.1rem] border border-zinc-600 bg-zinc-900 p-2 shadow-xl">
        <div className="rounded-[1.7rem] bg-zinc-100 p-3">
          <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-zinc-300" />
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold text-zinc-500">{title}</p>
            <p className="mt-3 rounded-2xl bg-cyan-50 px-3 py-3 text-sm leading-relaxed text-zinc-800">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleReviewCard() {
  return (
    <div className="rounded-xl border border-zinc-300 bg-white p-4 text-left shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">
            MM
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Maria M.</p>
            <p className="text-xs text-zinc-500">vor 2 Tagen</p>
          </div>
        </div>
        <GoogleWordmark />
      </div>
      <p className="mt-2 text-sm leading-none text-[#FBBC04]">★★★★★</p>
      <p className="mt-2 text-sm text-zinc-700">Super Friseur, sehr zufrieden!</p>
    </div>
  );
}

function GoogleWordmark() {
  return (
    <p className="text-xs font-semibold leading-none">
      <span style={{ color: "#4285F4" }}>G</span>
      <span style={{ color: "#EA4335" }}>o</span>
      <span style={{ color: "#FBBC04" }}>o</span>
      <span style={{ color: "#4285F4" }}>g</span>
      <span style={{ color: "#34A853" }}>l</span>
      <span style={{ color: "#EA4335" }}>e</span>
    </p>
  );
}

function Arrow() {
  return (
    <div className="mx-auto hidden text-cyan-300 md:block" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M5 12h14m-5-5 5 5-5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 2l1.2 5.1L18 9l-4.8 1.9L12 16l-1.2-5.1L6 9l4.8-1.9L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6.8 3.6c.4-.4 1-.6 1.6-.4l2.2.7c.8.2 1.2 1 .9 1.8l-.7 1.8c-.1.3 0 .7.2 1A13.5 13.5 0 0 0 15.5 13c.3.2.7.3 1 .2l1.8-.7c.8-.3 1.6.1 1.8.9l.7 2.2c.2.6 0 1.2-.4 1.6l-1 1a3 3 0 0 1-3 .8c-4.8-1.3-9.1-5.6-10.4-10.4a3 3 0 0 1 .8-3l1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M7 3v2M17 3v2M4 8h16" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function GoogleReviewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="m12 3 2.6 5.5 6 1-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.5l6-1L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
