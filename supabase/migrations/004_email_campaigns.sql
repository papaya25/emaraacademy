-- Emara Academy — run in the Supabase SQL Editor, after 003_....sql.
-- A log of newsletter broadcasts sent from the admin panel. Sending itself
-- happens via Resend (not stored here) — this table is just the history/
-- audit trail admin shows under "Newsletter".

create table public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text not null,
  recipient_count int not null default 0,
  sent_at timestamptz not null default now()
);
alter table public.email_campaigns enable row level security;
create policy "Admins manage email campaigns"
  on public.email_campaigns for all to authenticated using (true) with check (true);
