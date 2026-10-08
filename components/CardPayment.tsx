"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { createDonationCheckout, type CheckoutRequest } from "@/app/[locale]/donate/actions";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
// Loaded once per visit, only when card payments are configured.
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export const cardPaymentsEnabled = !!publishableKey;

/** Stripe's card form, inside the donation page (owner's call, 2026-10-08). */
export default function CardPayment({
  request,
  onError,
}: {
  request: CheckoutRequest;
  onError: () => void;
}) {
  const fetchClientSecret = useCallback(async () => {
    const res = await createDonationCheckout(request);
    if ("error" in res) {
      onError();
      throw new Error(res.error);
    }
    return res.clientSecret;
  }, [request, onError]);

  return (
    <div className="card-checkout" dir="ltr">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
