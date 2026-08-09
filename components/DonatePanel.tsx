"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AMOUNTS = [25, 50, 100, 250];

// TODO: read from Supabase once donations go live — sample figures until then.
const MONTH_RAISED = 1850;
const MONTH_GOAL = 5000;

type Method = "card" | "paypal" | "bank";

const METHOD_LABELS: Record<Method, string> = {
  card: "Debit/Credit Card",
  paypal: "PayPal",
  bank: "Bank Transfer",
};

export default function DonatePanel() {
  const router = useRouter();
  const [freq, setFreq] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<number | "">(50);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<Method>("card");

  const effective = custom ? Number(custom) : amount;
  const validAmount = typeof effective === "number" && effective > 0;

  const donateNow = () => {
    if (!validAmount) return;
    router.push(`/donate?amount=${effective}&freq=${freq}&method=${method}`);
  };

  return (
    <div className="waqf-panel">
      <h2>This work is all three at once.</h2>
      <p className="waqf-panel-lede">
        A gift to Emara Academy is ongoing charity that funds beneficial
        knowledge — classes, teachers, and a community that keeps new Muslims in
        their faith long after you give it.
      </p>

      <div className="give-config">
        <div className="freq-toggle" role="group" aria-label="Donation frequency">
          <button
            type="button"
            className={freq === "once" ? "active" : ""}
            onClick={() => setFreq("once")}
          >
            Give Once
          </button>
          <button
            type="button"
            className={freq === "monthly" ? "active" : ""}
            onClick={() => setFreq("monthly")}
          >
            Give Monthly
          </button>
        </div>

        <div className="amount-grid" role="group" aria-label="Donation amount">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              className={`amount-btn ${amount === a && !custom ? "active" : ""}`}
              onClick={() => {
                setAmount(a);
                setCustom("");
              }}
            >
              ${a}
            </button>
          ))}
          <div className={`amount-custom ${custom ? "active" : ""}`}>
            <span aria-hidden="true">$</span>
            <label className="sr-only" htmlFor="give-custom">
              Custom amount
            </label>
            <input
              id="give-custom"
              type="number"
              min={1}
              placeholder="Other"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
          </div>
        </div>

        <div className="method-row" role="group" aria-label="Payment method">
          {(Object.keys(METHOD_LABELS) as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              className={`method-btn ${method === m ? "active" : ""}`}
              onClick={() => setMethod(m)}
            >
              {METHOD_LABELS[m]}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-gold donate-now"
          disabled={!validAmount}
          onClick={donateNow}
        >
          {validAmount
            ? `Donate $${effective}${freq === "monthly" ? " Monthly" : " Now"}`
            : "Choose an amount"}
        </button>
        <p className="give-flow-note">
          One more step — your details and secure payment, under a minute. We
          never see or store your card information.
        </p>

        <div className="give-progress">
          <div
            className="give-progress-bar"
            role="progressbar"
            aria-valuenow={MONTH_RAISED}
            aria-valuemin={0}
            aria-valuemax={MONTH_GOAL}
            aria-label="Raised this month toward goal"
          >
            <span
              style={{
                width: `${Math.min(100, (MONTH_RAISED / MONTH_GOAL) * 100)}%`,
              }}
            />
          </div>
          <p>
            ${MONTH_RAISED.toLocaleString()} raised this month of our $
            {MONTH_GOAL.toLocaleString()} goal ·{" "}
            <Link href="/donations">See all donations</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
