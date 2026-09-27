-- Emara Academy — class enrollment. Run after 008_translated_content.sql.
--
-- Visitors sign up for a class (name, email, WhatsApp). Each class can have a
-- number of places; once they're taken, new sign-ups go on a waitlist. The
-- database decides "confirmed" vs "waitlist" itself (trigger below), so a
-- visitor can't pick their own status and two people can't both take the
-- last place. Visitors can only insert; only the admin can read the list.

alter table public.classes
  add column if not exists capacity int check (capacity is null or capacity > 0);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  whatsapp text not null check (char_length(whatsapp) between 5 and 40),
  status text not null default 'confirmed' check (status in ('confirmed', 'waitlist')),
  locale text,
  created_at timestamptz not null default now()
);
create unique index if not exists enrollments_one_per_email
  on public.enrollments (class_id, lower(email));
create index if not exists enrollments_class on public.enrollments (class_id);

alter table public.enrollments enable row level security;
drop policy if exists "Anyone can enroll" on public.enrollments;
create policy "Anyone can enroll"
  on public.enrollments for insert to anon, authenticated with check (true);
drop policy if exists "Admins manage enrollments" on public.enrollments;
create policy "Admins manage enrollments"
  on public.enrollments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Status is always decided here, whatever the visitor sent.
create schema if not exists private;
create or replace function private.set_enrollment_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  cap int;
  cls_status text;
  taken int;
begin
  -- Locking the class row makes simultaneous sign-ups for it wait their turn.
  select capacity, status into cap, cls_status
    from public.classes where id = new.class_id for update;
  select count(*) into taken
    from public.enrollments
    where class_id = new.class_id and status = 'confirmed';
  -- Waitlist when the places are taken, or when the admin marked the class Full.
  new.status := case
    when cls_status = 'Full' or (cap is not null and taken >= cap) then 'waitlist'
    else 'confirmed'
  end;
  return new;
end;
$$;
revoke all on function private.set_enrollment_status() from public;

drop trigger if exists enrollments_set_status on public.enrollments;
create trigger enrollments_set_status
  before insert on public.enrollments
  for each row execute function private.set_enrollment_status();

-- Public "places left": only counts, never who signed up (same pattern as 007).
create or replace function private.class_availability()
returns table (class_id uuid, capacity int, taken int)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id, c.capacity,
    (select count(*)::int from public.enrollments e
      where e.class_id = c.id and e.status = 'confirmed')
  from public.classes c;
$$;
revoke all on function private.class_availability() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.class_availability() to anon, authenticated;

create or replace view public.class_availability
  with (security_invoker = on) as
  select * from private.class_availability();
grant select on public.class_availability to anon, authenticated;
