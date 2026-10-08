"use server";

import { headers } from "next/headers";
import { getStripe, DONATION_CURRENCY, MAX_DONATION, MIN_DONATION } from "@/lib/stripe";

export type CheckoutRequest = {
  amount: number;
  frequency: "once" | "monthly";
  name: string;
  email: string;
  anonymous: boolean;
  locale: string;
};

/** Starts an embedded Stripe Checkout for one donation and returns the secret
 *  the card form needs. Amount and frequency are checked here — never trust
 *  the browser for what gets charged. */
export async function createDonationCheckout(
  req: CheckoutRequest
): Promise<{ clientSecret: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "not-configured" };

  const amount = Math.round(Number(req.amount));
  if (!Number.isFinite(amount) || amount < MIN_DONATION || amount > MAX_DONATION) {
    return { error: "invalid-amount" };
  }
  const monthly = req.frequency === "monthly";
  const name = req.anonymous ? "" : String(req.name ?? "").trim().slice(0, 200);
  const email = String(req.email ?? "").trim().slice(0, 320);

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const prefix = req.locale === "ar" ? "" : `/${req.locale}`;

  // What the webhook writes to the ledger (null name = anonymous there).
  const metadata = { donor_name: name, frequency: req.frequency };

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    // Match the site: paper ground, green buttons, Lora, square corners.
    branding_settings: {
      display_name: "Emara Academy",
      background_color: "#f6efdf",
      button_color: "#1e4d3b",
      font_family: "lora",
      border_style: "rectangular",
    },
    mode: monthly ? "subscription" : "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: DONATION_CURRENCY,
          unit_amount: amount * 100,
          product_data: { name: monthly ? "Monthly donation — Emara Academy" : "Donation — Emara Academy" },
          ...(monthly ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    // Stripe's form has no Arabic; Arabic visitors get their browser's language.
    locale: req.locale === "es" ? "es-419" : req.locale === "en" ? "en" : "auto",
    ...(email ? { customer_email: email } : {}),
    metadata,
    ...(monthly
      ? { subscription_data: { metadata } }
      : { payment_intent_data: { metadata } }),
    return_url: `${origin}${prefix}/donate/complete?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret ? { clientSecret: session.client_secret } : { error: "no-secret" };
}
