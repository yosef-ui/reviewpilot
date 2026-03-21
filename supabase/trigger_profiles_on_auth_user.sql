-- Supabase: SQL Editor → ausführen (einmalig)
-- Legt automatisch eine Zeile in public.profiles an, sobald ein User in auth.users entsteht.
-- Läuft als SECURITY DEFINER → umgeht RLS (kein Client-Insert nötig).
--
-- Voraussetzung: Die App übergibt bei signUp options.data.vorname / nachname (raw_user_meta_data).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    vorname,
    nachname,
    trial_start,
    trial_end,
    is_paid
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'vorname'), ''), '-'),
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'nachname'), ''), '-'),
    now(),
    now() + interval '14 days',
    false
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Alten Trigger entfernen (falls vorhanden), dann neu anlegen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Erstellt profiles-Zeile für neuen Auth-User; Namen aus raw_user_meta_data (signUp options.data).';

-- Wichtig: Ohne zusätzliche RLS-Policy für die Trigger-Rolle (z. B. postgres) schlägt der INSERT
-- oft fehl → "Database error saving new user". Siehe profiles_trigger_insert_policy.sql
