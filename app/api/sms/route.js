import { NextResponse } from "next/server";
import { Vonage } from "@vonage/server-sdk";

const GOOGLE_REVIEW_LINK_FALLBACK = "https://www.google.com/maps";

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

    const from = process.env.VONAGE_FROM || "ReviewPilot";
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

