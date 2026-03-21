-- Einmalig im Supabase SQL Editor ausführen
-- Firmenname & Google-Bewertungslink für SMS und Onboarding

alter table public.profiles
  add column if not exists firmenname text,
  add column if not exists google_review_link text;

alter table public.profiles
  add column if not exists onboarding_done boolean not null default false;

comment on column public.profiles.firmenname is 'Anzeigename des Betriebs (SMS)';
comment on column public.profiles.google_review_link is 'Link zur Google-Bewertungsseite (SMS)';
comment on column public.profiles.onboarding_done is 'true nach abgeschlossenem Onboarding (Formular einmalig)';

alter table public.profiles
  add column if not exists custom_sms_nachricht text;

comment on column public.profiles.custom_sms_nachricht is 'Optional: eigener SMS-Text; Standard-Template wenn leer';

-- Bestehende Nutzer mit ausgefülltem Profil als abgeschlossen markieren
update public.profiles
set onboarding_done = true
where coalesce(trim(firmenname), '') <> ''
  and coalesce(trim(google_review_link), '') <> '';
