import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Where Stripe sends the visitor back after the card form. The payment's
 *  status is read from Stripe itself, never from the URL. */
export default async function DonateCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const tc = await getTranslations("donate.checkout");
  const { session_id } = await searchParams;
  const stripe = getStripe();
  const session =
    stripe && session_id?.startsWith("cs_")
      ? await stripe.checkout.sessions.retrieve(session_id).catch(() => null)
      : null;
  const paid = session?.status === "complete";

  return (
    <main>
      <section className="checkout-section">
        <div className="wrap narrow">
          <div className="checkout-panel checkout-success">
            {paid ? (
              <>
                <p className="ar" aria-hidden="true">
                  جزاك الله خيرا
                </p>
                <h2>{tc("successTitle")}</h2>
                <p className="checkout-success-sub">
                  {tc("successBody", {
                    amount: ((session!.amount_total ?? 0) / 100).toLocaleString("en-US"),
                    email: session!.customer_details?.email ?? tc("you"),
                  })}
                </p>
                {session!.mode === "subscription" && (
                  <p className="checkout-success-sub">{tc("successMonthly")}</p>
                )}
              </>
            ) : (
              <>
                <h2>{tc("incompleteTitle")}</h2>
                <p className="checkout-success-sub">{tc("incompleteBody")}</p>
              </>
            )}
            <div className="title-actions">
              {!paid && (
                <Link className="btn btn-green" href="/donate">
                  {tc("retry")}
                </Link>
              )}
              <Link className="btn btn-ghost" href="/">
                {tc("home")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
