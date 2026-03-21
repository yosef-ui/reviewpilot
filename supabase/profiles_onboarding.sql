-- Einmalig im Supabase SQL Editor ausführen
-- Firmenname & Google-Bewertungslink für SMS und Onboarding

alter table public.profiles
  add column if not exists firmenname text,
  add column if not exists google_review_link text;

comment on column public.profiles.firmenname is 'Anzeigename des Betriebs (SMS)';
comment on column public.profiles.google_review_link is 'Link zur Google-Bewertungsseite (SMS)';
