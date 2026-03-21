-- Tabelle "kunden" – in Supabase SQL Editor ausführen
-- Hinweis: user_id verknüpft Kunden mit dem eingeloggten Account (RLS).

create table if not exists public.kunden (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kundenname text not null,
  telefonnummer text not null,
  created_at timestamptz not null default now()
);

create index if not exists kunden_user_id_idx on public.kunden (user_id);
create index if not exists kunden_kundenname_idx on public.kunden (user_id, kundenname);

alter table public.kunden enable row level security;

-- Jeder eingeloggte Nutzer: SELECT + INSERT (nur eigene Zeilen über user_id)
drop policy if exists "kunden_select_own" on public.kunden;
drop policy if exists "kunden_insert_own" on public.kunden;

create policy "kunden_select_own"
on public.kunden
for select
to authenticated
using (auth.uid() = user_id);

create policy "kunden_insert_own"
on public.kunden
for insert
to authenticated
with check (auth.uid() = user_id);
