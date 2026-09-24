-- Emara Academy — run after 006. Moves the donation-total helper out of the
-- public API schema so it can't be called directly as /rest/v1/rpc/...
-- (advisor: anon/authenticated_security_definer_function_executable). The
-- public view keeps exposing only the single monthly total.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.monthly_donation_raised()
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
revoke all on function private.monthly_donation_raised() from public;
grant execute on function private.monthly_donation_raised() to anon, authenticated;

create or replace view public.monthly_donation_total
  with (security_invoker = on) as
  select private.monthly_donation_raised() as raised;
grant select on public.monthly_donation_total to anon, authenticated;

drop function if exists public.monthly_donation_raised();
