"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import { displayValue } from "@/lib/i18nDisplay";
import { isClassFull, localizeClass, useLiveClasses } from "@/lib/liveClasses";
import { rich } from "@/lib/rich";

type EnrollClass = { id: string; subject: string; label: string; full: boolean };

type Status = "idle" | "sending" | "confirmed" | "waitlist" | "duplicate" | "error";

/**
 * Sign-up for a real (Supabase) class, under the class list on /classes.
 * The chosen class comes from the page (a card's Enroll button, or
 * `?class=<id>` from the calendar). The database decides confirmed vs
 * waitlist; the message shown here uses the same rule from the public
 * availability counts.
 */
export default function EnrollForm({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("classes.enroll");
  const tBoard = useTranslations("classes.board");
  const locale = useLocale();
  const { classes: live, taken, reload } = useLiveClasses();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [doneClass, setDoneClass] = useState<EnrollClass | null>(null);

  const show = (kind: Parameters<typeof displayValue>[0], v: string | null) =>
    v ? displayValue(kind, v, locale) : "";
  const classes: EnrollClass[] = (live ?? []).map((raw) => {
    const c = localizeClass(raw, locale);
    return {
      id: c.id,
      subject: c.subject,
      label: [c.subject, [show("day", c.day), c.time].filter(Boolean).join(" · "), show("city", c.city)]
        .filter(Boolean)
        .join(" — "),
      full: isClassFull(raw, taken),
    };
  });
  const chosen = classes.find((c) => c.id === selected);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !chosen) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("enrollments").insert({
      class_id: chosen.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      locale,
    });
    if (error) {
      setStatus(error.code === "23505" ? "duplicate" : "error");
      return;
    }
    setDoneClass(chosen);
    setStatus(chosen.full ? "waitlist" : "confirmed");
    reload();
  };

  const done = status === "confirmed" || status === "waitlist";

  return (
    <div className="enroll" id="enroll">
      <div className="corr-plate">
        <div className="corr-grid">
          <div className="corr-intro">
            <span className="smallcaps">{t("eyebrow")}</span>
            <h2>{t.rich("title", rich)}</h2>
            <p>{t("lede")}</p>
          </div>

          {done && doneClass ? (
            <div className="corr-success" role="status">
              <p className="ar" aria-hidden="true">
                أهلًا وسهلًا
              </p>
              <h3>{status === "confirmed" ? t("successTitle") : t("waitlistTitle")}</h3>
              <p>
                {status === "confirmed"
                  ? t("successBody", { class: doneClass.subject })
                  : t("waitlistBody", { class: doneClass.subject })}
              </p>
              <button
                type="button"
                className="btn btn-ghost enroll-again"
                onClick={() => setStatus("idle")}
              >
                {t("another")}
              </button>
            </div>
          ) : (
            <form className="corr-form" onSubmit={submit}>
              <div>
                <label className="corr-label" htmlFor="enroll-class">
                  {t("class")}
                </label>
                <select
                  id="enroll-class"
                  required
                  value={selected}
                  onChange={(e) => onSelect(e.target.value)}
                  disabled={status === "sending"}
                >
                  <option value="" disabled>
                    {t("choose")}
                  </option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full ? `${c.label} (${t("waitlistTag")})` : c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="corr-fields">
                <div>
                  <label className="corr-label" htmlFor="enroll-name">
                    {t("name")}
                  </label>
                  <input
                    id="enroll-name"
                    type="text"
                    required
                    maxLength={200}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={status === "sending"}
                  />
                </div>
                <div>
                  <label className="corr-label" htmlFor="enroll-email">
                    {t("email")}
                  </label>
                  <input
                    id="enroll-email"
                    type="email"
                    required
                    maxLength={320}
                    autoComplete="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "sending"}
                  />
                </div>
              </div>
              <div>
                <label className="corr-label" htmlFor="enroll-whatsapp">
                  {t("whatsapp")}
                </label>
                <input
                  id="enroll-whatsapp"
                  type="tel"
                  required
                  minLength={5}
                  maxLength={40}
                  autoComplete="tel"
                  dir="ltr"
                  aria-describedby="enroll-whatsapp-hint"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  disabled={status === "sending"}
                />
                <p className="enroll-hint" id="enroll-whatsapp-hint">
                  {t("whatsappHint")}
                </p>
              </div>
              <button className="btn btn-green" type="submit" disabled={status === "sending"}>
                {status === "sending"
                  ? t("submitting")
                  : chosen?.full
                    ? tBoard("joinWaitlist")
                    : t("submit")}
              </button>
              {(status === "error" || status === "duplicate") && (
                <p className="corr-error" role="alert">
                  {status === "duplicate" ? t("duplicate") : t("error")}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
