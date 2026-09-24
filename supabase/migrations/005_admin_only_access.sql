-- Emara Academy — restrict admin access to the one admin account.
-- Run in the Supabase SQL Editor after 002–004. Safe to run more than once.
--
-- Until now every admin policy said "to authenticated using (true)": ANY
-- signed-in Supabase user could read donations and contact messages and edit
-- the site. Supabase allows public sign-ups by default and the publishable
-- key ships in the site's JavaScript, so a stranger could create an account
-- and get in. From here on, only admin@emaraacademy.org counts as an admin.
-- (Also turn off sign-ups: Authentication → Sign In / Providers →
-- "Allow new users to sign up".)

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'admin@emaraacademy.org';
$$;

-- contact_messages
drop policy if exists "Admins read messages" on public.contact_messages;
create policy "Admins read messages"
  on public.contact_messages for select to authenticated using (public.is_admin());
drop policy if exists "Admins delete messages" on public.contact_messages;
create policy "Admins delete messages"
  on public.contact_messages for delete to authenticated using (public.is_admin());

-- events
drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events"
  on public.events for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- classes
drop policy if exists "Admins manage classes" on public.classes;
create policy "Admins manage classes"
  on public.classes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- site_settings
drop policy if exists "Admins manage settings" on public.site_settings;
create policy "Admins manage settings"
  on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- newsletter_subscribers
drop policy if exists "Admins read newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins read newsletter subscribers"
  on public.newsletter_subscribers for select to authenticated using (public.is_admin());

-- programs
drop policy if exists "Admins manage programs" on public.programs;
create policy "Admins manage programs"
  on public.programs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- donations
drop policy if exists "Admins manage donations" on public.donations;
create policy "Admins manage donations"
  on public.donations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- email_campaigns
drop policy if exists "Admins manage email campaigns" on public.email_campaigns;
create policy "Admins manage email campaigns"
  on public.email_campaigns for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
