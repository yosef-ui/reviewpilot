-- =============================================================================
-- Supabase SQL Editor: komplettes Skript (einmal ausführen, Reihenfolge beachten)
-- =============================================================================
-- Zweck: Bei E-Mail-Bestätigung wird der User in auth.users angelegt, oft OHNE
-- Client-Session. Dieser Trigger legt public.profiles serverseitig an – ohne RLS-
-- Kontext (auth.uid() fehlt). Lösung: SECURITY DEFINER + INSERT-Policies für
-- die DB-Rolle(n), die die Funktion ausführen.
-- =============================================================================

-- Optional: Spalte für Onboarding (falls noch nicht aus profiles_onboarding.sql)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_done boolean NOT NULL DEFAULT false;

-- 1) Funktion: läuft mit Rechten des Funktions-Owners (typ. postgres), nicht als
--    „anonym“ / ohne Session. INSERT nur in public, search_path gesetzt.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    vorname,
    nachname,
    trial_start,
    trial_end,
    is_paid,
    onboarding_done
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'vorname'), ''), '-'),
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'nachname'), ''), '-'),
    now(),
    now() + interval '14 days',
    false,
    false
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Explizit postgres als Owner (Supabase: üblich; passt zu Policies unten)
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Legt profiles bei neuem auth.users an. SECURITY DEFINER, ohne Client-Session. Namen aus raw_user_meta_data (signUp options.data).';

-- 2) Trigger: nach INSERT in auth.users (gilt auch für „Confirm email“-Flow)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Falls dein Postgres nur EXECUTE PROCEDURE kennt, obige Zeile ersetzen durch:
-- EXECUTE PROCEDURE public.handle_new_user();

-- =============================================================================
-- 3) RLS: Ohne diese Policies schlägt der INSERT fehl, weil nur „authenticated“
--    mit auth.uid() abgesichert ist – im Trigger ist kein JWT → kein passendes
--    Policy-Match für die ausführende Rolle → „Database error saving new user“.
-- =============================================================================

DROP POLICY IF EXISTS "profiles_insert_postgres_trigger" ON public.profiles;
CREATE POLICY "profiles_insert_postgres_trigger"
ON public.profiles
FOR INSERT
TO postgres
WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_insert_supabase_admin_trigger" ON public.profiles;
CREATE POLICY "profiles_insert_supabase_admin_trigger"
ON public.profiles
FOR INSERT
TO supabase_admin
WITH CHECK (true);

-- =============================================================================
-- Hinweise
-- =============================================================================
-- • Weitere Spalten (firmenname, google_review_link): profiles_onboarding.sql
-- • App: signUp mit options.data = { vorname, nachname } für echte Namen.
-- • E-Mail-Bestätigung: Supabase Dashboard → Authentication → Providers → E-Mail.
