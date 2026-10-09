-- Emara Academy — totals for admin → Statistics, counted in the database so the
-- page stays fast however many visits there are. security_invoker = on: the
-- views obey the tables' row-level security, so only the admin sees anything.
-- Run after 014.

create or replace view public.admin_visits_daily with (security_invoker = on) as
  select day, count(*)::int as views, count(distinct visitor)::int as visitors
  from public.page_views group by day;

create or replace view public.admin_visits_countries_30d with (security_invoker = on) as
  select coalesce(country, '') as country, count(distinct visitor)::int as visitors, count(*)::int as views
  from public.page_views where day > current_date - 30 group by 1;

create or replace view public.admin_visits_pages_30d with (security_invoker = on) as
  select path, count(distinct visitor)::int as visitors, count(*)::int as views
  from public.page_views where day > current_date - 30 group by 1;

create or replace view public.admin_visits_referrers_30d with (security_invoker = on) as
  select referrer, count(distinct visitor)::int as visitors
  from public.page_views where day > current_date - 30 and referrer is not null group by 1;

-- A donor = the same email (card donations), else the same name; anonymous
-- hand-logged donations each count as one donor.
create or replace view public.admin_donations_monthly with (security_invoker = on) as
  select to_char(occurred_on, 'YYYY-MM') as month,
    sum(amount)::numeric(12, 2) as total, count(*)::int as donations,
    count(distinct coalesce(lower(donor_email), lower(donor_name), id::text))::int as donors
  from public.donations group by 1;

create or replace view public.admin_donations_yearly with (security_invoker = on) as
  select extract(year from occurred_on)::int as year,
    sum(amount)::numeric(12, 2) as total, count(*)::int as donations,
    count(distinct coalesce(lower(donor_email), lower(donor_name), id::text))::int as donors
  from public.donations group by 1;

revoke all on public.admin_visits_daily, public.admin_visits_countries_30d,
  public.admin_visits_pages_30d, public.admin_visits_referrers_30d,
  public.admin_donations_monthly, public.admin_donations_yearly from anon;
