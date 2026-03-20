"use client";

import Link from "next/link";

const tickerItems = [
  { text: "⭐ +18 Bewertungen/Monat", color: "bg-blue-100 text-blue-700" },
  { text: "📱 98% SMS-Öffnungsrate", color: "bg-green-100 text-green-700" },
  { text: "⚡ 5 Min Setup", color: "bg-orange-100 text-orange-700" },
  { text: "🔒 DSGVO AT & DE", color: "bg-purple-100 text-purple-700" },
  { text: "💶 €9,90/Monat", color: "bg-pink-100 text-pink-700" },
  { text: "🏆 Für alle Branchen", color: "bg-yellow-100 text-yellow-700" },
];

const whyCards = [
  ["⭐", "+18 Bewertungen", "Im Schnitt pro Monat", "bg-yellow-50"],
  ["📱", "98% geöffnet", "SMS werden fast immer gelesen", "bg-blue-50"],
  ["⚡", "5 Min Setup", "Sofort startklar", "bg-orange-50"],
  ["🔒", "DSGVO-sicher", "Konform für AT & DE", "bg-green-50"],
  ["📅", "Eigener Kalender", "Kein extra Tool nötig", "bg-purple-50"],
  ["💶", "€9,90/Monat", "Jederzeit kündbar", "bg-pink-50"],
];

const reviews = [
  {
    initials: "MM",
    color: "bg-blue-100",
    name: "Maria M.",
    text: "Super Friseur, sehr zufrieden! Komme immer wieder gerne. ✂️",
    business: "Salon Müller, Wien",
  },
  {
    initials: "SR",
    color: "bg-green-100",
    name: "Stefan R.",
    text: "Das Essen war fantastisch und der Service einfach top! Sehr empfehlenswert. 🍝",
    business: "Restaurant Bella Italia, Graz",
  },
  {
    initials: "JK",
    color: "bg-purple-100",
    name: "Julia K.",
    text: "Endlich ein Zahnarzt wo man sich wirklich wohlfühlt. Sehr einfühlsam und professionell! 🦷",
    business: "Zahnarztpraxis Dr. Hofer, Salzburg",
  },
  {
    initials: "MT",
    color: "bg-orange-100",
    name: "Markus T.",
    text: "Schnelle und saubere Arbeit! Der beste Elektriker den ich je hatte. 👍",
    business: "Elektro Huber GmbH, Linz",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <HeroSection />
      <Ticker />
      <HowItWorks />
      <SmsSection />
      <ReviewsSection />
      <TestimonialSection />
      <WhySection />
      <PricingSection />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="text-lg font-extrabold text-[#1e3a8a]">⭐ ReviewPilot</div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-zinc-500 hover:text-zinc-700">
            Anmelden
          </Link>
          <Link
            href="/registrierung"
            className="inline-flex h-10 items-center rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Kostenlos testen →
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="bg-[#f8fafc] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mx-auto inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700">
          ✨ Neu: Jetzt mit automatischer Terminbestätigung
        </p>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
          <span className="block text-black">Deine Kunden vergessen</span>
          <span className="block text-[#2563eb]">Bewertungen zu schreiben.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
          ReviewPilot erinnert sie automatisch – per SMS, zur richtigen Zeit, mit
          den richtigen Worten.
        </p>
        <p className="mx-auto mt-6 max-w-3xl text-2xl font-extrabold leading-tight text-[#1e3a8a]">
          Was wäre, wenn wir deine Bewertungen von 0–5 pro Woche auf 15–20 bringen könnten? 🚀
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/registrierung"
            className="inline-flex h-12 items-center rounded-2xl bg-[#2563eb] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Kostenlos 14 Tage testen →
          </Link>
          <Link
            href="/registrierung"
            className="inline-flex h-12 items-center rounded-2xl border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
          >
            Wie funktioniert&apos;s?
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-zinc-600">
          <span>✓ Keine Kreditkarte</span>
          <span>✓ DSGVO-konform</span>
          <span>✓ Setup in 5 Min</span>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <section className="border-y border-zinc-200 bg-white py-2">
      <div className="overflow-hidden">
        <div className="flex min-w-max animate-[ticker_28s_linear_infinite] gap-3 px-3">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={`${item.text}-${i}`}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${item.color}`}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">So einfach geht&apos;s</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <StepCard
            border="border-blue-200"
            number={1}
            emoji="📞"
            title="Kunde ruft an"
            text="Termin wird telefonisch vereinbart – wie immer."
          />
          <StepCard
            border="border-purple-200"
            number={2}
            emoji="📅"
            title="In ReviewPilot eintragen"
            text="Name und Nummer in deinen ReviewPilot Kalender – fertig. Kein extra Tool."
          />
          <StepCard
            border="border-green-200"
            number={3}
            emoji="⭐"
            title="Wir erledigen den Rest"
            text="ReviewPilot schickt Terminbestätigung und danach automatisch die Bewertungsanfrage."
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({ border, number, emoji, title, text }) {
  return (
    <div className={`relative rounded-2xl border ${border} bg-white p-6 shadow-sm`}>
      <span className="absolute -top-3 left-4 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white">
        {number}
      </span>
      <p className="text-5xl">{emoji}</p>
      <h3 className="mt-3 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-zinc-600">{text}</p>
      {number < 3 ? <p className="mt-4 text-xl text-zinc-400">→</p> : null}
    </div>
  );
}

function SmsSection() {
  return (
    <section className="bg-[#f8fafc] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Zwei SMS. Mehr Bewertungen.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <IphoneMockup
            badge="Terminbestätigung"
            badgeStyle="bg-green-100 text-green-700"
            text="Hallo Maria, Ihr Termin am 25. März um 14:00 bei Salon Max ist bestätigt! 😊"
          />
          <IphoneMockup
            badge="Bewertungsanfrage"
            badgeStyle="bg-blue-100 text-blue-700"
            text="Hallo Maria, danke für Ihren Besuch! 🌟 Wir würden uns sehr über eine Google-Bewertung freuen: [Link] Diese Nachricht kommt nur einmal – versprochen! 😊"
          />
        </div>
      </div>
    </section>
  );
}

function IphoneMockup({ badge, badgeStyle, text }) {
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-2xl bg-white p-4 shadow-sm">
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}>{badge}</span>
      <div className="mt-3 rounded-[2rem] border-4 border-black bg-zinc-900 p-2 shadow-lg">
        <div className="rounded-[1.7rem] bg-zinc-100 p-3">
          <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-zinc-300" />
          <div className="rounded-xl bg-white p-3">
            <div className="flex justify-end">
              <p className="max-w-[245px] rounded-2xl rounded-br-md bg-[#0A84FF] px-3 py-2.5 text-sm leading-relaxed text-white">
                {text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewsSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Was Kunden sagen 💬</h2>
        <p className="mt-3 text-center text-zinc-600">
          Echte Bewertungen – automatisch gesammelt mit ReviewPilot
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {reviews.map((r) => (
            <GoogleCard key={r.name} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GoogleCard({ review }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold ${review.color}`}>
            {review.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">{review.name}</p>
            <p className="text-xs text-zinc-500">vor 2 Tagen</p>
          </div>
        </div>
        <GoogleWordmark />
      </div>
      <p className="mt-2 text-sm text-[#FBBC04]">★★★★★</p>
      <p className="mt-2 text-sm text-zinc-700">{review.text}</p>
      <p className="mt-3 text-xs text-zinc-500">{review.business}</p>
    </div>
  );
}

function TestimonialSection() {
  return (
    <section className="bg-[#eff6ff] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-7xl font-black leading-none text-[#2563eb]">&quot;</p>
        <p className="mt-3 text-2xl italic leading-relaxed text-zinc-700 sm:text-3xl">
          Seit ich ReviewPilot nutze bekomme ich jede Woche 15-20 neue Bewertungen –
          ohne einen Finger zu rühren. Das hat mein Business komplett verändert.
        </p>
        <div className="mt-8 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
            alt="Max Gruber"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-200"
          />
          <p className="mt-3 font-bold text-zinc-900">Max Gruber</p>
          <p className="text-sm text-zinc-500">Inhaber Salon Max, Wien</p>
          <p className="mt-2 text-[#FBBC04]">★★★★★</p>
          <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            4.9 ★ auf Google · 127 Bewertungen
          </span>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="bg-[#f8fafc] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Warum ReviewPilot?</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map(([emoji, title, sub, color]) => (
            <div
              key={title}
              className={`rounded-2xl ${color} p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
            >
              <p className="text-4xl">{emoji}</p>
              <p className="mt-3 text-lg font-bold text-zinc-900">{title}</p>
              <p className="mt-1 text-sm text-zinc-600">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] p-8 text-white shadow-xl">
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            🎯 Alles inklusive
          </span>
          <div className="mt-4">
            <span className="text-6xl font-black tracking-tight">€9,90</span>
            <span className="ml-1 text-lg">/Monat</span>
          </div>
          <p className="mt-2 text-blue-100">Jederzeit kündbar – keine versteckten Kosten</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li>✓ Unbegrenzte Termine</li>
            <li>✓ Automatische SMS</li>
            <li>✓ Terminbestätigung</li>
            <li>✓ Bewertungsanfrage</li>
            <li>✓ ReviewPilot Kalender</li>
            <li>✓ DSGVO-konform</li>
            <li>✓ E-Mail Support</li>
          </ul>
          <Link
            href="/registrierung"
            className="mt-7 inline-flex h-11 items-center rounded-2xl bg-white px-6 text-sm font-semibold text-[#2563eb] transition hover:bg-blue-50"
          >
            Jetzt kostenlos testen →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-[#f8fafc] py-6 text-sm text-zinc-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-zinc-900">⭐ ReviewPilot</p>
          <p>© 2026 ReviewPilot</p>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-zinc-900">
            Impressum
          </a>
          <a href="#" className="hover:text-zinc-900">
            Datenschutz
          </a>
          <a href="#" className="hover:text-zinc-900">
            Kontakt
          </a>
        </div>
      </div>
    </footer>
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
