-- Emara Academy — "Un Corán para ti" requests (the site's own form, replacing
-- the Google Form; owner, 2026-10-08). Run after 012. Visitors can only send a
-- request (always arriving as "pending"); only the admin reads and updates.

create table if not exists public.coran_requests (
  id uuid primary key default gen_random_uuid(),
  -- the Google Form's fields
  name text not null check (char_length(name) between 1 and 200),
  age int not null check (age between 5 and 120),
  phone text not null check (char_length(phone) between 7 and 40),
  email text not null check (char_length(email) between 3 and 320),
  street text not null check (char_length(street) between 1 and 200),
  ext_int_number text not null check (char_length(ext_int_number) between 1 and 60),
  colonia text not null check (char_length(colonia) between 1 and 120),
  postal_code text not null check (postal_code ~ '^[0-9]{5}$'),
  city text not null check (char_length(city) between 1 and 120),
  state text not null check (char_length(state) between 1 and 60),
  address_refs text not null check (char_length(address_refs) between 1 and 500),
  first_quran boolean,
  reason text check (reason is null or char_length(reason) <= 2000),
  comments text check (comments is null or char_length(comments) <= 2000),
  -- added for shipping and statistics
  quantity int not null default 1 check (quantity between 1 and 10),
  relation text check (relation in ('curious', 'new_muslim', 'muslim', 'gift', 'other')),
  heard_from text check (heard_from in ('instagram', 'facebook', 'tiktok', 'whatsapp', 'friend', 'mosque', 'other')),
  locale text,
  -- the admin's shipping workflow
  status text not null default 'pending' check (status in ('pending', 'sent', 'delivered', 'cancelled')),
  tracking text check (tracking is null or char_length(tracking) <= 500),
  status_changed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists coran_requests_created on public.coran_requests (created_at desc);

alter table public.coran_requests enable row level security;
drop policy if exists "Anyone can request a Coran" on public.coran_requests;
create policy "Anyone can request a Coran"
  on public.coran_requests for insert to anon, authenticated
  with check (status = 'pending' and tracking is null and status_changed_at is null);
drop policy if exists "Admins manage Coran requests" on public.coran_requests;
create policy "Admins manage Coran requests"
  on public.coran_requests for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
