"use client";

import { useState } from "react";

const AMOUNTS = [25, 50, 100, 250];
const FUNDS = [
  "Wherever it's needed most",
  "New Muslim Education",
  "Imam & Teacher Formation",
  "Community Events",
  "Mutual Aid & Emergency Fund",
  "Outdoor Retreats",
  "Inter-Community Exchange",
];

export default function DonatePanel() {
  const [freq, setFreq] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<number | "">(50);
  const [custom, setCustom] = useState("");
  const [fund, setFund] = useState(FUNDS[0]);

  const effective = custom ? Number(custom) : amount;

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

        <div className="fund-select">
          <label className="corr-label corr-label-light" htmlFor="give-fund">
            Direct this gift toward
          </label>
          <select id="give-fund" value={fund} onChange={(e) => setFund(e.target.value)}>
            {FUNDS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="give-methods">
          {/* TODO: wire to Stripe / PayPal checkout; bank details page to follow */}
          <a className="btn btn-gold" href="#contact">
            Continue with Card
          </a>
          <a className="btn btn-ghost-light" href="#contact">
            PayPal
          </a>
          <a className="btn btn-ghost-light" href="#contact">
            Bank Transfer
          </a>
        </div>
        <p className="give-summary">
          {typeof effective === "number" && effective > 0
            ? `$${effective} ${freq === "once" ? "one-time" : "monthly"} · ${fund}`
            : "Choose an amount to continue"}
          {" — payments processed securely; we never see your card details."}
        </p>
      </div>
    </div>
  );
}
