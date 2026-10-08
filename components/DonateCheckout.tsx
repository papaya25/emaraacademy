"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useSetting } from "@/lib/settings";
import { useMonthRaised } from "@/lib/donations";
import { POLICY_LINKS_ENABLED } from "@/lib/policies";
import BankDetails from "@/components/BankDetails";
import CardPayment, { cardPaymentsEnabled } from "@/components/CardPayment";

// Fallback until site_settings loads; live goal under key `donation_month`.
const MONTH_FALLBACK = { goal: 5000 };
const RAISED_FALLBACK = 1850;

const METHODS = ["card", "bank"];

export default function DonateCheckout() {
  const t = useTranslations("donate");
  const locale = useLocale();
  const tc = useTranslations("donate.checkout");
  const month = useSetting("donation_month", MONTH_FALLBACK);
  const raised = useMonthRaised(RAISED_FALLBACK);
  const params = useSearchParams();
  // The server checks the amount again before charging (1–10,000 USD).
  const amount = Math.min(10000, Math.max(1, Math.round(Number(params.get("amount")) || 50)));
  const freq = params.get("freq") === "monthly" ? "monthly" : "once";
  const method = METHODS.includes(params.get("method") ?? "") ? (params.get("method") as string) : "card";

  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [email, setEmail] = useState("");
  // Card: the Stripe form opens once details are entered (and stays open).
  const [paying, setPaying] = useState(false);
  const [cardError, setCardError] = useState(false);
  const onCardError = useCallback(() => setCardError(true), []);
  const request = useMemo(
    () => ({ amount, frequency: freq, name, email, anonymous, locale }) as const,
    // Fixed when the form opens — later typing can't change the charge.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paying]
  );

  return (
    <section className="checkout-section">
      <div className="wrap narrow">
        <ol className="checkout-steps" aria-label={tc("steps")}>
          <li className="done">
            <span className="step-num">١</span> {tc("stepAmount")}
          </li>
          <li className="current">
            <span className="step-num">٢</span> {tc("stepDetails")}
          </li>
          <li>
            <span className="step-num">٣</span> {tc("stepConfirm")}
          </li>
        </ol>

        <div className="checkout-panel">
          <div className="checkout-summary">
            <div>
              <span className="corr-label">{tc("yourDonation")}</span>
              <p className="checkout-amount">
                <bdi>${amount}</bdi>{" "}
                <span>{freq === "monthly" ? tc("everyMonth") : tc("oneTime")}</span>
              </p>
              <p className="checkout-method">
                {tc("via", { method: t(`methods.${method}`) })}
              </p>
            </div>
            <Link href="/donate" className="checkout-change">
              {tc("change")}
            </Link>
          </div>

          {/* Bank transfers are identified by the transfer reference instead. */}
          {method !== "bank" && (
            <div className="checkout-fields">
              <div className="corr-fields">
                <div>
                  <label className="corr-label" htmlFor="don-name">
                    {tc("name")} {anonymous && tc("nameHidden")}
                  </label>
                  <input
                    id="don-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={anonymous || paying}
                    placeholder={anonymous ? tc("anonymous") : ""}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="corr-label" htmlFor="don-email">
                    {tc("email")}
                  </label>
                  <input
                    id="don-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={paying}
                    autoComplete="email"
                    dir="ltr"
                  />
                </div>
              </div>
              <label className="checkout-anon">
                <input
                  type="checkbox"
                  checked={anonymous}
                  disabled={paying}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                <span>{tc("keepAnonymous")}</span>
              </label>
            </div>
          )}

          <div className="checkout-payment">
            <span className="corr-label">{tc("payment")}</span>
            {method === "card" &&
              (!cardPaymentsEnabled ? (
                <p className="payment-placeholder">{tc("notConfigured")}</p>
              ) : cardError ? (
                <p className="corr-error" role="alert">
                  {tc("loadError")}
                </p>
              ) : (
                paying && <CardPayment request={request} onError={onCardError} />
              ))}
            {method === "bank" && <BankDetails />}
          </div>

          {method === "card" && cardPaymentsEnabled && !paying && (
            <button type="button" className="btn btn-gold donate-now" onClick={() => setPaying(true)}>
              {tc(freq === "monthly" ? "confirmMonthly" : "confirmOnce", {
                amount: String(amount),
              })}
            </button>
          )}
          <p className="checkout-secure">
            {tc.rich("secure", {
              policy: (c) =>
                POLICY_LINKS_ENABLED ? <Link href="/donation-policy">{c}</Link> : c,
            })}
          </p>

          <div className="give-progress checkout-progress">
            <div
              className="give-progress-bar"
              role="progressbar"
              aria-valuenow={raised}
              aria-valuemin={0}
              aria-valuemax={month.goal}
              aria-label={t("progressLabel")}
            >
              <span
                style={{ width: `${Math.min(100, (raised / month.goal) * 100)}%` }}
              />
            </div>
            <p>
              {tc("progress", {
                raised: raised.toLocaleString("en-US"),
                goal: month.goal.toLocaleString("en-US"),
              })}{" "}
              · <Link href="/donations">{t("seeAll")}</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
