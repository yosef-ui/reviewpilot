/**
 * Kunden-Hilfsfunktionen (Supabase Tabelle "kunden").
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 * @param {string} query min. 2 Zeichen
 */
export async function searchKundenByName(supabase, userId, query) {
  const q = `${query || ""}`.trim();
  if (q.length < 2 || !userId) return { data: [], error: null };

  const { data, error } = await supabase
    .from("kunden")
    .select("id, kundenname, telefonnummer")
    .eq("user_id", userId)
    .ilike("kundenname", `%${q}%`)
    .order("kundenname", { ascending: true })
    .limit(12);

  return { data: Array.isArray(data) ? data : [], error };
}

/**
 * Legt einen Kunden an, wenn noch kein Eintrag mit gleichem Namen (trim, case-insensitive) und Telefon existiert.
 */
export async function ensureKundeExists(supabase, userId, kundenname, telefonnummer) {
  const name = `${kundenname || ""}`.trim();
  const phone = `${telefonnummer || ""}`.trim();
  if (!userId || !name || !phone) return { error: null };

  const { data: existing, error: findError } = await supabase
    .from("kunden")
    .select("id")
    .eq("user_id", userId)
    .ilike("kundenname", name)
    .eq("telefonnummer", phone)
    .maybeSingle();

  if (findError) return { error: findError };
  if (existing?.id) return { error: null };

  const { error: insertError } = await supabase.from("kunden").insert({
    user_id: userId,
    kundenname: name,
    telefonnummer: phone,
  });

  return { error: insertError };
}
