-- Einmalig im Supabase SQL Editor ausführen (nach profiles.sql).
-- Speichert WhatsApp-Opt-in pro Telefonnummer (Twilio Webhook).

create table if not exists public.whatsapp_optin (
  phone text primary key,
  opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.whatsapp_optin enable row level security;

-- Nur Service Role (API Route mit SUPABASE_SERVICE_ROLE_KEY) schreibt hier.
-- Keine Policies für authenticated → Zugriff nur serverseitig mit Service Key.

comment on table public.whatsapp_optin is 'WhatsApp JA/NEIN Opt-in pro Nummer (Twilio Inbound Webhook)';
