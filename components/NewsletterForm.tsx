"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  return (
    <div className="newsletter-block">
      {done ? (
        <p className="newsletter-done">
          You&rsquo;re on the list. We&rsquo;ll write when there&rsquo;s something
          worth writing about.
        </p>
      ) : (
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: store in Supabase `newsletter_subscribers` when backend lands
            setDone(true);
          }}
        >
          <label className="sr-only" htmlFor="nl-email">
            Email address
          </label>
          <input
            id="nl-email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
          <button className="btn btn-gold" type="submit">
            Subscribe
          </button>
        </form>
      )}
      <p className="newsletter-note">
        A few emails a month — classes, events, and what your support built.
        Unsubscribe anytime.
      </p>
    </div>
  );
}
