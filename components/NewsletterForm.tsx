"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

type Status = "idle" | "sending" | "done" | "already" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });
    if (!error) {
      setStatus("done");
    } else if (error.code === "23505") {
      // unique violation — already subscribed
      setStatus("already");
    } else {
      setStatus("error");
    }
  };

  if (status === "done" || status === "already") {
    return (
      <div className="newsletter-block">
        <p className="newsletter-done">
          {status === "done"
            ? "You're on the list. We'll write when there's something worth writing about."
            : "You're already on the list — nothing more to do."}
        </p>
      </div>
    );
  }

  return (
    <div className="newsletter-block">
      <form className="newsletter-form" onSubmit={subscribe}>
        <label className="sr-only" htmlFor="nl-email">
          Email address
        </label>
        <input
          id="nl-email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
        />
        <button className="btn btn-gold" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      <p className="newsletter-note">
        {status === "error"
          ? "Something went wrong on our side — please try again in a moment, or write to us directly."
          : "A few emails a month — classes, events, and what your support built. Unsubscribe anytime."}
      </p>
    </div>
  );
}
