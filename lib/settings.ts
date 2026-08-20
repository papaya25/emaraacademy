"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "./supabase";

/**
 * Read one value from the `site_settings` table (key → jsonb value).
 * Returns `fallback` until the row loads — and keeps the fallback if the
 * table doesn't exist yet or the fetch fails, so the site never breaks.
 */
export function useSetting<T>(key: string, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled && !error && data?.value) setValue(data.value as T);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return value;
}
