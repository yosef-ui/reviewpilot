"use client";

import Link from "next/link";
import { BrandLogoLink, BrandLogoFooter } from "../components/BrandLogo";

const tickerItems = [
  { text: "⭐ +18 Bewertungen/Monat", color: "bg-indigo-50 text-indigo-700" },
  { text: "📱 98% SMS-Öffnungsrate", color: "bg-indigo-50 text-indigo-700" },
  { text: "⚡ 5 Min Setup", color: "bg-indigo-50 text-indigo-700" },
  { text: "🔒 DSGVO AT & DE", color: "bg-indigo-50 text-indigo-700" },
  { text: "💶 €9,90/Monat", color: "bg-indigo-50 text-indigo-700" },
  { text: "🏆 Für alle Branchen", color: "bg-indigo-50 text-indigo-700" },
];

const whyCards = [
  ["⭐", "+18 Bewertungen", "Im Schnitt pro Monat", "bg-zinc-50 border border-zinc-200/80"],
  ["📱", "98% geöffnet", "SMS werden fast immer gelesen", "bg-zinc-50 border border-zinc-200/80"],
  ["⚡", "5 Min Setup", "Sofort startklar", "bg-zinc-50 border border-zinc-200/80"],
  ["🔒", "DSGVO-sicher", "Konform für AT & DE", "bg-zinc-50 border border-zinc-200/80"],
  ["📅", "Eigener Kalender", "Kein extra Tool nötig", "bg-zinc-50 border border-zinc-200/80"],
  ["💶", "€9,90/Monat", "Jederzeit kündbar", "bg-zinc-50 border border-zinc-200/80"],
];

const reviews = [
  {
    initials: "MM",
    color: "bg-indigo-100 text-indigo-800",
    name: "Maria M.",
    text: "Super Friseur, sehr zufrieden! Komme immer wieder gerne. ✂️",
    business: "Salon Müller, Wien",
  },
  {
    initials: "SR",
    color: "bg-indigo-100 text-indigo-800",
    name: "Stefan R.",
    text: "Das Essen war fantastisch und der Service einfach top! Sehr empfehlenswert. 🍝",
    business: "Restaurant Bella Italia, Graz",
  },
  {
    initials: "JK",
    color: "bg-indigo-100 text-indigo-800",
    name: "Julia K.",
    text: "Endlich ein Zahnarzt wo man sich wirklich wohlfühlt. Sehr einfühlsam und professionell! 🦷",
    business: "Zahnarztpraxis Dr. Hofer, Salzburg",
  },
  {
    initials: "MT",
    color: "bg-indigo-100 text-indigo-800",
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

/** Mind. ~2× Standard-Header-Logo (vorher ~h-11–14 / ~56px) */
const landingLogoClass =
  "h-28 w-auto max-h-[7rem] object-contain object-left sm:h-32 sm:max-h-[8rem] md:h-36 md:max-h-[9rem] lg:h-40 lg:max-h-[10rem]";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-[8.5rem] max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:min-h-[9.5rem]">
        <BrandLogoLink
          className="max-w-[min(100%,min(560px,90vw))]"
          imgClassName={landingLogoClass}
        />
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-zinc-500 hover:text-zinc-700">
            Anmelden
          </Link>
          <Link
            href="/registrierung"
            className="inline-flex h-10 items-center rounded-xl bg-[#6366f1] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f46e5]"
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
    <section className="bg-[#f8fafc] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mx-auto inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
          ✨ Neu: Jetzt mit automatischer Terminbestätigung
        </p>
        <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-zinc-900">Deine Kunden vergessen </span>
          <span className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] bg-clip-text text-transparent [filter:drop-shadow(0_1px_1px_rgba(99,102,241,0.15))]">
            Bewertungen zu schreiben.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          Reviewpilots erinnert sie automatisch – per SMS, zur richtigen Zeit, mit den richtigen
          Worten.
        </p>
        <div className="relative mx-auto mt-8 max-w-2xl overflow-hidden rounded-3xl border border-zinc-200/90 bg-gradient-to-br from-zinc-50 via-white to-indigo-50/60 px-6 py-7 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-100 sm:px-10 sm:py-8">
          <div
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#6366f1] to-[#4f46e5]"
            aria-hidden
          />
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Dein Potenzial
          </p>
          <p className="mt-3 text-lg font-extrabold leading-snug text-zinc-800 sm:text-xl md:text-2xl">
            <span className="mr-1.5 inline-block" aria-hidden>
              🚀
            </span>
            Was wäre, wenn wir deine Bewertungen von{" "}
            <span className="text-[#6366f1]">0–1</span> auf{" "}
            <span className="text-[#4f46e5]">7+ Bewertungen pro Woche</span> bringen könnten?
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/registrierung"
            className="inline-flex h-12 items-center rounded-2xl bg-[#6366f1] px-6 text-sm font-semibold text-white shadow-md shadow-zinc-300/40 transition hover:bg-[#4f46e5]"
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
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-zinc-600">
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
  const steps = [
    {
      n: 1,
      title: "Registrieren",
      desc: "Kostenloses Konto anlegen – E-Mail, Passwort, fertig. Keine Installation.",
      accent: "from-[#6366f1] to-[#4f46e5]",
    },
    {
      n: 2,
      title: "Kunden eintragen",
      desc: "Name, Telefon und Termin im Kalender erfassen – alles an einem Ort.",
      accent: "from-[#6366f1] to-[#4f46e5]",
    },
    {
      n: 3,
      title: "SMS geht automatisch raus",
      desc: "Terminbestätigung und Bewertungsanfrage per SMS – du musst nichts mehr abarbeiten.",
      accent: "from-[#6366f1] to-[#4f46e5]",
    },
  ];

  return (
    <section className="border-y border-zinc-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Drei Schritte. Mehr Bewertungen.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600">
          Klar strukturiert, ohne Schnickschnack – kein Fremd-Tool, keine Screenshots von anderen
          Apps.
        </p>

        <ol className="mt-14 grid list-none gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <li
              key={step.n}
              className="flex flex-col rounded-2xl border border-zinc-200/80 bg-[#fafafa] p-8 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-black text-white shadow-sm ${step.accent}`}
              >
                {step.n}
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-900">
                Schritt {step.n}: {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
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
            badgeStyle="bg-indigo-50 text-indigo-700"
            text="Hallo Maria, Ihr Termin am 25. März um 14:00 bei Salon Max ist bestätigt! 😊"
          />
          <IphoneMockup
            badge="Bewertungsanfrage"
            badgeStyle="bg-indigo-50 text-indigo-700"
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
              <p className="max-w-[245px] rounded-2xl rounded-br-md bg-[#6366f1] px-3 py-2.5 text-sm leading-relaxed text-white">
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
          Echte Bewertungen – automatisch gesammelt mit Reviewpilots
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
      <p className="mt-2 text-sm text-zinc-500">★★★★★</p>
      <p className="mt-2 text-sm text-zinc-700">{review.text}</p>
      <p className="mt-3 text-xs text-zinc-500">{review.business}</p>
    </div>
  );
}

function TestimonialSection() {
  return (
    <section className="bg-zinc-50 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-7xl font-black leading-none text-[#6366f1]">&quot;</p>
        <p className="mt-3 text-2xl italic leading-relaxed text-zinc-700 sm:text-3xl">
          Seit ich Reviewpilots nutze bekomme ich jede Woche 15-20 neue Bewertungen –
          ohne einen Finger zu rühren. Das hat mein Business komplett verändert.
        </p>
        <div className="mt-8 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
            alt="Max Gruber"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-200"
          />
          <p className="mt-3 font-bold text-zinc-900">Max Gruber</p>
          <p className="text-sm text-zinc-500">Inhaber Salon Max, Wien</p>
          <p className="mt-2 text-zinc-500">★★★★★</p>
          <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
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
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Warum Reviewpilots?</h2>
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
        <div className="rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] p-8 text-white shadow-xl">
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            🎯 Alles inklusive
          </span>
          <div className="mt-4">
            <span className="text-6xl font-black tracking-tight">€9,90</span>
            <span className="ml-1 text-lg">/Monat</span>
          </div>
          <p className="mt-2 text-white/90">Jederzeit kündbar – keine versteckten Kosten</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li>✓ Unbegrenzte Termine</li>
            <li>✓ Automatische SMS</li>
            <li>✓ Terminbestätigung</li>
            <li>✓ Bewertungsanfrage</li>
            <li>✓ Reviewpilots Kalender</li>
            <li>✓ DSGVO-konform</li>
            <li>✓ E-Mail Support</li>
          </ul>
          <Link
            href="/registrierung"
            className="mt-7 inline-flex h-11 items-center rounded-2xl bg-white px-6 text-sm font-semibold text-[#6366f1] transition hover:bg-zinc-100"
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
          <BrandLogoFooter className="mb-2" />
          <p>© 2026 Reviewpilots</p>
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
    <p className="text-xs font-semibold leading-none text-zinc-600">Google</p>
  );
}
