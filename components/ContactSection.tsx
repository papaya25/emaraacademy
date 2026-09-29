"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import { displayValue } from "@/lib/i18nDisplay";
import { isClassFull, localizeClass, useLiveClasses } from "@/lib/liveClasses";

// What the visitor is writing about. "student" signs up for a class
// (`enrollments`), the four team roles go to `registrations`, and "other" is
// a plain message (`contact_messages`, reason stored as "Something Else").
const ROLES = ["student", "teacher", "translator", "photographer", "volunteer"] as const;
type Mode = (typeof ROLES)[number] | "other";

type Status = "idle" | "sending" | "sent" | "waitlist" | "duplicate" | "error";

export default function ContactSection() {
  const t = useTranslations("contact.form");
  const tEnroll = useTranslations("classes.enroll");
  const tBoard = useTranslations("classes.board");
  const locale = useLocale();
  const params = useSearchParams();

  // Arriving from a class card or the calendar (?class=…) opens the student
  // registration with that class chosen.
  const [mode, setMode] = useState<Mode>(params.get("class") ? "student" : "other");
  const [classId, setClassId] = useState(params.get("class") ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [doneClass, setDoneClass] = useState("");

  useEffect(() => {
    if (!params.get("class")) return;
    // After the page's own scroll-to-top on arrival.
    const id = setTimeout(
      () => document.getElementById("contact-form")?.scrollIntoView({ behavior: "instant" }),
      150
    );
    return () => clearTimeout(id);
  }, [params]);

  const { classes: live, taken, reload } = useLiveClasses();
  const show = (kind: Parameters<typeof displayValue>[0], v: string | null) =>
    v ? displayValue(kind, v, locale) : "";
  const classOptions = (live ?? []).map((raw) => {
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
  const chosen = classOptions.find((c) => c.id === classId);
  const noClasses = mode === "student" && live !== undefined && classOptions.length === 0;

  const choose = (m: Mode) => {
    setMode(m);
    setStatus("idle");
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || (mode === "student" && !chosen)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const person = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
    let error;
    if (mode === "student") {
      ({ error } = await supabase
        .from("enrollments")
        .insert({ ...person, whatsapp: whatsapp.trim(), class_id: chosen!.id, locale }));
    } else if (mode === "other") {
      ({ error } = await supabase
        .from("contact_messages")
        .insert({ ...person, reason: "Something Else", message: message.trim() }));
    } else {
      ({ error } = await supabase.from("registrations").insert({
        ...person,
        role: mode,
        whatsapp: whatsapp.trim(),
        message: message.trim() || null,
        locale,
      }));
    }
    if (error) {
      setStatus(mode === "student" && error.code === "23505" ? "duplicate" : "error");
      return;
    }
    if (mode === "student") {
      setDoneClass(chosen!.subject);
      reload();
      setStatus(chosen!.full ? "waitlist" : "sent");
    } else {
      setStatus("sent");
    }
  };

  const sending = status === "sending";
  const done = status === "sent" || status === "waitlist";

  return (
    <section className="correspondence" id="contact">
      <div className="wrap">
        <div className="corr-plate" id="contact-form">
          <h2 className="corr-join-title">{t("joinTitle")}</h2>

          <div>
            <span className="corr-label">{t("writingAbout")}</span>
            <div className="reason-row" role="group" aria-label={t("reasonGroup")}>
              {[...ROLES, "other" as const].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`reason-chip ${mode === m ? "active" : ""}`}
                  aria-pressed={mode === m}
                  onClick={() => choose(m)}
                >
                  {m === "other" ? t("reasons.other") : t(`roles.${m}`)}
                </button>
              ))}
            </div>
          </div>

          {done ? (
            <div className="corr-success" role="status">
              <p className="ar" aria-hidden="true">
                جزاك الله خيرا
              </p>
              {mode === "student" ? (
                <>
                  <h3>{status === "sent" ? tEnroll("successTitle") : tEnroll("waitlistTitle")}</h3>
                  <p>
                    {status === "sent"
                      ? tEnroll("successBody", { class: doneClass })
                      : tEnroll("waitlistBody", { class: doneClass })}
                  </p>
                </>
              ) : mode === "other" ? (
                <>
                  <h3>{t("sentTitle")}</h3>
                  <p>{t("sentBody")}</p>
                </>
              ) : (
                <>
                  <h3>{t("roleSentTitle")}</h3>
                  <p>{t("roleSentBody")}</p>
                </>
              )}
            </div>
          ) : noClasses ? (
            <p className="corr-note">{t("noClasses")}</p>
          ) : (
            <form className="corr-form" onSubmit={send}>
              {mode === "student" && (
                <div>
                  <label className="corr-label" htmlFor="corr-class">
                    {tEnroll("class")}
                  </label>
                  <select
                    id="corr-class"
                    required
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    disabled={sending}
                  >
                    <option value="" disabled>
                      {tEnroll("choose")}
                    </option>
                    {classOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full ? `${c.label} (${tEnroll("waitlistTag")})` : c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="corr-fields">
                <div>
                  <label className="corr-label" htmlFor="corr-name">
                    {t("name")}
                  </label>
                  <input
                    id="corr-name"
                    type="text"
                    required
                    maxLength={200}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={sending}
                  />
                </div>
                <div>
                  <label className="corr-label" htmlFor="corr-email">
                    {t("email")}
                  </label>
                  <input
                    id="corr-email"
                    type="email"
                    required
                    maxLength={320}
                    autoComplete="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={sending}
                  />
                </div>
              </div>
              {mode !== "other" && (
                <div>
                  <label className="corr-label" htmlFor="corr-whatsapp">
                    {tEnroll("whatsapp")}
                  </label>
                  <input
                    id="corr-whatsapp"
                    type="tel"
                    required
                    minLength={5}
                    maxLength={40}
                    autoComplete="tel"
                    dir="ltr"
                    aria-describedby="corr-whatsapp-hint"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    disabled={sending}
                  />
                  <p className="enroll-hint" id="corr-whatsapp-hint">
                    {tEnroll("whatsappHint")}
                  </p>
                </div>
              )}
              {mode !== "student" && (
                <div>
                  <label className="corr-label" htmlFor="corr-message">
                    {mode === "other" ? t("message") : t("aboutYou")}
                  </label>
                  <textarea
                    id="corr-message"
                    required={mode === "other"}
                    maxLength={4000}
                    rows={mode === "other" ? 5 : 3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={sending}
                  />
                </div>
              )}
              <button className="btn btn-green" type="submit" disabled={sending}>
                {sending
                  ? t("sending")
                  : mode === "other"
                    ? t("send")
                    : mode === "student" && chosen?.full
                      ? tBoard("joinWaitlist")
                      : t("register")}
              </button>
              {(status === "error" || status === "duplicate") && (
                <p className="corr-error" role="alert">
                  {status === "duplicate" ? tEnroll("duplicate") : t("error")}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
