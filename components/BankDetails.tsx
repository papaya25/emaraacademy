"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { BANK_DETAILS } from "@/lib/bankDetails";

const ROWS = [
  { key: "bank", value: BANK_DETAILS.bank, copy: false },
  { key: "accountName", value: BANK_DETAILS.accountName, copy: true },
  { key: "accountNumber", value: BANK_DETAILS.accountNumber, copy: true },
  { key: "clabe", value: BANK_DETAILS.clabe, copy: true },
  { key: "swift", value: BANK_DETAILS.swift, copy: true },
] as const;

/** The bank-transfer option on the donate checkout. */
export default function BankDetails() {
  const t = useTranslations("donate.checkout.bank");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      // Clipboard blocked (old browser / insecure context) — the value is
      // still on screen to copy by hand.
    }
  };

  return (
    <div className="bank-details">
      <p>{t("intro")}</p>
      <dl>
        {ROWS.map((r) => (
          <div className="bank-row" key={r.key}>
            <dt>{t(r.key)}</dt>
            <dd>
              <bdi dir="ltr">{r.value}</bdi>
              {r.copy && (
                <button type="button" className="bank-copy" onClick={() => copy(r.key, r.value)}>
                  {copied === r.key ? t("copied") : t("copy")}
                </button>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="bank-reference">
        {t.rich("reference", { write: (c) => <Link href="/contact">{c}</Link> })}
      </p>
    </div>
  );
}
