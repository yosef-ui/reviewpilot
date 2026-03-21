-- Einmalig im Supabase SQL Editor ausführen (nach profiles.sql + RLS-Policies).
--
-- Problem: Der Trigger public.handle_new_user() läuft als SECURITY DEFINER (typisch: Rolle postgres).
-- Die Policies "profiles_insert_own" gelten nur für TO authenticated mit auth.uid() = user_id.
-- Im Trigger-Kontext ist kein JWT → auth.uid() ist NULL → keine passende Policy für postgres
-- → INSERT in public.profiles schlägt fehl → Auth meldet: "Database error saving new user".
--
-- Lösung: Explizit INSERT für die Rolle erlauben, die den Trigger ausführt.

DROP POLICY IF EXISTS "profiles_insert_postgres_trigger" ON public.profiles;
CREATE POLICY "profiles_insert_postgres_trigger"
ON public.profiles
FOR INSERT
TO postgres
WITH CHECK (true);

-- Manche Projekte: Owner der Trigger-Funktion ist supabase_admin statt postgres
DROP POLICY IF EXISTS "profiles_insert_supabase_admin_trigger" ON public.profiles;
CREATE POLICY "profiles_insert_supabase_admin_trigger"
ON public.profiles
FOR INSERT
TO supabase_admin
WITH CHECK (true);
