import Link from "next/link";

const LOGO_SRC = "/reviewpilots-logo.png";
const LOGO_ALT =
  "Reviewpilots – Automatische Bewertungsanfragen per SMS";

/**
 * Header: volles Markenlogo (Papierflieger, Schriftzug, Tagline) als PNG.
 */
export function BrandLogoLink({ className = "" }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        className="h-8 w-auto max-h-10 object-contain object-left sm:h-9"
      />
    </Link>
  );
}

/**
 * Inline auf Seiten (z. B. Settings) – gleiches Logo, etwas größer.
 */
export function BrandMark({ className = "" }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        className="h-10 w-auto object-contain object-left sm:h-12"
      />
    </div>
  );
}
