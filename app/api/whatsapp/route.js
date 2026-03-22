import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_WHATSAPP_FROM;

const DEFAULT_FIRMENNAME = "Ihr Termin";

export async function POST(request) {
  try {
    const { phone, date, time, type } = await request.json();

    if (!phone) {
      return Response.json({ error: "Telefonnummer fehlt" }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);
    const to = `whatsapp:${phone}`;
    let message;

    if (type === "confirmation") {
      message = await client.messages.create({
        from: FROM,
        to,
        contentSid: process.env.TWILIO_CONTENT_SID,
        contentVariables: JSON.stringify({ "1": date, "2": time }),
      });

      setTimeout(async () => {
        await client.messages.create({
          from: FROM,
          to,
          body:
            `Darf *${DEFAULT_FIRMENNAME}* Ihnen nach dem Termin eine kurze Bewertungsanfrage senden?\n\n` +
            `✅ Antworten Sie mit *JA*\n` +
            `❌ Antworten Sie mit *NEIN*`,
        });
      }, 2000);
    } else if (type === "review") {
      const base = process.env.NEXT_PUBLIC_APP_URL || "";
      const reviewLink = `${base}/bewerten?phone=${encodeURIComponent(phone)}`;
      message = await client.messages.create({
        from: FROM,
        to,
        body:
          `Hallo! 👋 Wie war Ihr Besuch bei *${DEFAULT_FIRMENNAME}*?\n\n` +
          `Wir würden uns über eine kurze Bewertung freuen ⭐\n` +
          `${reviewLink}`,
      });
    } else {
      return Response.json({ error: "Unbekannter Typ" }, { status: 400 });
    }

    return Response.json({ success: true, sid: message?.sid });
  } catch (error) {
    console.error("WhatsApp API Fehler:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
