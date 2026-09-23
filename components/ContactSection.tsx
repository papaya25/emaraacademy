"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import { useSetting } from "@/lib/settings";
import { DEFAULT_CONTACT, whatsappUrl } from "@/lib/contactInfo";
import { rich } from "@/lib/rich";

// `value` is what's stored in contact_messages.reason (the admin panel reads
// it in English); `key` is the visitor-facing label in messages/*.json.
const REASONS = [
  { value: "Joining a Class", key: "class" },
  { value: "Donating", key: "donating" },
  { value: "Volunteering", key: "volunteering" },
  { value: "Something Else", key: "other" },
] as const;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const t = useTranslations("contact.form");
  const tShared = useTranslations("shared");
  const [reason, setReason] = useState<string>(REASONS[0].value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const contact = useSetting("contact_info", DEFAULT_CONTACT);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      reason,
      message: message.trim(),
    });
    setStatus(error ? "error" : "sent");
  };

  return (
    <section className="correspondence" id="contact">
      <div className="wrap">
        <div className="corr-plate">
          <div className="corr-grid">
            <div className="corr-intro">
              <span className="smallcaps">{t("eyebrow")}</span>
              <h2>{t.rich("title", rich)}</h2>
              <p>{t("intro")}</p>
              <div className="corr-links">
                <a
                  href={whatsappUrl(contact.phone, tShared("whatsappGreeting"))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("whatsapp")} <bdi dir="ltr">{contact.phone}</bdi>
                </a>
                <a href={`mailto:${contact.email}`} dir="ltr">
                  {contact.email}
                </a>
              </div>
              <p className="corr-promise">{t("promise")}</p>
            </div>

            {status === "sent" ? (
              <div className="corr-success">
                <p className="ar" aria-hidden="true">
                  جزاك الله خيرا
                </p>
                <h3>{t("sentTitle")}</h3>
                <p>{t("sentBody")}</p>
              </div>
            ) : (
              <form className="corr-form" onSubmit={send}>
                <div>
                  <span className="corr-label">{t("writingAbout")}</span>
                  <div className="reason-row" role="group" aria-label={t("reasonGroup")}>
                    {REASONS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        className={`reason-chip ${reason === r.value ? "active" : ""}`}
                        aria-pressed={reason === r.value}
                        onClick={() => setReason(r.value)}
                      >
                        {t(`reasons.${r.key}`)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="corr-fields">
                  <div>
                    <label className="corr-label" htmlFor="corr-name">
                      {t("name")}
                    </label>
                    <input
                      id="corr-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={status === "sending"}
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
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "sending"}
                    />
                  </div>
                </div>
                <div>
                  <label className="corr-label" htmlFor="corr-message">
                    {t("message")}
                  </label>
                  <textarea
                    id="corr-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={status === "sending"}
                  />
                </div>
                <button
                  className="btn btn-green"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? t("sending") : t("send")}
                </button>
                {status === "error" && (
                  <p className="corr-error" role="alert">
                    {t("error")}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
