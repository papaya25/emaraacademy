"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PROGRAMS, localizeProgram, programFromRow, type Program } from "@/lib/programs";
import { getSupabase } from "@/lib/supabase";

const ACCENTS = ["a", "b", "c"] as const;

export default function ProgramShelf() {
  const t = useTranslations("shared");
  const locale = useLocale();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Real programs from Supabase; null = none yet, fall back to the static list
  const [dbPrograms, setDbPrograms] = useState<Program[] | null>(null);
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("programs")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!cancelled && !error && data && data.length) {
          setDbPrograms(data.map(programFromRow));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const programs = (dbPrograms ?? PROGRAMS).map((p) => localizeProgram(p, locale));

  return (
    <div className="shelf">
      {programs.map((p, i) => {
        const open = openSlug === p.slug;
        return (
          <div className={`book3d ${ACCENTS[i % 3]}`} key={p.slug}>
            <div className={`book3d-flip ${open ? "open" : ""}`}>
              <button
                className="book3d-face book3d-front"
                onClick={() => setOpenSlug(p.slug)}
                aria-expanded={open}
                aria-label={t("openBook", { title: p.title })}
                tabIndex={open ? -1 : 0}
                aria-hidden={open}
              >
                <span className="book3d-spine" aria-hidden="true" />
                <span className="book3d-cover">
                  <span className="book-num" aria-hidden="true">
                    {p.num}
                  </span>
                  <span className="book-cat">{p.category}</span>
                  <span className="book-title">{p.title}</span>
                  <span className="book-hint">{t("tapToOpen")}</span>
                </span>
              </button>

              <div
                className="book3d-face book3d-back"
                aria-hidden={!open}
              >
                <button
                  className="book3d-close"
                  onClick={() => setOpenSlug(null)}
                  aria-label={t("closeBook", { title: p.title })}
                  tabIndex={open ? 0 : -1}
                >
                  ×
                </button>
                <span className="book-cat">{p.category}</span>
                <h3 className="book3d-back-title">{p.title}</h3>
                <p>{p.whatItIs}</p>
                <Link href={`/programs/${p.slug}`} tabIndex={open ? 0 : -1}>
                  {t("readFullChapter")}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
