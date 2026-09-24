-- Emara Academy — fixes flagged by the Supabase security advisor. Run after 005.
--
-- 1. monthly_donation_total was a SECURITY DEFINER view (the advisor's
--    "security_definer_view" error). It now runs as the caller, and the one
--    privileged step — summing this month's private donations — lives in a
--    narrow function that returns only that number. Same public output.
-- 2. is_admin() gets a fixed search_path ("function_search_path_mutable").

create or replace function public.monthly_donation_raised()
returns numeric
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(amount), 0)::numeric
  from public.donations
  where date_trunc('month', occurred_on) = date_trunc('month', current_date);
$$;
revoke all on function public.monthly_donation_raised() from public;
grant execute on function public.monthly_donation_raised() to anon, authenticated;

create or replace view public.monthly_donation_total
  with (security_invoker = on) as
  select public.monthly_donation_raised() as raised;
grant select on public.monthly_donation_total to anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'admin@emaraacademy.org';
$$;
