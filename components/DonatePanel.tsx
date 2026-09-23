"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useSetting } from "@/lib/settings";
import { useMonthRaised } from "@/lib/donations";

const AMOUNTS = [25, 50, 100, 250];

// Fallback until site_settings loads; live goal under key `donation_month`.
const MONTH_FALLBACK = { goal: 5000 };
const RAISED_FALLBACK = 1850;

const METHODS = ["card", "paypal", "bank"] as const;
type Method = (typeof METHODS)[number];

export default function DonatePanel() {
  const t = useTranslations("donate");
  const router = useRouter();
  const month = useSetting("donation_month", MONTH_FALLBACK);
  const raised = useMonthRaised(RAISED_FALLBACK);
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
      <h2>{t("panel.title")}</h2>
      <p className="waqf-panel-lede">{t("panel.lede")}</p>

      <div className="give-config">
        <div className="freq-toggle" role="group" aria-label={t("panel.frequency")}>
          <button
            type="button"
            className={freq === "once" ? "active" : ""}
            onClick={() => setFreq("once")}
          >
            {t("panel.once")}
          </button>
          <button
            type="button"
            className={freq === "monthly" ? "active" : ""}
            onClick={() => setFreq("monthly")}
          >
            {t("panel.monthly")}
          </button>
        </div>

        <div className="amount-grid" role="group" aria-label={t("panel.amount")}>
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
              <bdi>${a}</bdi>
            </button>
          ))}
          <div className={`amount-custom ${custom ? "active" : ""}`}>
            <span aria-hidden="true">$</span>
            <label className="sr-only" htmlFor="give-custom">
              {t("panel.custom")}
            </label>
            <input
              id="give-custom"
              type="number"
              min={1}
              placeholder={t("panel.other")}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
          </div>
        </div>

        <div className="method-row" role="group" aria-label={t("panel.method")}>
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              className={`method-btn ${method === m ? "active" : ""}`}
              onClick={() => setMethod(m)}
              aria-label={t(`methods.${m}`)}
            >
              <span className="m-full">{t(`methods.${m}`)}</span>
              <span className="m-short" aria-hidden="true">
                {t(`methodsShort.${m}`)}
              </span>
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
            ? t(freq === "monthly" ? "panel.donateMonthly" : "panel.donateNow", {
                amount: String(effective),
              })
            : t("panel.choose")}
        </button>
        <p className="give-flow-note">{t("panel.note")}</p>

        <div className="give-progress">
          <div
            className="give-progress-bar"
            role="progressbar"
            aria-valuenow={raised}
            aria-valuemin={0}
            aria-valuemax={month.goal}
            aria-label={t("progressLabel")}
          >
            <span
              style={{
                width: `${Math.min(100, (raised / month.goal) * 100)}%`,
              }}
            />
          </div>
          <p>
            {t("panel.progress", {
              raised: raised.toLocaleString("en-US"),
              goal: month.goal.toLocaleString("en-US"),
            })}{" "}
            · <Link href="/donations">{t("seeAll")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
