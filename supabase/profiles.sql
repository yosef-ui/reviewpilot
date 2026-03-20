create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  vorname text not null,
  nachname text not null,
  trial_start timestamptz not null default now(),
  trial_end timestamptz not null,
  is_paid boolean not null default false
);

alter table public.profiles enable row level security;

create policy if not exists "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy if not exists "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy if not exists "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

