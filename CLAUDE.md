# Emara Academy Website

## What this is
Website for **Emara Academy**, a legally incorporated non-profit based in Playa del Carmen, Quintana Roo, Mexico. It runs retention-focused programs for new Muslim converts across Latin America (education, imam/teacher training, community events, mutual aid fund, outdoor retreats, inter-community exchange).

Mostly a **showcase/informational site** (who we are, programs, impact), plus:
- Donations: Stripe and bank transfer only (owner dropped PayPal 2026-09-24). Bank details (Citibanamex, CLABE, SWIFT) live in `lib/bankDetails.ts` and show on the checkout's bank option. `/donate` and `/donations` are `noindex` (owner: reachable by link, not listed in Google)
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
**Arabic is the main language since 2026-09-28** (owner, from his Word doc `EMARA ACADEMY.docx`: red = remove, green = add): `defaultLocale: "ar"` — Arabic at plain URLs, English under `/en`, Spanish under `/es`; browser-language detection stays on (Arabic/unknown → Arabic, en/es browsers → their language). The admin still opens in English without an `ADMIN_LOCALE` cookie. **Arabic leads the content**: parts the owner removed exist only as missing keys in `ar.json`, and pages render them with `t.has(...)` — English/Spanish keep their older text and sections until he asks to re-translate them from the Arabic ("not yet", 2026-09-28). So the three message files no longer have identical key sets.

Earlier history: English first. **Arabic is live** (since 2026-09-24): every public page is translated via `next-intl` — English at unprefixed URLs, Arabic under `/ar/...`, right-to-left layout. **Spanish** (added 2026-09-24 on branch `spanish-i18n`, meaning-for-meaning rather than literal, Mexican usage with "tú"): every public page under `/es/...`, enabled in the language menu. Spanish/Portuguese are the actual target audience for the programs; Portuguese is not started.
- Page text lives in `messages/en.json` / `messages/es.json` / `messages/ar.json` (one namespace per page, identical key sets). New public copy must go in **all three** files — never hardcode English in a public page/component. Use `t.rich(key, rich)` (`lib/rich.tsx`) for `<em>` in headings.
- Internal links use `Link`/`useRouter` from `@/i18n/routing`, not `next/link`, so visitors stay in their language.
- Program text: `lib/programs.es.ts` / `lib/programs.ar.ts` (by slug, via `localizeProgram`); sample classes: `lib/classes.es.ts` / `lib/classes.ar.ts`; city/day/track/status names: `lib/i18nDisplay.ts` (ES + AR tables).
- **Admin-edited content is translatable** (2026-09-24): programs, events and classes forms have English / Español / العربية tabs (`components/admin/LangTabs.tsx`), saved to `_es`/`_ar` sibling columns (migration `008_translated_content.sql`). Public site picks, per field: typed translation → built-in translation (`lib/programs.es.ts`/`.ar.ts`, sample classes) → English. Program logic lives in `programFromRow`/`localizeProgram` (`lib/programs.ts`). Translation is manual — auto-translate was offered and deferred by the owner.
- **The admin panel's own screens are EN/ES/AR** (2026-09-24, reverses the earlier "admin English-only" call at the owner's request): language picker in the admin sidebar and login card, stored in the `ADMIN_LOCALE` cookie (separate from the public site's `NEXT_LOCALE`); `i18n/request.ts` falls back to it for routes outside `app/[locale]`. Arabic admin is RTL. Admin text lives in the `admin` namespace of the three message files.
- RTL gotchas: Lora has no Arabic glyphs (RTL swaps it for Amiri), letter-spacing breaks Arabic joins (zeroed in RTL), drop caps are off in RTL, and phone numbers/emails/money need `dir="ltr"`/`<bdi>` or they display scrambled. Use logical CSS properties (`inset-inline`, `margin-inline-start`...), never left/right.

## Tech stack
- Next.js 16 (App Router) + TypeScript + Tailwind v4 + Turbopack
- Supabase (Postgres) for data: events, newsletter signups, program content
- Resend for sending newsletter campaigns (Supabase only stores subscribers, doesn't send)
- Stripe (card) + bank transfer for donations — Stripe still a test-mode placeholder until the owner provides keys; no PayPal
- Vercel for deployment
- No WordPress

## Environment gotcha
There is no system `node`/`npm`/`npx` on this machine. Node 22 lives at `~/.local/node22/bin`. Prefix every node/npm/npx command:
```bash
export PATH="$HOME/.local/node22/bin:$PATH"
```

## Tailwind class-name collision gotcha
Never name a custom CSS class after a Tailwind utility (`contents`, `hidden`, `container`, `flex`, etc.) — Tailwind v4 generates the matching utility class regardless, and it silently merges with your rule on any property your rule doesn't itself set. Bit us once: the homepage/`/programs` section was `className="contents"`, which picked up Tailwind's `.contents { display: contents }` (a real utility) — that collapsed the section to a zero-size box (`getBoundingClientRect()` all zeros), which is what made the "See Our Work" hero button silently fail to scroll to it. Renamed to `.chapters` in [globals.css](app/globals.css), [app/page.tsx](app/page.tsx), [app/programs/page.tsx](app/programs/page.tsx).

## Page texts editor (`/admin/pages`, 2026-09-28)
Admin → "Page texts" edits the wording of **Home, New Muslims, Who We Are** (prefixes in `EDITABLE_PAGES`, `lib/pageText.ts`; Home also covers `shared.seeOurWork`, `impact.*`, `newsletter.note/subscribe`). Arabic tab first, then English/Spanish typed by hand (owner declined an auto-translate button). Saved edits live in `site_settings` row `page_text` = `{ text: {locale: {path: text}}, updated: {path: {locale: iso}} }` and are laid over messages/*.json in `i18n/request.ts` (REST fetch cached 300s, tag `page-text`; `savePageText` calls `updateTag`). **Empty = hidden**: every text on those pages renders through `hasText(t, key)`. English/Spanish boxes show "The Arabic changed after this" when the Arabic's timestamp is newer. The small Arabic ornament/folio words on About and New Muslims are now message keys (`about.ornament`, `about.story.folio`, …, `newMuslims.ornament`) so they're editable too. Messages containing `<tag>`/`{…}` must stay valid ICU — the editor's help text warns about keeping `<…>` intact.
- "Non-profit": client says not to call it one (not registered as such). Fixed in **Arabic only** (owner's choice, 2026-09-28): footer and About lede say "أكاديمية تعليمية مسجلة قانونياً", acceptance policy too. English/Spanish still say "non-profit" until the full re-translation.

## Campaign "Un Corán para ti" (2026-10-08)
Free Spanish Qur'ans (annotated translation by Lic. M. Isa García) across Mexico. Owner's calls: its own page `/coran` (photos in `public/campaign/`, gift text + the card's message, then the request form) + a home section right under the programs shelf + a menu/footer link "Corán de regalo / A Qur'an as a Gift / مصحف هدية" (owner: gift wording, never "gratis/free") while it runs (**remove the link and home section when the campaign ends**; keep the page). Written in Spanish first, then EN/AR; page text editable in admin → Page texts ("coran"; home section is `home.coran.*`).
**Request form is the site's own** (`components/CoranRequestForm.tsx`, owner replaced his Google Form 2026-10-08 — no sign-in): the Google Form's exact fields (name, age, phone/WhatsApp, email, street, ext/int number, colonia, 5-digit postal code, city, state — now a list of the 32 states in `lib/coranCampaign.ts`, address references, first Qur'an?, why, comments) + copies (1–10) + optional stats questions (relationship with Islam, how they heard). Hidden honeypot field silently drops bots. Table `coran_requests` (migration `013_coran_requests.sql`): visitors insert only, always as `pending` (RLS check); admin reads/updates. Admin → "Corán de regalo" (`/admin/coran`): stat cards, breakdowns by state / relationship / source / first-Qur'an / month (cancelled excluded), status+state filters, per-request shipping label with WhatsApp/email, status Pending→Sent→Delivered/Cancelled + tracking note, delete, and "Download for shipping" CSV (`/admin/coran/export`, UTF-8 BOM for Excel). Overview shows pending requests.

## Stripe card donations (built 2026-10-08) — LIVE since 2026-10-08
Owner added the 4 Production env vars in Vercel himself and created the Stripe webhook destination (events `checkout.session.completed`, `invoice.paid` → `https://www.emaraacademy.org/api/stripe/webhook`); redeployed and verified: live embedded form loads, webhook answers 400 to unsigned calls. First real payment end-to-end (money in Stripe + ledger row) still to be confirmed by a small donation.
Owner's calls: **US dollars**, card form **embedded in the donation page** (Stripe Embedded Checkout, `ui_mode: "embedded_page"`, branded paper/green/Lora), and **every card payment written to the admin ledger automatically**. Flow: `components/DonateCheckout.tsx` → "Continue to pay" → `components/CardPayment.tsx` (EmbeddedCheckoutProvider) → server action `createDonationCheckout` (`app/[locale]/donate/actions.ts`; validates 1–10,000 USD, mode `payment` or `subscription` for monthly, metadata `donor_name` empty = anonymous) → Stripe returns to `/donate/complete?session_id=…`, which reads the status from Stripe. Webhook `app/api/stripe/webhook/route.ts` verifies the signature and maps events via `lib/stripeLedger.ts` (`checkout.session.completed` mode=payment → one-time; `invoice.paid` with subscription_details → monthly incl. renewals) into `donations` with the Supabase **secret** key; `stripe_ref` unique (migration `012_stripe_donations.sql`, applied) makes repeat deliveries harmless. Env vars: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SECRET_KEY` — local `.env.local` has only the TEST Stripe keys; live values go in Vercel by the owner, never through Claude. Without the publishable key the page shows "card payments aren't switched on yet". The owner pasted the `sk_live` key in chat on 2026-10-08 — it must be rolled before real donations (he said he'll rotate it then); use a restricted "Full access — except sensitive operations" key instead.

## Admin panel (`/admin`) — built 2026-09-22
**Password gate is ON** (turned back on 2026-09-24, owner's request). `ADMIN_AUTH_ENABLED = true` in
[`proxy.ts`](proxy.ts), and only the Supabase user `admin@emaraacademy.org` gets in — any other
signed-in Supabase user is treated as signed out. The password is set in the Supabase dashboard
(never in code). Migration `005_admin_only_access.sql` makes the database enforce the same thing
(`public.is_admin()`): before it, every admin policy allowed *any* authenticated user, and public
sign-ups are on by default in Supabase. Admin pages are `noindex`.

Supabase status (2026-09-24): project `yglhgvzpuglxgqgrjfpl` ("Emara Academy project", org
`cmrbghdywqxhagixjviu`) is active, and **all migrations are applied** (schema + 002–008 — 008 applied 2026-09-24 with the owner's go-ahead, run via the
Supabase MCP — the project isn't in `list_projects` but `get_project`/`apply_migration` by id work).
Security advisor is clean. Still owner-only (dashboard, no API access for it here):
1. Authentication → Users → Add User (tick "Auto Confirm User"): email
   `admin@emaraacademy.org` + the password the owner chose. That password is the one login — **one shared
   account, not one per person** (owner's explicit call: "no need for 2 separate accounts
   just one with one password"). Login screen only asks for the password; the email is
   hardcoded in `lib/adminAuth.ts`. Never put the password in code or SQL (migration SQL is logged).
2. Authentication → Sign In / Providers → turn off "Allow new users to sign up".

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

**Structure:** the public site lives under `app/[locale]/` (next-intl; was `app/(site)/` before
Arabic) with its own layout (`TopBar`/`Footer`) — `app/admin` sits outside it so it gets a bare
English-only shell. New public pages go in `app/[locale]/`, with their text in both message files.
`MobileDonateBar` exists but is intentionally unused (owner removed all donate CTAs; `/donate` is
reachable by direct link only).

## Class enrollment (built 2026-09-26) — now inside the contact page (2026-09-28)
**Current:** the contact page form (`components/ContactSection.tsx`) is titled "كن جزءاً من عمارة" with chips: student (pick a class → `enrollments`, places/waitlist as below), teacher / translator / event photographer / volunteer (name, email, WhatsApp, optional note → `registrations`, migration `010_role_registrations.sql`, anon insert-only, admin read), and "Something Else" (plain message → `contact_messages`). The text beside the form was removed; below it `components/ReachUs.tsx` lists WhatsApp, email, Instagram, Facebook, TikTok from the `contact_info` setting (social links editable in admin → Settings; placeholder accounts until the owner sets real ones). `/enroll` only redirects to `/contact` (keeps `?class=`); class cards and the calendar link to `/contact?class=…`, which preselects "student" + that class. Admin `/admin/enrollments` = class sign-ups + "Team registrations" by role. No "Enroll" link in the header/footer any more.

**Superseded history:** visitors signed up on the dedicated **`/enroll` page** (owner's call 2026-09-27: its own page + "Enroll" link in the header menu and footer). Its design is the one he approved first: **city filter + class cards on top, the "Save your place" form underneath** (`<ClassesBoard withForm />` → `components/EnrollForm.tsx`: name, email, WhatsApp + class picker). A card's Enroll button picks the class and scrolls to the form; `?class=<id>` (from `/classes` cards and the calendar) preselects and jumps to it. `/classes` shows the same cards without the form, linking to `/enroll?class=…`. With no real Supabase classes, both pages show the sample cards (old contact/WhatsApp buttons) and no form. `html` has `scroll-behavior: smooth` — programmatic scrolls in the headless test browser don't move unless `behavior: "instant"`. Shared loading/full-rule/translation logic: `lib/liveClasses.ts`. Real classes also appear on the `/events` calendar every week on their weekday (free-text `day` parsed as EN/ES weekday names; unparseable days are skipped) with an "Enroll →" link; approximate Ramadan/Eid dates show in live mode too. `/admin/enrollments` lists every class (empty ones say so); the Enrolled count on admin Classes links to it. **Published 2026-09-27** (owner: "publish"). A test class "TEST CLASS — Islam from Zero" (2 places) is in the live DB at the owner's request — delete it when he says. Header now switches to the drawer menu below 1040px (was 820) — six links in Spanish don't fit narrower. Each class has an optional `capacity`; migration `009_class_enrollments.sql` (applied 2026-09-26) adds `enrollments` (anon insert-only, admin-only read via `is_admin()`), a BEFORE INSERT trigger that decides `confirmed` vs `waitlist` (full when capacity reached or status = 'Full', row-locked so the last place can't be double-booked; the visitor can't choose), a unique (class, lower(email)) index, and a public `class_availability` view exposing counts only (007's private-schema pattern). Tested with a self-rolling-back transaction: first → confirmed, second → waitlist even when it asked for confirmed, case-insensitive duplicate blocked, anon reads 0 rows. Admin: `/admin/enrollments` (per class, WhatsApp/email links, "Confirm" moves someone off the waitlist, delete), "Places" field + Enrolled column on Classes, Overview card. No automatic notification to the admin (Resend is paused) — the owner checks the admin page. No spam protection beyond field limits, same as the contact form.
- Donations: owner rule (2026-09-26) — **nothing about donations shows on the public site** (contact "Donating" chip and FAQ donors section removed). Donation pages stay reachable by direct link only.
- Legal (from the SAT Constancia, 2026-09-26): "EMARA ACADEMY", Sociedad por Acciones Simplificada de C.V., RFC EAC260327JP1, RESICO regime (monthly ISR/IVA obligations), registered address in Roma Norte, CDMX — do NOT publish the address (anonymity). Bank says "S.A. de C.V." — mismatch flagged. Owner chose to keep the "non-profit association" wording for now pending his accountant.

## Pending from the owner (placeholders until provided)
- Arabic-first update, contact registration and Page texts editor **published 2026-09-29**; migration `011_remove_mutual_aid_program.sql` applied the same day (5 programs left, renumbered).
- New Muslims page's three new Arabic sections are text only — owner will say later what "ابدأ التسجيل", the four "أنشطة المسلم الجديد" items and "تواصل دائم" should open.
Status 2026-09-24: domain **emaraacademy.org is live** (IONOS DNS → Vercel; apex redirects to `www.emaraacademy.org`, the primary). Admin user `admin@emaraacademy.org` **exists and is confirmed** in Supabase (only user). Still open:
- Supabase dashboard: confirm "Allow new users to sign up" is turned off (not verifiable from here)
- Stripe account/keys — owner says coming soon (card donations are a test-mode placeholder). PayPal dropped for good.
- Newsletter sending (Resend account + `RESEND_API_KEY` + verified domain) — **paused until the client confirms**; signups still collect
- Legal registration numbers for the About page — not yet provided
- Legal entity wording: owner confirms the org operates as a non-profit but is registered as "EMARA ACADEMY S.A. DE C.V." (chosen as fastest setup; he describes it as untaxed below a revenue threshold). The site says "legally incorporated non-profit association" in EN/ES/AR and the FAQ touches tax deductibility — flagged to owner as a wording/legal-accuracy question, NOT changed; await his decision
- Native-speaker proofread of the Arabic and Spanish; legal review of the policies (both translations included)
- Policy pages are written (EN/ES/AR) but deliberately unlinked: `POLICY_LINKS_ENABLED = false` in `lib/policies.ts` — flip to true only when the owner says so
## Ideas offered, not yet approved
- Auto-translate admin content (programs/events/classes) into Arabic on save via the Claude API, stored in `_ar` columns with an editable Arabic tab (= Stage 3 of the i18n plan). Owner asked about it; awaiting a go-ahead.
- Spanish translation (the programs' real audience).

## Status
Pages built: `/` (home), `/about`, `/events` (calendar board: city filter, color legend, day panel right, approx Eid/Ramadan dates), `/donations` (ledger), `/contact`, `/programs` + six `/programs/[slug]` chapters (`lib/programs.ts`), `/new-muslims`, `/faq`, `/classes` (sample class picker w/ city filter, `lib/classes.ts` — all "Join a Class" buttons route here), `/donate` (checkout: step indicator, params from DonatePanel, anonymous option, test-mode payment placeholders, confirmation state), `/privacy-policy`, `/donation-policy`, `/donation-acceptance-policy` (drafts flagged pending legal review, shared `components/PolicyPage.tsx`). "Talk to Someone" buttons open WhatsApp (+52 55 2670 9079 via wa.me). Language switcher: EN + AR active, ES "soon".

Homepage 2026-09-21: per the client's request (relayed by the owner) to foreground the programs, the bookshelf (`components/ProgramShelf.tsx`) moved up to sit directly under the hero (was further down under "Six chapters of one mission"), and each program renders as a real 3D CSS flip-card book — colored spine, stacked-page shadow on the closed cover, `rotateY(180deg)` flip to an "open page" back face with the program description and a link to its full `/programs/[slug]` chapter. Fixed 380px card height means opening one book never reflows its siblings. Same component is reused on `/programs`. Hero CTA "Begin Your Journey" replaced with "See Our Work" (anchors to `#programs`); see the Tailwind class-collision gotcha above for the bug this surfaced and its fix.

Infra: GitHub `papaya25/emaraacademy` (push after every commit — Vercel auto-deploys from it). Vercel project `emaraacademy` (deploys show under team `amanahvacations`; older notes said `tutcasa`) had its Framework Preset unset, which silently produced empty serverless function output (builds "succeeded" but every route 404'd) — fixed 2026-08-09 by explicitly setting `framework: "nextjs"` via the Vercel API; don't unset it. Production build uses `next build --webpack` (package.json) rather than Next.js 16's new Turbopack-build default, kept deliberately since Vercel's Turbopack-build support is still new — dev (`next dev`) still uses Turbopack. Vercel CLI is installed globally and logged in on this Mac (useful for `vercel inspect`/API debugging). Supabase project `yglhgvzpuglxgqgrjfpl` (separate org from the MCP account's default org, but reachable by id through the Supabase MCP — see "Admin panel"; publishable key in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — same vars must exist in Vercel). Newsletter form does a live insert into `newsletter_subscribers` (table exists, tested end-to-end). Backend phase 1 shipped: contact form inserts into `contact_messages`; events/classes boards read from `events`/`classes` tables (sample data as clearly-labeled fallback while tables are missing/empty); impact stats + monthly raised/goal read from `site_settings` (keys `impact_stats`, `donation_month`) via `lib/settings.ts` `useSetting` hook. Full schema in `supabase/schema.sql` + `supabase/migrations/002–007` — all applied as of 2026-09-24. Security model: anon key = insert-only on contact/newsletter, read-only on events/classes/settings; writes need an authenticated Supabase user (for the admin panel, next). Remaining: see "Pending from the owner" above. Admin panel is built — see "Admin panel" section above for activation steps. Owner prefers "donation" over "gift" in copy. Dev server: `.claude/launch.json` uses autoPort (port 3000 may be taken by other projects).
