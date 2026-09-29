-- Emara Academy — "Be part of Emara" registrations. Run after 009_class_enrollments.sql.
--
-- On the contact page, people can register as a teacher, translator, event
-- photographer or volunteer (students register for a class through
-- `enrollments`, migration 009). Visitors can only insert; only the admin reads.

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('teacher', 'translator', 'photographer', 'volunteer')),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  whatsapp text not null check (char_length(whatsapp) between 5 and 40),
  message text check (message is null or char_length(message) <= 4000),
  locale text,
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;
drop policy if exists "Anyone can register" on public.registrations;
create policy "Anyone can register"
  on public.registrations for insert to anon, authenticated with check (true);
drop policy if exists "Admins manage registrations" on public.registrations;
create policy "Admins manage registrations"
  on public.registrations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
