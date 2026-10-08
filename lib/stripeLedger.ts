import type Stripe from "stripe";

/** One Stripe payment as a row of the admin's donation ledger. Pure (no
 *  database) so it can be checked against real test events. */
export type LedgerRow = {
  occurred_on: string;
  amount: number;
  donor_name: string | null;
  method: "card";
  frequency: "once" | "monthly";
  note: string;
  stripe_ref: string;
};

export function ledgerRow(event: Stripe.Event): LedgerRow | null {
  const day = (unix: number) => new Date(unix * 1000).toISOString().slice(0, 10);

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    // Monthly donations are recorded from their invoices instead (below).
    if (s.mode !== "payment" || s.payment_status !== "paid" || !s.amount_total) return null;
    return {
      occurred_on: day(s.created),
      amount: s.amount_total / 100,
      donor_name: s.metadata?.donor_name || null,
      method: "card",
      frequency: "once",
      note: "Stripe (card)",
      stripe_ref: typeof s.payment_intent === "string" ? s.payment_intent : s.id,
    };
  }

  if (event.type === "invoice.paid") {
    const inv = event.data.object;
    const sub = inv.parent?.subscription_details;
    if (!sub || !inv.amount_paid) return null;
    return {
      occurred_on: day(inv.status_transitions?.paid_at ?? inv.created),
      amount: inv.amount_paid / 100,
      donor_name: sub.metadata?.donor_name || null,
      method: "card",
      frequency: "monthly",
      note: "Stripe (card, monthly)",
      stripe_ref: inv.id ?? `${event.id}`,
    };
  }

  return null;
}
