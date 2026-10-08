-- Emara Academy — card donations through Stripe are written to the ledger
-- automatically by the webhook (app/api/stripe/webhook). Run after 011.
-- `stripe_ref` is the Stripe payment/invoice id: unique, so a webhook Stripe
-- delivers twice can never record the same donation twice. Hand-logged
-- donations leave it empty.

alter table public.donations add column if not exists stripe_ref text;
create unique index if not exists donations_stripe_ref on public.donations (stripe_ref);
