# Emara Academy Website

## What this is
Website for **Emara Academy**, a legally incorporated non-profit based in Playa del Carmen, Quintana Roo, Mexico. It runs retention-focused programs for new Muslim converts across Latin America (education, imam/teacher training, community events, mutual aid fund, outdoor retreats, inter-community exchange).

Mostly a **showcase/informational site** (who we are, programs, impact), plus:
- Donations: Stripe, PayPal, and bank transfer (bank details shown as plain info, no integration needed)
- Newsletter signup stored in Supabase, campaigns sent via Resend
- Events calendar/planner
- Admin panel (like a `/admin` area) to manage events, programs, and newsletter data

Content source: `docs/Imarah_Program_Prospectus.docx` (English). The Arabic prospectus is **not** in use — set aside per the owner as of 2026-08-07.

## Owner
Maher — business owner, not a developer. Explain things plainly, confirm before deviating from his decisions.

## Naming note
The org's real name is **Emara Academy**. The original prospectus used "Imārah (عِمَارَة)" as a working title (Arabic word for "cultivation/building up") — that's the etymology/inspiration, not the brand name. Don't use "Imarah" as the site's name.

## Brand
Logo is at `brand/logo.jpg` — navy and gold arch/mihrab motif with Arabic calligraphy ("عمارة") and "EMARA ACADEMY" wordmark. `brand/logo-transparent.png` = background removed, original colors (use on light grounds).

## Design system — "Illuminated Library" (chosen 2026-08-08 over a navy showcase concept)
Manuscript/book aesthetic: warm paper ground, content framed like an illuminated title page, programs as a Table of Contents, donations framed by the ṣaḥīḥ Muslim hadith of ongoing charity.
- Colors: paper `#f6efdf`, paper-deep `#efe5cd`, ink `#241c12`, green (lead) `#1e4d3b`, green-soft `#2c6650`, gold `#b8912e`, gold-deep `#96741f`, terracotta (sparing) `#b5613c`
- Type: **Amiri** (display; classical Naskh-derived, has Arabic) + **Lora** (body serif), via `next/font/google`
- NO pictogram/line icons anywhere — owner rejected icon styles twice. Ornament is typographic: rules, dot leaders, one 8-petal floral rosette, Arabic-Indic chapter numerals (١٢٣...)
- Islamic symbolism: crescent + 5-pointed star only if needed; NEVER an 8-pointed star/octagram (owner flagged it reads as Star of David)
- Owner feedback pending: contact section redesigned away from bare "colophon links", fuller footer

## Contact & team
- Phone: +52 55 2670 9079
- Email: info@emaraacademy.org (corrected from .mx on 2026-08-08)
- **No team/board names are shown anywhere on the site.** The people running Emara Academy want to stay anonymous. Use a contact form + the phone/email above only — never add named staff, founder, or board bios/photos unless the owner explicitly reverses this.

## Languages
English first. **Arabic is built** (branch work from 2026-09-23, preview only until the owner approves going live): every public page is translated via `next-intl` — English at unprefixed URLs, Arabic under `/ar/...`, right-to-left layout. Spanish is still "soon" in the language menu (Spanish/Portuguese are the actual target audience for the programs).
- Page text lives in `messages/en.json` / `messages/ar.json` (one namespace per page). New public copy must go in **both** files — never hardcode English in a public page/component. Use `t.rich(key, rich)` (`lib/rich.tsx`) for `<em>` in headings.
- Internal links use `Link`/`useRouter` from `@/i18n/routing`, not `next/link`, so Arabic visitors stay on `/ar`.
- Program text in Arabic: `lib/programs.ar.ts` (by slug, via `localizeProgram`); sample classes: `lib/classes.ar.ts`; city/day/track/status names: `lib/i18nDisplay.ts`. Anything edited in the admin panel still shows in English on `/ar` until the planned Arabic admin fields exist (plan: `docs/superpowers/plans/2026-09-22-arabic-i18n.md`, Stage 3).
- The admin panel stays English-only (owner's call).
- RTL gotchas: Lora has no Arabic glyphs (RTL swaps it for Amiri), letter-spacing breaks Arabic joins (zeroed in RTL), drop caps are off in RTL, and phone numbers/emails/money need `dir="ltr"`/`<bdi>` or they display scrambled. Use logical CSS properties (`inset-inline`, `margin-inline-start`...), never left/right.

## Tech stack
- Next.js 16 (App Router) + TypeScript + Tailwind v4 + Turbopack
- Supabase (Postgres) for data: events, newsletter signups, program content
- Resend for sending newsletter campaigns (Supabase only stores subscribers, doesn't send)
- Stripe + PayPal for online donations (test mode until real keys are provided)
- Vercel for deployment
- No WordPress

## Environment gotcha
There is no system `node`/`npm`/`npx` on this machine. Node 22 lives at `~/.local/node22/bin`. Prefix every node/npm/npx command:
```bash
export PATH="$HOME/.local/node22/bin:$PATH"
```

## Tailwind class-name collision gotcha
Never name a custom CSS class after a Tailwind utility (`contents`, `hidden`, `container`, `flex`, etc.) — Tailwind v4 generates the matching utility class regardless, and it silently merges with your rule on any property your rule doesn't itself set. Bit us once: the homepage/`/programs` section was `className="contents"`, which picked up Tailwind's `.contents { display: contents }` (a real utility) — that collapsed the section to a zero-size box (`getBoundingClientRect()` all zeros), which is what made the "See Our Work" hero button silently fail to scroll to it. Renamed to `.chapters` in [globals.css](app/globals.css), [app/page.tsx](app/page.tsx), [app/programs/page.tsx](app/programs/page.tsx).

## Admin panel (`/admin`) — built 2026-09-22
**⚠ The password gate is currently OFF in production.** `ADMIN_AUTH_ENABLED = false` in
[`proxy.ts`](proxy.ts) — anyone with the URL can open `/admin` right now. This was the
owner's explicit, temporary call on 2026-09-22 ("for now no need for password we can add it
later, for now what is important is to see the design") because the Supabase project is
paused (billing) so there's no working login to test against anyway. **Flip it back to
`true` before this matters** — i.e. once real data (donor names, contact messages) starts
landing in it, and definitely before/at the point the owner unpauses Supabase and wants the
real login working.

Two things the owner still needs to do in the Supabase dashboard before the panel is fully
live (I don't have write access — it's on the owner's own Supabase account, not the
MCP-connected one):
1. Unpause the project (billing) — it's currently paused, so all Supabase calls fail; every
   admin list page falls back to empty/static-preview state instead of erroring (see below).
2. Run migrations `002_admin_panel.sql`, `003_classes_location_programs_crud.sql`, then
   `004_email_campaigns.sql` (all in `supabase/migrations/`) in the SQL Editor, in that
   order, after `schema.sql` (which should already be applied).
3. Once auth is turned back on: Authentication → Users → Add User: email
   `admin@emaraacademy.org`, any password. That password is the one login — **one shared
   account, not one per person** (owner's explicit call: "no need for 2 separate accounts
   just one with one password"). Login screen only asks for the password; the email is
   hardcoded in `lib/adminAuth.ts`.

Admin pages are built to degrade gracefully with Supabase unreachable/paused: Programs
falls back to `lib/programs.ts`'s static content as an editable preview (with a notice that
Save won't persist), Events/Classes/Donations show a plain "nothing yet" state instead of
erroring. Confirmed this works — the whole panel is browsable right now even fully paused.

What it manages: Programs/chapters (moved from `lib/programs.ts` into a `programs` table,
public pages fall back to the static file if the table's empty; full add/delete too — chapter
numbers/Arabic numerals renumber automatically via `lib/arabicNumerals.ts` when the count
changes), Events + Classes (full add/edit/delete — events gained `location`/`time`/
`presenter` columns, classes gained `location`), Donations
(a private ledger — owner logs each gift by hand since Stripe/PayPal aren't live; the
homepage "raised this month" figure is now computed automatically from this table via the
public `monthly_donation_total` view, no more manual updates), Messages (contact form
submissions — previously had zero UI to read them), Newsletter (subscriber list, plus a
compose-and-send broadcast tool — one email per recipient via Resend's batch endpoint,
`lib/resend.ts`, logged to a new `email_campaigns` table shown as send history; inert with a
disabled Send button until `RESEND_API_KEY` env var is set — owner still needs to create a
Resend account and a verified sending domain, same as the existing Stripe/PayPal backlog
item; triggered/automated sequences like a welcome email were explicitly deferred, owner
chose broadcast-first), and Settings (contact email/phone — now threaded through every
WhatsApp link and the footer via `components/WhatsAppLink.tsx`/`ContactDetails.tsx` — plus
impact numbers and the monthly
goal). Auth is cookie-based via `@supabase/ssr` (`lib/supabase/server.ts`,
`lib/supabase/client.ts`), gated by `proxy.ts` (Next 16's renamed `middleware.ts`).

**Structural change:** the public site now lives under `app/(site)/` with its own layout
(`TopBar`/`Footer`/`MobileDonateBar`) — `app/admin` sits outside that group so it gets a
bare shell instead of the public nav and donate bar. New public pages go in `app/(site)/`,
not `app/`.

## Pending from the owner (placeholders until provided)
- Legal registration numbers (e.g. CLUNI/RFC) for the transparency/about page
- Donation account details: Stripe/PayPal live keys, bank transfer info
- Run the admin panel migration + create the admin login (see above)

## Status
Pages built: `/` (home), `/about`, `/events` (calendar board: city filter, color legend, day panel right, approx Eid/Ramadan dates), `/donations` (ledger), `/contact`, `/programs` + six `/programs/[slug]` chapters (`lib/programs.ts`), `/new-muslims`, `/faq`, `/classes` (sample class picker w/ city filter, `lib/classes.ts` — all "Join a Class" buttons route here), `/donate` (checkout: step indicator, params from DonatePanel, anonymous option, test-mode payment placeholders, confirmation state), `/privacy-policy`, `/donation-policy`, `/donation-acceptance-policy` (drafts flagged pending legal review, shared `components/PolicyPage.tsx`). "Talk to Someone" buttons open WhatsApp (+52 55 2670 9079 via wa.me). Language switcher: EN active, ES/AR "soon".

Homepage 2026-09-21: per the client's request (relayed by the owner) to foreground the programs, the bookshelf (`components/ProgramShelf.tsx`) moved up to sit directly under the hero (was further down under "Six chapters of one mission"), and each program renders as a real 3D CSS flip-card book — colored spine, stacked-page shadow on the closed cover, `rotateY(180deg)` flip to an "open page" back face with the program description and a link to its full `/programs/[slug]` chapter. Fixed 380px card height means opening one book never reflows its siblings. Same component is reused on `/programs`. Hero CTA "Begin Your Journey" replaced with "See Our Work" (anchors to `#programs`); see the Tailwind class-collision gotcha above for the bug this surfaced and its fix.

Infra: GitHub `papaya25/emaraacademy` (push after every commit — Vercel auto-deploys from it). Vercel project (team `tutcasa`) had its Framework Preset unset, which silently produced empty serverless function output (builds "succeeded" but every route 404'd) — fixed 2026-08-09 by explicitly setting `framework: "nextjs"` via the Vercel API; don't unset it. Production build uses `next build --webpack` (package.json) rather than Next.js 16's new Turbopack-build default, kept deliberately since Vercel's Turbopack-build support is still new — dev (`next dev`) still uses Turbopack. Vercel CLI is installed globally and logged in on this Mac (useful for `vercel inspect`/API debugging). Supabase project `yglhgvzpuglxgqgrjfpl` (owner's separate account, NOT in the MCP-connected account; publishable key in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — same vars must exist in Vercel). Newsletter form does a live insert into `newsletter_subscribers` (table exists, tested end-to-end). Backend phase 1 shipped: contact form inserts into `contact_messages`; events/classes boards read from `events`/`classes` tables (sample data as clearly-labeled fallback while tables are missing/empty); impact stats + monthly raised/goal read from `site_settings` (keys `impact_stats`, `donation_month`) via `lib/settings.ts` `useSetting` hook. Full schema in `supabase/schema.sql` — owner must run it in the Supabase SQL Editor (as of 2026-08-13 NOT yet run; contact form shows its error state until then). Security model: anon key = insert-only on contact/newsletter, read-only on events/classes/settings; writes need an authenticated Supabase user (for the admin panel, next). Remaining: Stripe test mode (owner creating account), Resend account + `RESEND_API_KEY` (code is built and waiting — see "Admin panel" section), custom domain emaraacademy.org, Spanish. Admin panel is built — see "Admin panel" section above for activation steps. Owner prefers "donation" over "gift" in copy. Dev server: `.claude/launch.json` uses autoPort (port 3000 may be taken by other projects).
