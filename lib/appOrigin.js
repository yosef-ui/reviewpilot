/**
 * Basis-URL der App (ohne trailing slash) für Stripe success/cancel/return URLs.
 * NEXT_PUBLIC_APP_URL z. B. https://reviewpilots.com
 */
export function getAppOrigin() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    const u = explicit.replace(/\/$/, "");
    return u.startsWith("http") ? u : `https://${u}`;
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }
  return "https://reviewpilot-gray.vercel.app";
}
