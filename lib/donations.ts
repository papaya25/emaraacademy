"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "./supabase";

/**
 * This calendar month's donation total, live from the `monthly_donation_total`
 * view (a public aggregate over the private `donations` table — no donor data
 * is ever exposed). Falls back to `fallback` until it loads or if it fails.
 */
export function useMonthRaised(fallback: number): number {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("monthly_donation_total")
      .select("raised")
      .maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled && !error && data) setValue(Number(data.raised));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return value;
}
