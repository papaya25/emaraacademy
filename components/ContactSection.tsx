"use client";

import { useState } from "react";

const REASONS = ["Joining a Class", "Donating", "Volunteering", "Something Else"];

export default function ContactSection() {
  const [reason, setReason] = useState(REASONS[0]);
  const [sent, setSent] = useState(false);

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
                <a href="tel:+525526709079">+52 55 2670 9079</a>
                <a href="mailto:info@emaraacademy.mx">info@emaraacademy.mx</a>
              </div>
              <p className="corr-promise">
                No pressure, and no mailing list you didn&rsquo;t ask for — just a
                real reply.
              </p>
            </div>

            {sent ? (
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
              <form
                className="corr-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: wire to Supabase/Resend when backend lands
                  setSent(true);
                }}
              >
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
                    <input id="corr-name" type="text" required autoComplete="name" />
                  </div>
                  <div>
                    <label className="corr-label" htmlFor="corr-email">
                      Email
                    </label>
                    <input id="corr-email" type="email" required autoComplete="email" />
                  </div>
                </div>
                <div>
                  <label className="corr-label" htmlFor="corr-message">
                    Your message
                  </label>
                  <textarea id="corr-message" required rows={5} />
                </div>
                <button className="btn btn-green" type="submit">
                  Send Letter
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
