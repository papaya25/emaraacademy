"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CLASSES, CLASS_CITIES, type ClassInfo } from "@/lib/classes";
import { CLASSES_AR } from "@/lib/classes.ar";
import { CLASSES_ES } from "@/lib/classes.es";
import { displayValue } from "@/lib/i18nDisplay";
import { getSupabase } from "@/lib/supabase";
import CityFilter from "@/components/CityFilter";
import WhatsAppLink from "@/components/WhatsAppLink";

const ALL = CLASS_CITIES[0];

type DbClass = ClassInfo & {
  [translated: `${"subject" | "blurb"}_${string}`]: string | null | undefined;
};

export default function ClassesBoard() {
  const t = useTranslations("classes.board");
  const locale = useLocale();
  const show = (kind: Parameters<typeof displayValue>[0], v: string) => displayValue(kind, v, locale);
  const cityLabel = (c: string) => (c === ALL ? t("allCities") : show("city", c));
  const [city, setCity] = useState<string>(ALL);

  // Real classes from Supabase; null = none yet, fall back to the sample list
  const [dbClasses, setDbClasses] = useState<DbClass[] | null>(null);
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("classes")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!cancelled && !error && data && data.length) {
          setDbClasses(data as DbClass[]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isLive = dbClasses !== null;
  // Real classes use the Spanish/Arabic typed in the admin panel (blank =
  // English); the sample classes have hand-written translations.
  const sampleText = locale === "ar" ? CLASSES_AR : locale === "es" ? CLASSES_ES : null;
  const list: ClassInfo[] = dbClasses
    ? dbClasses.map((c) => ({
        ...c,
        subject: c[`subject_${locale}`] || c.subject,
        blurb: c[`blurb_${locale}`] || c.blurb,
      }))
    : sampleText
      ? CLASSES.map((c) => ({ ...c, ...sampleText[c.id] }))
      : CLASSES;

  const cities = useMemo(() => {
    if (!dbClasses) return CLASS_CITIES;
    const unique = [...new Set(dbClasses.map((c) => c.city))];
    return [ALL, ...unique.sort()];
  }, [dbClasses]);

  const visible =
    city === ALL ? list : list.filter((c) => c.city === city);

  return (
    <div>
      <div className="classes-filter">
        <CityFilter
          cities={cities}
          value={city}
          label={t("filterCity")}
          labelOf={cityLabel}
          onChange={setCity}
        />
      </div>

      <div className="class-list">
        {visible.map((c) => (
          <article className="class-card" key={c.id}>
            <div className="class-card-head">
              <span className={`class-status s-${c.status.replace(/\s/g, "").toLowerCase()}`}>
                {show("status", c.status)}
              </span>
              <span className="class-track">{show("track", c.track)}</span>
            </div>
            <h3>{c.subject}</h3>
            <p className="class-blurb">{c.blurb}</p>
            <dl className="class-meta">
              <div>
                <dt>{t("where")}</dt>
                <dd>
                  {cityLabel(c.city)}
                  {c.format === "Online" ? "" : ` · ${show("format", c.format)}`}
                  {c.location && (
                    <>
                      <br />
                      {c.location}
                    </>
                  )}
                </dd>
              </div>
              <div>
                <dt>{t("when")}</dt>
                <dd>
                  {show("day", c.day)} · <bdi>{c.time}</bdi>
                </dd>
              </div>
              <div>
                <dt>{t("language")}</dt>
                <dd>{show("language", c.language)}</dd>
              </div>
            </dl>
            <div className="class-actions">
              {c.status === "Full" ? (
                <Link className="btn btn-ghost class-btn" href="/contact">
                  {t("waitlist")}
                </Link>
              ) : (
                <>
                  <Link className="btn btn-green class-btn" href="/contact">
                    {t("reserve")}
                  </Link>
                  <WhatsAppLink className="btn btn-ghost class-btn" message={t("whatsappMessage")}>
                    {t("askWhatsapp")}
                  </WhatsAppLink>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {!isLive && (
        <p className="evb-note">
          {t("note")}
        </p>
      )}
    </div>
  );
}
