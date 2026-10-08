"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import { HEARD_FROM, MAX_COPIES, MX_STATES, RELATIONS } from "@/lib/coranCampaign";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY = {
  name: "", age: "", phone: "", email: "", street: "", extInt: "", colonia: "",
  postalCode: "", city: "", state: "", refs: "", quantity: "1", firstQuran: "",
  relation: "", heardFrom: "", reason: "", comments: "",
  website: "", // invisible to people; bots fill it in → silently dropped
};

/** "Un Corán para ti" request — the site's own version of the owner's Google
 *  Form (same fields + copies and two statistics questions), no sign-in. */
export default function CoranRequestForm() {
  const t = useTranslations("coran.form");
  const locale = useLocale();
  const [f, setF] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));
  const sending = status === "sending";

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.website) {
      setStatus("sent"); // a bot — pretend it worked, store nothing
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return setStatus("error");
    setStatus("sending");
    const opt = (v: string) => v.trim() || null;
    const { error } = await supabase.from("coran_requests").insert({
      name: f.name.trim(),
      age: Number(f.age),
      phone: f.phone.trim(),
      email: f.email.trim().toLowerCase(),
      street: f.street.trim(),
      ext_int_number: f.extInt.trim(),
      colonia: f.colonia.trim(),
      postal_code: f.postalCode.trim(),
      city: f.city.trim(),
      state: f.state,
      address_refs: f.refs.trim(),
      quantity: Number(f.quantity),
      first_quran: f.firstQuran === "" ? null : f.firstQuran === "yes",
      relation: opt(f.relation),
      heard_from: opt(f.heardFrom),
      reason: opt(f.reason),
      comments: opt(f.comments),
      locale,
    });
    setStatus(error ? "error" : "sent");
  };

  if (status === "sent") {
    return (
      <div className="corr-success coran-sent" role="status">
        <p className="ar" aria-hidden="true">
          جزاك الله خيرا
        </p>
        <h3>{t("sentTitle")}</h3>
        <p>{t("sentBody")}</p>
        <button
          type="button"
          className="btn btn-ghost enroll-again"
          onClick={() => {
            setF(EMPTY);
            setStatus("idle");
          }}
        >
          {t("another")}
        </button>
      </div>
    );
  }

  const text = (k: keyof typeof EMPTY, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => (
    <div>
      <label className="corr-label" htmlFor={`cr-${k}`}>
        {label}
      </label>
      <input id={`cr-${k}`} value={f[k]} onChange={set(k)} disabled={sending} required aria-describedby={hint ? `cr-${k}-hint` : undefined} {...props} />
      {hint && (
        <p className="enroll-hint" id={`cr-${k}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
  const choice = (k: keyof typeof EMPTY, label: string, options: readonly string[], optionLabel: (o: string) => string, required = false) => (
    <div>
      <label className="corr-label" htmlFor={`cr-${k}`}>
        {label} {!required && <span className="corr-optional">{t("optional")}</span>}
      </label>
      <select id={`cr-${k}`} value={f[k]} onChange={set(k)} disabled={sending} required={required}>
        <option value="">{k === "state" ? t("chooseState") : t("choose")}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {optionLabel(o)}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form className="corr-form coran-request" onSubmit={send}>
      <div className="corr-fields">
        {text("name", t("name"), { maxLength: 200, autoComplete: "name" })}
        {text("age", t("age"), { type: "number", min: 5, max: 120, inputMode: "numeric" })}
      </div>
      <div className="corr-fields">
        {text("phone", t("phone"), { type: "tel", minLength: 7, maxLength: 40, autoComplete: "tel", dir: "ltr" }, t("phoneHint"))}
        {text("email", t("email"), { type: "email", maxLength: 320, autoComplete: "email", dir: "ltr" })}
      </div>

      <h3 className="coran-form-subtitle">{t("addressTitle")}</h3>
      {text("street", t("street"), { maxLength: 200, autoComplete: "address-line1" })}
      <div className="corr-fields">
        {text("extInt", t("extInt"), { maxLength: 60 })}
        {text("colonia", t("colonia"), { maxLength: 120 })}
      </div>
      <div className="corr-fields">
        {text("postalCode", t("postalCode"), {
          inputMode: "numeric", pattern: "[0-9]{5}", maxLength: 5, autoComplete: "postal-code", dir: "ltr", title: t("postalError"),
        })}
        {text("city", t("city"), { maxLength: 120, autoComplete: "address-level2" })}
      </div>
      {choice("state", t("state"), MX_STATES, (s) => s, true)}
      {text("refs", t("refs"), { maxLength: 500 }, t("refsHint"))}

      <div className="corr-fields">
        <div>
          <label className="corr-label" htmlFor="cr-quantity">
            {t("quantity")}
          </label>
          <select id="cr-quantity" value={f.quantity} onChange={set("quantity")} disabled={sending} aria-describedby="cr-quantity-hint">
            {Array.from({ length: MAX_COPIES }, (_, i) => String(i + 1)).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <p className="enroll-hint" id="cr-quantity-hint">
            {t("quantityHint")}
          </p>
        </div>
        <fieldset className="coran-yesno" disabled={sending}>
          <legend className="corr-label">
            {t("firstQuran")} <span className="corr-optional">{t("optional")}</span>
          </legend>
          {(["yes", "no"] as const).map((v) => (
            <label key={v}>
              <input type="radio" name="firstQuran" value={v} checked={f.firstQuran === v} onChange={set("firstQuran")} />
              {t(v)}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="corr-fields">
        {choice("relation", t("relation"), RELATIONS, (r) => t(`relations.${r}`))}
        {choice("heardFrom", t("heardFrom"), HEARD_FROM, (h) => t(`heard.${h}`))}
      </div>

      <div>
        <label className="corr-label" htmlFor="cr-reason">
          {t("reason")} <span className="corr-optional">{t("optional")}</span>
        </label>
        <textarea id="cr-reason" rows={3} maxLength={2000} value={f.reason} onChange={set("reason")} disabled={sending} aria-describedby="cr-reason-hint" />
        <p className="enroll-hint" id="cr-reason-hint">
          {t("reasonHint")}
        </p>
      </div>
      <div>
        <label className="corr-label" htmlFor="cr-comments">
          {t("comments")} <span className="corr-optional">{t("optional")}</span>
        </label>
        <textarea id="cr-comments" rows={2} maxLength={2000} value={f.comments} onChange={set("comments")} disabled={sending} />
      </div>

      {/* Spam trap: hidden from people and screen readers. */}
      <input className="coran-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set("website")} />

      <p className="coran-privacy">{t("privacy")}</p>
      <button className="btn btn-green" type="submit" disabled={sending}>
        {sending ? t("sending") : t("submit")}
      </button>
      {status === "error" && (
        <p className="corr-error" role="alert">
          {t("error")}
        </p>
      )}
    </form>
  );
}
