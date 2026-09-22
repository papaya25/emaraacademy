-- Emara Academy — run in the Supabase SQL Editor, after 002_admin_panel.sql.
-- Adds: an exact location/venue field for classes (previously only had city).
-- No changes needed for program add/remove — that reuses the existing
-- `programs` table and RLS from 002_admin_panel.sql.

alter table public.classes add column location text;
