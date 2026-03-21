-- Einmalig im Supabase SQL Editor ausführen
-- FKs auf auth.users mit ON DELETE CASCADE (User löschen → abhängige Zeilen mit)

ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey,
ADD CONSTRAINT profiles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.kunden
DROP CONSTRAINT IF EXISTS kunden_user_id_fkey,
ADD CONSTRAINT kunden_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public."Termine"
DROP CONSTRAINT IF EXISTS "Termine_user_id_fkey",
ADD CONSTRAINT "Termine_user_id_fkey"
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
