-- In Supabase: SQL Editor → New query → einfügen → Run
-- Behebt: "new row violates row-level security policy for table profiles"

-- 1) RLS aktivieren (falls noch nicht)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2) Alte Policies mit gleichem Namen entfernen (idempotent)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- 3) Neu anlegen: eigene Zeilen lesen / einfügen / aktualisieren
--    Wichtig: INSERT nur wenn user_id = der aktuell eingeloggte User (auth.uid())

CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
