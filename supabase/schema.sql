-- Emara Academy — Supabase schema (run in the Supabase dashboard SQL Editor).
-- Safe to run once. The newsletter_subscribers table already exists from earlier.
--
-- Security model: the website uses the public (anon) key, which can only
--   - INSERT into contact_messages (never read them)
--   - SELECT events, classes, and site_settings (never change them)
-- Admin read/write happens as an authenticated Supabase user (admin panel, next phase).

-- Contact messages: public can send, only signed-in admins can read
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  reason text,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "Anyone can send a message"
  on public.contact_messages for insert to anon with check (true);
create policy "Admins read messages"
  on public.contact_messages for select to authenticated using (true);
create policy "Admins delete messages"
  on public.contact_messages for delete to authenticated using (true);

-- Events: public reads, admins manage. One row per dated occurrence.
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meta text,
  city text, -- null = shown for every city (e.g. Eid dates)
  type text not null default 'monthly'
    check (type in ('weekly', 'monthly', 'quarterly', 'special')),
  event_date date not null,
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "Anyone can read events"
  on public.events for select to anon, authenticated using (true);
create policy "Admins manage events"
  on public.events for all to authenticated using (true) with check (true);

-- Classes: public reads, admins manage
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  blurb text,
  track text not null default 'Foundations',
  language text not null default 'Español',
  city text not null,
  day text,
  time text,
  format text not null default 'In person',
  status text not null default 'Open'
    check (status in ('Open', 'Starting soon', 'Full')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.classes enable row level security;
create policy "Anyone can read classes"
  on public.classes for select to anon, authenticated using (true);
create policy "Admins manage classes"
  on public.classes for all to authenticated using (true) with check (true);

-- Site settings: impact numbers + monthly donation goal, editable without code changes
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy "Anyone can read settings"
  on public.site_settings for select to anon, authenticated using (true);
create policy "Admins manage settings"
  on public.site_settings for all to authenticated using (true) with check (true);

insert into public.site_settings (key, value) values
  ('impact_stats', '{"new_muslims": 35, "students": 90, "supported": 50}'),
  ('donation_month', '{"raised": 1850, "goal": 5000}');
