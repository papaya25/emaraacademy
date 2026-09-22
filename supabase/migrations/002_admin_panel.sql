-- Emara Academy — admin panel migration (run in the Supabase dashboard SQL Editor,
-- after schema.sql). Safe to run once.
--
-- Adds: editable program/chapter content, a private donations ledger with a public
-- monthly-total view, structured event fields (location/time/presenter), and a
-- contact_info site_setting. Admin write access continues to mean "any authenticated
-- Supabase user" — there is exactly one shared admin account, created directly in
-- the Supabase dashboard (Authentication → Users), not a self-serve sign-up.

-- newsletter_subscribers already exists (created outside version control) with
-- anon insert-only access. Admins also need to read it, for the Newsletter tab.
alter table public.newsletter_subscribers enable row level security;
do $$ begin
  create policy "Admins read newsletter subscribers"
    on public.newsletter_subscribers for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

-- Programs: the six program/chapter pages, editable without a code change.
create table public.programs (
  slug text primary key,
  sort_order int not null default 0,
  num text not null,          -- Arabic-Indic chapter numeral, e.g. '١'
  chapter text not null,      -- Arabic chapter heading, e.g. 'الفصل الأول'
  category text not null,     -- short label for the bookshelf spine
  title text not null,
  tagline text not null,
  what_it_is text not null,
  activities jsonb not null default '[]', -- [{ "title": "...", "desc": "..." }]
  problem text not null,
  updated_at timestamptz not null default now()
);
alter table public.programs enable row level security;
create policy "Anyone can read programs"
  on public.programs for select to anon, authenticated using (true);
create policy "Admins manage programs"
  on public.programs for all to authenticated using (true) with check (true);

-- Donations: a private ledger. No policy is granted to `anon` at all, so the
-- public site can never read or write it directly — only the monthly-total
-- view below is exposed publicly, and only as an aggregate.
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  occurred_on date not null default current_date,
  amount numeric(10, 2) not null check (amount > 0),
  donor_name text, -- null = anonymous
  method text not null default 'other'
    check (method in ('card', 'paypal', 'bank', 'other')),
  frequency text not null default 'once'
    check (frequency in ('once', 'monthly')),
  note text,
  created_at timestamptz not null default now()
);
alter table public.donations enable row level security;
create policy "Admins manage donations"
  on public.donations for all to authenticated using (true) with check (true);

-- Public, privacy-safe monthly total (amount + date only, no donor names) for the
-- homepage "raised this month" figure. Views run with their owner's privileges in
-- Postgres, so this can read the private `donations` table while only ever
-- exposing a single aggregate number to anon/authenticated callers.
create view public.monthly_donation_total as
  select coalesce(sum(amount), 0)::numeric as raised
  from public.donations
  where date_trunc('month', occurred_on) = date_trunc('month', current_date);
grant select on public.monthly_donation_total to anon, authenticated;

-- Events: add the structured fields the admin calendar needs beyond the free-text
-- `meta` blurb — exact location, a display time, and who's presenting.
alter table public.events
  add column location text,
  add column time text,
  add column presenter text;

-- Contact info, editable in Settings — same key/value pattern as impact_stats
-- and donation_month above. Skipped if already present.
insert into public.site_settings (key, value)
values ('contact_info', '{"email": "info@emaraacademy.org", "phone": "+52 55 2670 9079"}')
on conflict (key) do nothing;
-- Seed data: today's program/chapter text, so admin starts from what's live.
insert into public.programs (slug, sort_order, num, chapter, category, title, tagline, what_it_is, activities, problem) values (
  'new-muslim-education', 0, '١', 'الفصل الأول', 'Education', 'New Muslim Education',
  'Structured, ongoing classes — not a one-time orientation — that take a convert from their first day to confident, independent practice.', 'A tiered curriculum — Foundations, then Practice, then Deepening — taught in Spanish and Portuguese, delivered weekly at partner mosques, and always paired with a shared meal, so class is a social occasion, not a lecture.', '[{"title":"Foundations track","desc":"Purification, prayer, basic beliefs, Qur''an reading from zero, and halal/haram basics for daily life in Latin America."},{"title":"Practice track","desc":"The fiqh of fasting and Ramadan, zakat, family and marriage in Islam, and navigating non-Muslim family relationships."},{"title":"Deepening track","desc":"Seerah, tafsir circles, Arabic literacy, and pathways into memorization for those who want to go further."},{"title":"Take-home materials","desc":"Printed and digital materials in Spanish and Portuguese — because most existing Islamic literature is in Arabic or English."},{"title":"Food at every session","desc":"A small, deliberate signal that this is a place you are fed and welcomed, not just instructed."}]'::jsonb, 'Converts often disengage simply because there is nowhere consistent to keep learning after the initial rush of conversion fades. A weekly, no-cost, food-included class turns “I should learn more sometime” into a standing appointment they belong to.'
) on conflict (slug) do nothing;
insert into public.programs (slug, sort_order, num, chapter, category, title, tagline, what_it_is, activities, problem) values (
  'imam-teacher-formation', 1, '٢', 'الفصل الثاني', 'Formation', 'Imam & Teacher Formation',
  'Training local imams and lay teachers specifically in how to teach and pastorally support converts — a different skill from leading born-Muslim congregations.', 'A certification track covering convert psychology, trauma-informed pastoral care, simplified teaching methodology, and culturally adapted Spanish/Portuguese da''wah materials — so every partner mosque has at least one person equipped to run these programs well.', '[{"title":"Convert-experience workshops","desc":"The specific challenges converts face: family rejection, identity loss, isolation, doubt, and burnout."},{"title":"Teaching methodology","desc":"How to teach fiqh and Qur''an to adult beginners with no religious-Arabic background."},{"title":"Shared curriculum library","desc":"A translated teaching-materials library, so no imam has to build lessons from scratch."},{"title":"Annual teachers'' gathering","desc":"Trained imams and teachers from partner cities exchange experience and refine the program together."}]'::jsonb, 'A well-meaning imam without convert-specific training can unintentionally make a new Muslim feel judged, rushed, or out of place. Training the teachers is what makes every other program reproducible city to city, instead of dependent on one gifted individual.'
) on conflict (slug) do nothing;
insert into public.programs (slug, sort_order, num, chapter, category, title, tagline, what_it_is, activities, problem) values (
  'community-events', 2, '٣', 'الفصل الثالث', 'Community', 'Community Events',
  'Regular, genuinely fun gatherings whose real purpose is belonging: food, games, and the chance to tell your story and hear others''.', 'Monthly community nights and seasonal larger gatherings — Ramadan iftars, Eid celebrations, welcome parties for recent converts — hosted at or near partner mosques, built around food, games, and storytelling.', '[{"title":"Convert story nights","desc":"Monthly evenings where members share their journey — giving new converts language for their own experience."},{"title":"Eid & Ramadan celebrations","desc":"Designed for people with no Muslim family to celebrate with."},{"title":"Games & icebreakers","desc":"Structured social activities aimed at building friendships, not just acquaintances."},{"title":"First-90-days welcome nights","desc":"Dedicated welcomes for the newest converts, paired with a mentor introduction."}]'::jsonb, 'Many converts describe conversion as gaining a religion and losing a social world overnight. Events replace the social world that was lost — the single biggest predictor of whether someone stays engaged long-term.'
) on conflict (slug) do nothing;
insert into public.programs (slug, sort_order, num, chapter, category, title, tagline, what_it_is, activities, problem) values (
  'mutual-aid-fund', 3, '٤', 'الفصل الرابع', 'Support', 'Mutual Aid & Emergency Fund',
  'A dignified, needs-based safety net so that material hardship never becomes the reason someone drifts away.', 'A confidential support fund, administered through partner mosques, providing direct, time-limited help — food, clothing, emergency cash, and connections to livelihood opportunities — for new Muslims in genuine need, many of whom lost family financial support because of their conversion.', '[{"title":"Confidential intake","desc":"Requests for help never become mosque gossip."},{"title":"Emergency essentials","desc":"Food packages, clothing — including modest-clothing starter kits — and short-term cash assistance."},{"title":"Livelihood track","desc":"Micro-grants and interest-free loans (qard hasan) to help converts who lost income get back on their feet."},{"title":"Professional referral network","desc":"Lawyers, doctors, and therapists willing to offer discounted or free help to new Muslims."}]'::jsonb, 'Converts — especially women who begin wearing hijab — can face real economic and family consequences for converting. Without a safety net, financial hardship becomes the practical, non-ideological reason people quietly stop practicing.'
) on conflict (slug) do nothing;
insert into public.programs (slug, sort_order, num, chapter, category, title, tagline, what_it_is, activities, problem) values (
  'outdoor-retreats', 4, '٥', 'الفصل الخامس', 'Retreat', 'Outdoor Retreats',
  'Weekend retreats combining nature, sport, and Islamic learning — built for people who find classroom-only formats hard to stay engaged with.', 'Quarterly weekend retreats — camping trips, beach and jungle excursions fitting our home on the Riviera Maya, and day tours — blending outdoor activity with short, high-impact teaching sessions and free time to bond.', '[{"title":"Weekend campouts","desc":"Teaching circles around the fire, paired with hiking, kayaking, and beach activities."},{"title":"Inter-mosque sports","desc":"Football and volleyball tournaments — a low-barrier way to meet Muslims from other communities."},{"title":"Local day trips","desc":"Exploring this new life together, not just sitting and learning together."}]'::jsonb, 'Retreats reach converts who won''t come to another lecture but will come to a camping trip — and once there, they absorb more community and knowledge than a classroom delivers, while forming the friendships that keep people anchored.'
) on conflict (slug) do nothing;
insert into public.programs (slug, sort_order, num, chapter, category, title, tagline, what_it_is, activities, problem) values (
  'inter-community-exchange', 5, '٦', 'الفصل السادس', 'Exchange', 'Inter-Community Exchange',
  'Structured trips connecting new-Muslim communities across Latin America, so no city''s program has to reinvent itself in isolation.', 'An exchange program sending small delegations of converts, teachers, and organizers to visit partner communities in other Latin American countries — sharing program models, building cross-border friendships, and letting converts see the size of the ummah they''ve joined.', '[{"title":"Annual regional conference","desc":"A rotating host city brings together chapters and partner organizations from across the region."},{"title":"Delegation exchanges","desc":"Mexico converts visiting communities in Colombia, Brazil, or Argentina — and vice versa."},{"title":"Shared regional directory","desc":"A digital directory of new-Muslim organizations across Latin America, coordinating resources and avoiding duplicated effort."}]'::jsonb, 'Isolation is not only individual — entire national convert communities can feel small and disconnected. Showing a new Muslim that there are thousands like them across the continent reframes conversion from a lonely event into membership in a real, large, connected community.'
) on conflict (slug) do nothing;
