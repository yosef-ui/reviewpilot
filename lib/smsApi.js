/**
 * POST /api/sms mit Supabase-Session (Authorization: Bearer),
 * damit die Route profiles.firmenname für den Absender lesen kann.
 */
export async function postSmsApi(supabase, body) {
  const headers = { "Content-Type": "application/json" };
  if (supabase) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return fetch("/api/sms", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}
