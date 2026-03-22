import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

export async function POST(request) {
  try {
    if (!supabase) {
      console.error("WhatsApp Webhook: Supabase Service Role nicht konfiguriert.");
      return new Response("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Twilio sendet application/x-www-form-urlencoded
    const raw = await request.text();
    const params = new URLSearchParams(raw);
    const from = params.get("From");
    const body = params.get("Body")?.trim()?.toUpperCase();
    const phone = from?.replace("whatsapp:", "");

    if (!phone) {
      return new Response("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    if (body === "JA") {
      await supabase.from("whatsapp_optin").upsert(
        {
          phone,
          opt_in: true,
          created_at: new Date().toISOString(),
        },
        { onConflict: "phone" }
      );

      return new Response(
        `<Response><Message>✅ Danke! Sie erhalten nach Ihrem Termin eine Bewertungsanfrage.</Message></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    if (body === "NEIN" || body === "STOP") {
      await supabase.from("whatsapp_optin").upsert(
        {
          phone,
          opt_in: false,
          created_at: new Date().toISOString(),
        },
        { onConflict: "phone" }
      );

      return new Response(
        `<Response><Message>👍 Verstanden! Keine weiteren Nachrichten.</Message></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    return new Response("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Webhook Fehler:", error);
    return new Response("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
