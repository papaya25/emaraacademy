"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useSetting } from "@/lib/settings";
import { useMonthRaised } from "@/lib/donations";
import { POLICY_LINKS_ENABLED } from "@/lib/policies";

// Fallback until site_settings loads; live goal under key `donation_month`.
const MONTH_FALLBACK = { goal: 5000 };
const RAISED_FALLBACK = 1850;

const METHODS = ["card", "paypal", "bank"];

export default function DonateCheckout() {
  const t = useTranslations("donate");
  const tc = useTranslations("donate.checkout");
  const month = useSetting("donation_month", MONTH_FALLBACK);
  const raised = useMonthRaised(RAISED_FALLBACK);
  const params = useSearchParams();
  const amount = Number(params.get("amount")) || 50;
  const freq = params.get("freq") === "monthly" ? "monthly" : "once";
  const method = METHODS.includes(params.get("method") ?? "") ? (params.get("method") as string) : "card";

  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <section className="checkout-section">
        <div className="wrap narrow">
          <div className="checkout-panel checkout-success">
            <p className="ar" aria-hidden="true">
              جزاك الله خيرا
            </p>
            <h2>{tc("successTitle")}</h2>
            <p className="checkout-success-sub">
              {tc.rich("successBody", {
                strong: (c) => <strong>{c}</strong>,
                email: email || tc("you"),
              })}
            </p>
            <div className="title-actions">
              <Link className="btn btn-green" href="/donations">
                {tc("ledger")}
              </Link>
              <Link className="btn btn-ghost" href="/">
                {tc("home")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                  disabled={anonymous}
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
                  autoComplete="email"
                />
              </div>
            </div>
            <label className="checkout-anon">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span>{tc("keepAnonymous")}</span>
            </label>
          </div>

          <div className="checkout-payment">
            <span className="corr-label">{tc("payment")}</span>
            {method === "card" && (
              <div className="payment-placeholder">
                {tc.rich("cardPlaceholder", { strong: (c) => <strong>{c}</strong> })}
              </div>
            )}
            {method === "paypal" && (
              <div className="payment-placeholder">
                {tc.rich("paypalPlaceholder", { strong: (c) => <strong>{c}</strong> })}
              </div>
            )}
            {method === "bank" && (
              <div className="payment-placeholder">
                {tc.rich("bankPlaceholder", {
                  write: (c) => <Link href="/contact">{c}</Link>,
                })}
              </div>
            )}
          </div>

          {method !== "bank" && (
            <button
              type="button"
              className="btn btn-gold donate-now"
              onClick={() => setConfirmed(true)}
            >
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
