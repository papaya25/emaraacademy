-- Emara Academy — admin Statistics (owner, 2026-10-09). Run after 013.
--
-- page_views: the site's own visit counter. One row per page shown to a person
-- (bots skipped). No cookies and no IP stored: `visitor` is a one-way hash of
-- IP + browser + the day + a server secret, so the same person counts once per
-- day and can't be identified or followed across days. Only the website's
-- server writes (secret key); only the admin reads.
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  day date not null default current_date,
  path text not null check (char_length(path) <= 300),
  locale text check (char_length(locale) <= 5),
  country text check (char_length(country) <= 2),
  referrer text check (char_length(referrer) <= 200),
  visitor text not null check (char_length(visitor) <= 64),
  created_at timestamptz not null default now()
);
create index if not exists page_views_day on public.page_views (day);
alter table public.page_views enable row level security;
drop policy if exists "Admins read page views" on public.page_views;
create policy "Admins read page views"
  on public.page_views for select to authenticated using (public.is_admin());

-- Donor details from Stripe for the admin ledger (card donations).
alter table public.donations add column if not exists donor_email text;
alter table public.donations add column if not exists donor_country text;
