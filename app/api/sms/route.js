import { NextResponse } from "next/server";
import { Vonage } from "@vonage/server-sdk";
import { createClient } from "@supabase/supabase-js";

const GOOGLE_REVIEW_LINK_FALLBACK = "https://www.google.com/maps";

const FALLBACK_SENDER = "ReviewPilot";

/**
 * Vonage „from“ (alphanumeric): oft max. 11 Zeichen, [A–Z0–9] je nach Route.
 */
function senderIdFromFirmenname(firmenname) {
  const fallback = process.env.VONAGE_FROM || FALLBACK_SENDER;
  if (!firmenname || typeof firmenname !== "string") return fallback;
  const s = firmenname
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 11);
  return s.length > 0 ? s : fallback;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { kundenname, telefonnummer, link, text, firmenname } = body || {};

    if (!kundenname || !telefonnummer) {
      return NextResponse.json(
        { error: "kundenname und telefonnummer sind erforderlich." },
        { status: 400 }
      );
    }

    const vonageApiKey = process.env.VONAGE_API_KEY;
    const vonageApiSecret = process.env.VONAGE_API_SECRET;
    if (!vonageApiKey || !vonageApiSecret) {
      return NextResponse.json(
        { error: "Vonage-Konfiguration fehlt. Bitte .env.local prüfen." },
        { status: 500 }
      );
    }

    const vonage = new Vonage({
      apiKey: vonageApiKey,
      apiSecret: vonageApiSecret,
    });

    const googleLink =
      typeof link === "string" && link.trim().length > 0
        ? link.trim()
        : GOOGLE_REVIEW_LINK_FALLBACK;

    const firma =
      typeof firmenname === "string" && firmenname.trim().length > 0
        ? firmenname.trim()
        : "";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const authHeader = req.headers.get("authorization");
    const token =
      authHeader && /^Bearer\s+/i.test(authHeader)
        ? authHeader.replace(/^Bearer\s+/i, "").trim()
        : null;

    let from = process.env.VONAGE_FROM || FALLBACK_SENDER;

    if (token && supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (!userErr && user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("firmenname")
          .eq("user_id", user.id)
          .maybeSingle();
        if (profile?.firmenname?.trim()) {
          from = senderIdFromFirmenname(profile.firmenname);
        }
      }
    }

    const smsText =
      typeof text === "string" && text.trim().length > 0
        ? text
        : `Hallo ${kundenname}, vielen Dank für Ihren Besuch${firma ? ` bei ${firma}` : ""}! Wir würden uns sehr über eine kurze Google-Bewertung freuen: ${googleLink}. Diese Nachricht kommt nur einmal – versprochen! 😊`;

    const response = await vonage.sms.send({
      to: telefonnummer,
      from,
      text: smsText,
    });

    return NextResponse.json({ ok: true, response });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Unbekannter Fehler beim SMS-Versand." },
      { status: 500 }
    );
  }
}
