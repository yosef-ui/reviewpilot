import Link from "next/link";

const LOGO_SRC = "/reviewpilots-logo.png";
const LOGO_ALT =
  "Reviewpilots – Automatische Bewertungsanfragen per SMS";

/** Größere Darstellung für Header & Co. */
const logoLg =
  "h-11 w-auto max-h-[56px] object-contain object-left sm:h-12 sm:max-h-[64px] md:h-14 md:max-h-[72px]";

/** Etwas größer für z. B. Settings-Inhalt */
const logoXl =
  "h-12 w-auto object-contain object-left sm:h-14 md:h-16 md:max-h-[88px]";

/** Kompakt für Footer */
const logoSm = "h-8 w-auto max-h-9 object-contain object-left sm:h-9";

/**
 * Header: volles Markenlogo (PNG).
 */
export function BrandLogoLink({ className = "", imgClassName }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-w-0 shrink items-center ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        className={imgClassName ?? logoLg}
      />
    </Link>
  );
}

/**
 * Inline auf Seiten (z. B. Settings) – noch etwas größer.
 */
export function BrandMark({ className = "" }) {
  return (
    <div className={`inline-flex min-w-0 items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SRC} alt={LOGO_ALT} className={logoXl} />
    </div>
  );
}

/** Footer / kleine Bereiche */
export function BrandLogoFooter({ className = "" }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SRC} alt={LOGO_ALT} className={logoSm} />
    </div>
  );
}
