-- Emara Academy — run in the Supabase SQL Editor, after 007_private_donation_total_fn.sql.
-- Spanish (_es) and Arabic (_ar) sibling columns for the content edited in the
-- admin panel. All nullable: empty means "not translated yet", and the public
-- site then shows the English column (handled in application code, not SQL).
-- Existing row-level security policies cover new columns automatically.

alter table public.programs
  add column if not exists category_es text,
  add column if not exists title_es text,
  add column if not exists tagline_es text,
  add column if not exists what_it_is_es text,
  add column if not exists problem_es text,
  add column if not exists activities_es jsonb,
  add column if not exists category_ar text,
  add column if not exists title_ar text,
  add column if not exists tagline_ar text,
  add column if not exists what_it_is_ar text,
  add column if not exists problem_ar text,
  add column if not exists activities_ar jsonb;

alter table public.events
  add column if not exists title_es text,
  add column if not exists meta_es text,
  add column if not exists title_ar text,
  add column if not exists meta_ar text;

alter table public.classes
  add column if not exists subject_es text,
  add column if not exists blurb_es text,
  add column if not exists subject_ar text,
  add column if not exists blurb_ar text;
