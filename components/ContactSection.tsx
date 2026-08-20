"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

const REASONS = ["Joining a Class", "Donating", "Volunteering", "Something Else"];

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const [reason, setReason] = useState(REASONS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

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
              <span className="smallcaps">Correspondence</span>
              <h2>
                Every letter is read by a person, <em>not a system.</em>
              </h2>
              <p>
                A question about a class, a donation, or your own first steps in
                Islam — write to us, or reach us directly:
              </p>
              <div className="corr-links">
                <a
                  href="https://wa.me/525526709079?text=Assalamu%20alaikum%20%E2%80%94%20I%27d%20like%20to%20talk%20to%20someone%20at%20Emara%20Academy."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp: +52 55 2670 9079
                </a>
                <a href="mailto:info@emaraacademy.org">info@emaraacademy.org</a>
              </div>
              <p className="corr-promise">
                No pressure, and no mailing list you didn&rsquo;t ask for — just a
                real reply.
              </p>
            </div>

            {status === "sent" ? (
              <div className="corr-success">
                <p className="ar" aria-hidden="true">
                  جزاك الله خيرا
                </p>
                <h3>Your message is on its way.</h3>
                <p>
                  We&rsquo;ll reply as soon as we can — usually within a day or
                  two.
                </p>
              </div>
            ) : (
              <form className="corr-form" onSubmit={send}>
                <div>
                  <span className="corr-label">I&rsquo;m writing about</span>
                  <div className="reason-row" role="group" aria-label="Reason for writing">
                    {REASONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`reason-chip ${reason === r ? "active" : ""}`}
                        onClick={() => setReason(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="corr-fields">
                  <div>
                    <label className="corr-label" htmlFor="corr-name">
                      Name
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
                      Email
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
                    Your message
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
                  {status === "sending" ? "Sending…" : "Send Letter"}
                </button>
                {status === "error" && (
                  <p className="corr-error" role="alert">
                    Something went wrong sending your letter — please try again
                    in a moment, or reach us on WhatsApp or email above instead.
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
