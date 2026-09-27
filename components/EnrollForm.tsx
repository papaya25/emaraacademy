"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import { rich } from "@/lib/rich";

export type EnrollClass = { id: string; subject: string; label: string; full: boolean };

type Status = "idle" | "sending" | "confirmed" | "waitlist" | "duplicate" | "error";

/**
 * Sign-up for a real (Supabase) class. The database decides confirmed vs
 * waitlist; the message shown here uses the same rule (class full or marked
 * Full) from the public availability counts.
 */
export default function EnrollForm({
  classes,
  selected,
  onSelect,
  onEnrolled,
}: {
  classes: EnrollClass[];
  selected: string;
  onSelect: (id: string) => void;
  onEnrolled: () => void;
}) {
  const t = useTranslations("classes.enroll");
  const tBoard = useTranslations("classes.board");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [doneClass, setDoneClass] = useState<EnrollClass | null>(null);

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
    onEnrolled();
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
