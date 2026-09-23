# Arabic language support — design spec

**Date:** 2026-09-22
**Status:** Approved by owner ("ok, do it", "keep going") — proceeding to implementation.
**Branch:** `arabic-i18n` (not merged to `main` / not deployed until the owner says so).

## Goal

The whole public site becomes available in real, accurate, meaning-first Arabic —
not machine-translated, not English text sitting in a mirrored layout. A visitor
reading Arabic gets a page that reads right-to-left in every respect: text,
navigation, spacing, the calendar grid, everything. English stays the default at
the root URL; Arabic lives under `/ar/...`.

Scope, per the owner's explicit choice: **everything**, including the
admin-editable content (programs, events, classes) — not just the static pages.
Spanish is out of scope for this pass (mentioned as a "later" language in project
history), but the mechanism should not make adding it harder later.

## Non-goals

- Translating the admin panel's own UI (labels, buttons, nav) — it's an internal
  tool for the owner, who works in English. Only the *content fields* being
  edited (a program's title, an event's name, etc.) get an Arabic option.
- Portuguese or Spanish translation content — infrastructure should not preclude
  it, but no Spanish/Portuguese strings are written in this pass.
- Translating Supabase `site_settings` values (impact stat numbers, the donation
  goal) — these are numbers, not language-dependent text. `contact_info`
  (email/phone) also isn't language-dependent.
- Real-time machine translation / auto-translate fallback for untranslated admin
  content — untranslated Arabic fields fall back to showing the English text
  (see "Bilingual admin content" below), not a machine translation of it.

## Approach

### 1. Routing & locale mechanism: next-intl

Adopt [`next-intl`](https://next-intl.dev), the standard i18n library for the
Next.js App Router. Reasoning: locale-prefixed routing, per-locale static
generation, and RTL-aware message handling are all things next-intl already
solves correctly; hand-rolling this for a 15-route site risks subtle
routing/SEO bugs (wrong canonical URLs, broken static generation, locale
detection edge cases) for no real benefit over a well-maintained library.

- `app/[locale]/...` replaces the current `app/(site)/...` route group. Existing
  page files move under it with minimal changes (they become locale-aware via
  `useTranslations()`/`getTranslations()` instead of hardcoded English strings).
- `en` has no URL prefix (`/`, `/programs`); `ar` is prefixed (`/ar`,
  `/ar/programs`) — next-intl's "as-needed" `localePrefix` strategy.
- `app/admin/...` and `app/api` (none currently, but future-proofing) stay
  **outside** the `[locale]` segment, untouched by this change, matching the
  non-goal above.
- Root `app/layout.tsx` stays the true root (fonts, `<html>` shell); a new
  `app/[locale]/layout.tsx` sets `<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>`
  and renders the existing `(site)`-style chrome (`TopBar`, `Footer`).
- `middleware.ts`/`proxy.ts` gains next-intl's locale-detection middleware,
  composed with (not replacing) the existing admin-auth proxy logic — they
  guard different path prefixes (`/admin` vs. everything else) so this is a
  straightforward composition, not a conflict.

### 2. Message content: next-intl JSON catalogs

`messages/en.json` and `messages/ar.json`, namespaced by page/section (e.g.
`home.hero.title`, `faq.questions.0.question`). All static-page copy —
including the three legal policy pages and the FAQ — lives here. This is a lot
of content; translation is written by hand (by me, in this work), not
generated, and reviewed for register (formal, warm, matching the manuscript
aesthetic — same voice as the existing Arabic already on the site: the hadith,
chapter headings, "عِمَارَة").

### 3. RTL layout: CSS logical properties

Convert directional CSS in `app/globals.css` (currently ~2800 lines) from
physical properties to logical ones: `margin-left`/`margin-right` →
`margin-inline-start`/`margin-inline-end`, `text-align: left` → `text-align:
start`, `border-left` → `border-inline-start`, positioned `left`/`right` →
`inset-inline-start`/`inset-inline-end`, and `flex-direction: row` audited
case-by-case (logical properties don't auto-flip flex order — rows that must
visually reverse in RTL need `flex-direction: row-reverse` under a `[dir="rtl"]`
scope, e.g. the events calendar's day-of-week header).

This is the single largest mechanical piece of this project — a full audit of
the stylesheet — chosen over maintaining a parallel `[dir="rtl"]` override
sheet because logical properties flip automatically with zero duplicated rules
and are correct for any future RTL language too (not just Arabic).

Specific known trouble spots to verify by hand once converted (not exhaustive —
found by browsing the built RTL site, not by static analysis):
- Events calendar grid (day-of-week order, cell content alignment)
- The 3D flip-book program cards (spine side, open/close direction)
- Chapter navigation arrows (`← Prev` / `Next →` — arrows and reading order
  both need to flip)
- The donate checkout's step indicator (١ → ٢ → ٣ progression direction)
- `TopBar`'s mobile drawer (slide-in direction)

### 4. Bilingual admin content

`programs`, `events`, and `classes` tables each gain nullable Arabic sibling
columns for every translatable text field:

- `programs`: `title_ar`, `tagline_ar`, `category_ar`, `what_it_is_ar`,
  `problem_ar`, `activities_ar` (jsonb, same `{title, desc}[]` shape in Arabic)
- `events`: `title_ar`, `meta_ar`, `location_ar`, `presenter_ar`
- `classes`: `subject_ar`, `blurb_ar`

(`num`/`chapter` for programs are already Arabic-only and need no counterpart;
`city`/`track`/`language`/`day`/`time`/`format`/`status` are short structured
values — city names, days, times — treated as data, not prose, and are
transliterated/translated inline in the public Arabic renderer rather than
needing separate DB columns, e.g. a small lookup mapping `"Playa del Carmen"` →
`"بلايا ديل كارمن"`, `"Thursdays"` → `"الخميس"`, etc.)

Each admin form (Programs, Events, Classes) gets an English/العربية tab toggle
around the translatable fields — same form, same submit action, just showing
one language's inputs at a time; the Server Action saves both sets of columns
together. **Arabic fields are optional.** The public Arabic pages render the
`_ar` column when it's non-empty, and fall back to the English column when it
isn't — so a newly-added program with no Arabic text yet doesn't break or
blank out the Arabic site, it just shows English inline until translated.

### 5. Language switcher

`components/LangSwitcher.tsx` already has the UI (EN/ES/AR menu, AR marked "soon"
with a TODO comment for exactly this). Wire the AR option to a real link that
swaps the current path to its `/ar` equivalent (next-intl provides a
locale-aware `Link`/`usePathname` pair for this — the same page, other
language, not a redirect to the Arabic homepage). ES stays disabled/"soon" as
it is now, untouched.

## Testing

- Build passes (`npm run build`) with both locales statically generating.
- Manual browse-through of every route in Arabic, checking layout mirrors
  correctly (the "known trouble spots" list above, plus a general pass).
- Admin: add/edit a program, event, and class with Arabic fields filled in,
  confirm it renders on the Arabic site; confirm leaving Arabic fields blank
  falls back to English on the Arabic site without error.
- Existing English site and admin panel behavior unchanged — this is additive,
  not a rewrite of existing English behavior.

## Rollout

Work happens on the `arabic-i18n` branch. Vercel will auto-generate a preview
deployment for this branch on push (standard behavior for a Git-connected
project) — the owner can review it there. **Nothing merges to `main` (and
therefore nothing reaches the production domain) until the owner explicitly
says to deploy.**

Given the size, implementation proceeds in stages (sequenced by writing-plans):
1. next-intl setup, routing restructure (`(site)` → `[locale]`), RTL CSS
   conversion, language switcher wiring — no new copy yet, English behaves
   identically, Arabic renders the same copy in a mirrored layout as a
   correctness checkpoint.
2. Real Arabic translation, page by page, replacing the placeholder copy from
   stage 1.
3. Bilingual admin fields: migration, form updates, public fallback rendering.
