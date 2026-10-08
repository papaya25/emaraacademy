import type Stripe from "stripe";
import { getLedgerWriter, getStripe } from "@/lib/stripe";
import { ledgerRow } from "@/lib/stripeLedger";

/**
 * Stripe → donation ledger. Stripe calls this after every successful payment:
 * one-time donations arrive as `checkout.session.completed`, monthly ones as
 * `invoice.paid` (the first month and every renewal). Each becomes one row in
 * `donations`; `stripe_ref` is unique, so a repeated delivery is ignored.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const ledger = getLedgerWriter();
  if (!stripe || !secret || !ledger) return new Response("Not configured", { status: 503 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature") ?? "",
      secret
    );
  } catch {
    return new Response("Bad signature", { status: 400 }); // not from Stripe
  }

  const row = ledgerRow(event);
  if (!row) return new Response("Ignored", { status: 200 });

  const { error } = await ledger
    .from("donations")
    .upsert(row, { onConflict: "stripe_ref", ignoreDuplicates: true });
  // A failed write returns 500 so Stripe retries the delivery later.
  return error ? new Response(error.message, { status: 500 }) : new Response("Recorded");
}
