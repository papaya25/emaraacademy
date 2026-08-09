"use client";

import { useState } from "react";
import Link from "next/link";
import { CLASSES, CLASS_CITIES } from "@/lib/classes";

const WHATSAPP_URL =
  "https://wa.me/525526709079?text=" +
  encodeURIComponent(
    "Assalamu alaikum — I'd like to join a class at Emara Academy."
  );

export default function ClassesBoard() {
  const [city, setCity] = useState(CLASS_CITIES[0]);

  const visible =
    city === "All Cities" ? CLASSES : CLASSES.filter((c) => c.city === city);

  return (
    <div>
      <div className="evb-cities classes-filter" role="group" aria-label="Filter by city">
        {CLASS_CITIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`reason-chip ${city === c ? "active" : ""}`}
            onClick={() => setCity(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="class-list">
        {visible.map((c) => (
          <article className="class-card" key={c.id}>
            <div className="class-card-head">
              <span className={`class-status s-${c.status.replace(/\s/g, "").toLowerCase()}`}>
                {c.status}
              </span>
              <span className="class-track">{c.track}</span>
            </div>
            <h3>{c.subject}</h3>
            <p className="class-blurb">{c.blurb}</p>
            <dl className="class-meta">
              <div>
                <dt>Where</dt>
                <dd>
                  {c.city}
                  {c.format === "Online" ? "" : ` · ${c.format}`}
                </dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>
                  {c.day} · {c.time}
                </dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{c.language}</dd>
              </div>
            </dl>
            <div className="class-actions">
              {c.status === "Full" ? (
                <Link className="btn btn-ghost class-btn" href="/contact">
                  Join the Waitlist
                </Link>
              ) : (
                <>
                  <Link className="btn btn-green class-btn" href="/contact">
                    Reserve a Spot
                  </Link>
                  <a
                    className="btn btn-ghost class-btn"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ask on WhatsApp
                  </a>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      <p className="evb-note">
        Sample schedule shown while our first season is being planned — real
        classes, times, and cities will replace it as cohorts open.
      </p>
    </div>
  );
}
