"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { ClassInfo } from "@/lib/classes";

/** A class added in the admin panel (Supabase `classes` row). */
export type DbClass = ClassInfo & {
  capacity?: number | null;
  // Spanish/Arabic typed in the admin panel (null = show the English)
  [translated: `${"subject" | "blurb"}_${string}`]: string | null | undefined;
};

/**
 * Real classes plus how many places each has taken (counts only — who
 * enrolled stays private). `classes` is undefined while loading and null
 * when no real classes exist yet (pages then show the sample schedule).
 */
export function useLiveClasses() {
  const [classes, setClasses] = useState<DbClass[] | null | undefined>(() =>
    getSupabase() ? undefined : null
  );
  const [taken, setTaken] = useState<Record<string, number>>({});

  const reload = useCallback(() => {
    getSupabase()
      ?.from("class_availability")
      .select("class_id,taken")
      .then(({ data, error }) => {
        if (!error && data) setTaken(Object.fromEntries(data.map((r) => [r.class_id, r.taken])));
      });
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("classes")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!cancelled) setClasses(!error && data && data.length ? (data as DbClass[]) : null);
      });
    reload();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  return { classes, taken, reload };
}

/** Same rule the database uses to put a sign-up on the waitlist. */
export function isClassFull(c: DbClass, taken: Record<string, number>): boolean {
  return c.status === "Full" || (c.capacity != null && (taken[c.id] ?? 0) >= c.capacity);
}

/** The class's text in the visitor's language (blank translation = English). */
export function localizeClass(c: DbClass, locale: string): DbClass {
  return {
    ...c,
    subject: c[`subject_${locale}`] || c.subject,
    blurb: c[`blurb_${locale}`] || c.blurb,
  };
}
