import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_WHATSAPP_FROM;

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("firmenname")
      .eq("user_id", user.id)
      .single();

    const firmenname = profile?.firmenname || "Ihr Termin";
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
            `Darf *${firmenname}* Ihnen nach dem Termin eine kurze Bewertungsanfrage senden?\n\n` +
            `✅ Antworten Sie mit *JA*\n` +
            `❌ Antworten Sie mit *NEIN*`,
        });
      }, 2000);
    } else if (type === "review") {
      const reviewLink = `${process.env.NEXT_PUBLIC_APP_URL}/bewerten/${user.id}`;
      message = await client.messages.create({
        from: FROM,
        to,
        body:
          `Hallo! 👋 Wie war Ihr Besuch bei *${firmenname}*?\n\n` +
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
