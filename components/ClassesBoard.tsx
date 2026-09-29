"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CLASSES, CLASS_CITIES, type ClassInfo } from "@/lib/classes";
import { CLASSES_AR } from "@/lib/classes.ar";
import { CLASSES_ES } from "@/lib/classes.es";
import { displayValue } from "@/lib/i18nDisplay";
import { isClassFull, localizeClass, useLiveClasses } from "@/lib/liveClasses";
import CityFilter from "@/components/CityFilter";
import WhatsAppLink from "@/components/WhatsAppLink";

const ALL = CLASS_CITIES[0];

/** The class cards with a city filter; a card's Enroll button opens the
 *  registration on the contact page with that class chosen. */
export default function ClassesBoard() {
  const t = useTranslations("classes.board");
  const locale = useLocale();
  const show = (kind: Parameters<typeof displayValue>[0], v: string) => displayValue(kind, v, locale);
  const cityLabel = (c: string) => (c === ALL ? t("allCities") : show("city", c));
  const [city, setCity] = useState<string>(ALL);

  // Real classes from Supabase; until they exist, the sample list shows.
  const { classes, taken } = useLiveClasses();
  const dbClasses = classes ?? null;

  const isLive = dbClasses !== null;

  // Real classes use the Spanish/Arabic typed in the admin panel (blank =
  // English); the sample classes have hand-written translations.
  const sampleText = locale === "ar" ? CLASSES_AR : locale === "es" ? CLASSES_ES : null;
  const list: ClassInfo[] = dbClasses
    ? dbClasses.map((c) => localizeClass(c, locale))
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

  const capacityOf = (id: string) => dbClasses?.find((c) => c.id === id)?.capacity ?? null;
  const isFull = (c: ClassInfo) => isClassFull({ ...c, capacity: capacityOf(c.id) }, taken);

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
            {isLive && capacityOf(c.id) !== null && (
              <p className="class-places">
                {isFull(c)
                  ? t("fullWaitlist")
                  : t("placesLeft", { count: capacityOf(c.id)! - (taken[c.id] ?? 0) })}
              </p>
            )}
            <div className="class-actions">
              {isLive ? (
                <>
                  <Link
                    className={`btn ${isFull(c) ? "btn-ghost" : "btn-green"} class-btn`}
                    href={{ pathname: "/contact", query: { class: c.id } }}
                  >
                    {isFull(c) ? t("joinWaitlist") : t("enroll")}
                  </Link>
                  <WhatsAppLink className="btn btn-ghost class-btn" message={t("whatsappMessage")}>
                    {t("askWhatsapp")}
                  </WhatsAppLink>
                </>
              ) : c.status === "Full" ? (
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
