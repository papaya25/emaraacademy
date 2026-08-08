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
- Email: info@emaraacademy.mx
- **No team/board names are shown anywhere on the site.** The people running Emara Academy want to stay anonymous. Use a contact form + the phone/email above only — never add named staff, founder, or board bios/photos unless the owner explicitly reverses this.

## Languages
English first. Spanish and Arabic planned later (Spanish/Portuguese are the actual target audience for the programs; Arabic for broader reach).

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

## Pending from the owner (placeholders until provided)
- Legal registration numbers (e.g. CLUNI/RFC) for the transparency/about page
- Donation account details: Stripe/PayPal live keys, bank transfer info

## Status
Project scaffolded 2026-08-07. No pages built yet beyond the default Next.js starter.
