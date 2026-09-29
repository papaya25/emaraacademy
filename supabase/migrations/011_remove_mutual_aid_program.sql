-- Emara Academy — owner's call (2026-09-28): the Mutual Aid & Emergency Fund
-- program is removed everywhere. Deletes it and renumbers the two programs
-- after it (as the admin panel's delete does), so chapters stay 1–5.
-- Apply only when publishing — the live site reads this table directly.

delete from public.programs where slug = 'mutual-aid-fund';

update public.programs set sort_order = 3, num = '٤', chapter = 'الفصل الرابع'
  where slug = 'outdoor-retreats';
update public.programs set sort_order = 4, num = '٥', chapter = 'الفصل الخامس'
  where slug = 'inter-community-exchange';
