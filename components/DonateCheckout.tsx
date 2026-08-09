"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// TODO: read from Supabase once donations go live — sample figures until then.
const MONTH_RAISED = 1850;
const MONTH_GOAL = 5000;

const METHOD_LABELS: Record<string, string> = {
  card: "Debit/Credit Card",
  paypal: "PayPal",
  bank: "Bank Transfer",
};

export default function DonateCheckout() {
  const params = useSearchParams();
  const amount = Number(params.get("amount")) || 50;
  const freq = params.get("freq") === "monthly" ? "monthly" : "once";
  const method = METHOD_LABELS[params.get("method") ?? ""] ? (params.get("method") as string) : "card";

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
            <h2>May it be written among your ongoing deeds.</h2>
            <p className="checkout-success-sub">
              This was a <strong>test-mode preview</strong> — no money moved.
              When payments go live, this page will confirm your donation,
              email a receipt to {email || "you"}, and record the amount in our
              public ledger.
            </p>
            <div className="title-actions">
              <Link className="btn btn-green" href="/donations">
                See the Donation Ledger
              </Link>
              <Link className="btn btn-ghost" href="/">
                Back to Home
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
        <ol className="checkout-steps" aria-label="Donation steps">
          <li className="done">
            <span className="step-num">١</span> Amount
          </li>
          <li className="current">
            <span className="step-num">٢</span> Your Details
          </li>
          <li>
            <span className="step-num">٣</span> Confirmation
          </li>
        </ol>

        <div className="checkout-panel">
          <div className="checkout-summary">
            <div>
              <span className="corr-label">Your donation</span>
              <p className="checkout-amount">
                ${amount} <span>{freq === "monthly" ? "every month" : "one time"}</span>
              </p>
              <p className="checkout-method">via {METHOD_LABELS[method]}</p>
            </div>
            <Link href="/#give" className="checkout-change">
              Change
            </Link>
          </div>

          <div className="checkout-fields">
            <div className="corr-fields">
              <div>
                <label className="corr-label" htmlFor="don-name">
                  Name {anonymous && "(hidden from the ledger)"}
                </label>
                <input
                  id="don-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={anonymous}
                  placeholder={anonymous ? "Anonymous" : ""}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="corr-label" htmlFor="don-email">
                  Email — for your receipt
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
              <span>Keep my donation anonymous</span>
            </label>
          </div>

          <div className="checkout-payment">
            <span className="corr-label">Payment</span>
            {method === "card" && (
              <div className="payment-placeholder">
                Secure card fields (Stripe) will appear here — currently in{" "}
                <strong>test mode</strong>, so nothing can be charged.
              </div>
            )}
            {method === "paypal" && (
              <div className="payment-placeholder">
                The PayPal button will appear here — currently in{" "}
                <strong>test mode</strong>, so nothing can be charged.
              </div>
            )}
            {method === "bank" && (
              <div className="payment-placeholder">
                Our account details (bank, CLABE, and a reference code that ties
                your transfer to your donation) will be shown here. Until
                they&rsquo;re published, <Link href="/contact">write to us</Link>{" "}
                and we&rsquo;ll send them directly.
              </div>
            )}
          </div>

          {method !== "bank" && (
            <button
              type="button"
              className="btn btn-gold donate-now"
              onClick={() => setConfirmed(true)}
            >
              Confirm ${amount} {freq === "monthly" ? "Monthly" : ""} Donation
            </button>
          )}
          <p className="checkout-secure">
            Payments processed by Stripe and PayPal — we never see or store your
            card details. Donations are governed by our{" "}
            <Link href="/donation-policy">Donation &amp; Refund Policy</Link>.
          </p>

          <div className="give-progress checkout-progress">
            <div
              className="give-progress-bar"
              role="progressbar"
              aria-valuenow={MONTH_RAISED}
              aria-valuemin={0}
              aria-valuemax={MONTH_GOAL}
              aria-label="Raised this month toward goal"
            >
              <span
                style={{ width: `${Math.min(100, (MONTH_RAISED / MONTH_GOAL) * 100)}%` }}
              />
            </div>
            <p>
              Your donation joins ${MONTH_RAISED.toLocaleString()} raised this
              month toward our ${MONTH_GOAL.toLocaleString()} goal ·{" "}
              <Link href="/donations">See all donations</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
