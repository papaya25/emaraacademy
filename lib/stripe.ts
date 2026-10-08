import Stripe from "stripe";
import { createClient as createSupabase } from "@supabase/supabase-js";

/** Server-only Stripe client; null until STRIPE_SECRET_KEY is set. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

/** Donations are taken in US dollars (owner, 2026-10-08), whole dollars. */
export const DONATION_CURRENCY = "usd";
export const MIN_DONATION = 1;
export const MAX_DONATION = 10000;

/** Supabase with the secret key — bypasses row-level security, so it's only
 *  ever used server-side by the Stripe webhook to write the ledger. */
export function getLedgerWriter() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  return url && key ? createSupabase(url, key, { auth: { persistSession: false } }) : null;
}
