"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import CityFilter from "@/components/CityFilter";
import { displayValue } from "@/lib/i18nDisplay";
import { Link } from "@/i18n/routing";
import { localizeClass, useLiveClasses, type DbClass } from "@/lib/liveClasses";

type EventType = "weekly" | "monthly" | "quarterly" | "special";

type DbEvent = {
  id: string;
  title: string;
  meta: string | null;
  city: string | null;
  type: string;
  event_date: string; // YYYY-MM-DD
  time: string | null;
  location: string | null;
  presenter: string | null;
  // Spanish/Arabic typed in the admin panel (null = show the English)
  [translated: `${"title" | "meta"}_${string}`]: string | null | undefined;
};

const EVENT_TYPES: EventType[] = ["weekly", "monthly", "quarterly", "special"];

type CalEvent = {
  type: EventType;
  title: string;
  meta: string;
  city: string | null; // null = shown for every city (e.g. Islamic dates)
  time?: string | null;
  location?: string | null;
  presenter?: string | null;
  classId?: string; // set for a weekly class — the day panel links to its sign-up
};

/** Filter value meaning "no city filter" — never shown directly. */
const ALL = "All Cities";
const CITIES = [ALL, "Playa del Carmen", "Cancún"];

/**
 * Approximate Islamic dates (confirmed by moon sighting closer to the day).
 * Keyed as `${year}-${month}-${day}` with month 0-indexed.
 * TODO: replace with real, admin-managed dates once events live in Supabase.
 */
const SPECIAL_DATES: Record<string, "ramadan" | "eidFitr" | "eidAdha"> = {
  "2026-1-18": "ramadan",
  "2026-2-20": "eidFitr",
  "2026-4-27": "eidAdha",
  "2027-1-8": "ramadan",
  "2027-2-10": "eidFitr",
  "2027-4-17": "eidAdha",
};

/** Weekday (0 = Sunday) of a class's free-text day, e.g. "Thursdays" or
 *  "jueves"; null when it can't be read (the class then isn't placed). */
const WEEKDAYS = [
  ["sun", "dom"],
  ["mon", "lun"],
  ["tue", "mar"],
  ["wed", "mié", "mie"],
  ["thu", "jue"],
  ["fri", "vie"],
  ["sat", "sáb", "sab"],
];
function weekdayOf(day: string | null): number | null {
  const d = (day ?? "").trim().toLowerCase();
  const i = WEEKDAYS.findIndex((names) => names.some((n) => d.startsWith(n)));
  return i === -1 ? null : i;
}

/** Every date in the month when a weekly class meets. */
function classesForMonth(year: number, month: number, classes: DbClass[], locale: string) {
  const map: Record<number, CalEvent[]> = {};
  const days = new Date(year, month + 1, 0).getDate();
  for (const raw of classes) {
    const wd = weekdayOf(raw.day);
    if (wd === null) continue;
    const c = localizeClass(raw, locale);
    for (let d = 1; d <= days; d++) {
      if (new Date(year, month, d).getDay() !== wd) continue;
      (map[d] ||= []).push({
        type: "weekly",
        title: c.subject,
        meta: "",
        city: c.city,
        time: c.time,
        location: c.location,
        classId: c.id,
      });
    }
  }
  return map;
}

/** Visitor-language text for the sample schedule (the `events.board.sample` messages). */
type SampleText = Record<
  | "classTitle" | "classMeta" | "nightTitle" | "nightMeta" | "retreatTitle"
  | "retreatMeta" | "approx" | "ramadan" | "eidFitr" | "eidAdha",
  string
>;

/**
 * Illustrative recurring schedule until real events live in Supabase:
 * Thursdays = weekly class, 3rd Saturday = community night (Playa del Carmen),
 * 1st Saturday = community night (Cancún), 2nd Sunday of Mar/Jun/Sep/Dec = retreat.
 */
function eventsForMonth(
  year: number,
  month: number,
  text: SampleText
): Record<number, CalEvent[]> {
  const days = new Date(year, month + 1, 0).getDate();
  const map: Record<number, CalEvent[]> = {};
  let satCount = 0;
  let sunCount = 0;

  const push = (d: number, ev: CalEvent) => {
    (map[d] ||= []).push(ev);
  };

  for (let d = 1; d <= days; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 4) {
      push(d, {
        type: "weekly",
        title: text.classTitle,
        meta: text.classMeta,
        city: "Playa del Carmen",
      });
    }
    if (dow === 6) {
      satCount++;
      if (satCount === 1) {
        push(d, {
          type: "monthly",
          title: text.nightTitle,
          meta: text.nightMeta,
          city: "Cancún",
        });
      }
      if (satCount === 3) {
        push(d, {
          type: "monthly",
          title: text.nightTitle,
          meta: text.nightMeta,
          city: "Playa del Carmen",
        });
      }
    }
    if (dow === 0) {
      sunCount++;
      if (sunCount === 2 && [2, 5, 8, 11].includes(month)) {
        push(d, {
          type: "quarterly",
          title: text.retreatTitle,
          meta: text.retreatMeta,
          city: "Playa del Carmen",
        });
      }
    }
    const special = SPECIAL_DATES[`${year}-${month}-${d}`];
    if (special) {
      push(d, { type: "special", title: text[special], meta: text.approx, city: null });
    }
  }
  return map;
}

export default function EventsBoard() {
  const t = useTranslations("events.board");
  const locale = useLocale();
  const months = t.raw("months") as string[];
  const dow = t.raw("dow") as string[];
  const sampleText = t.raw("sample") as SampleText;
  const cityLabel = (c: string) => (c === ALL ? t("allCities") : displayValue("city", c, locale));
  const typeLabel = (type: EventType) => t(`types.${type}`);
  const [city, setCity] = useState(ALL);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selected, setSelected] = useState<number | null>(null);

  // Real events from Supabase; null = none yet, fall back to the sample schedule
  const [dbEvents, setDbEvents] = useState<DbEvent[] | null>(null);
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("events")
      .select("*")
      .then(({ data, error }) => {
        if (!cancelled && !error && data && data.length) setDbEvents(data as DbEvent[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Real classes also appear, every week on their day.
  const tClasses = useTranslations("classes.board");
  const { classes } = useLiveClasses();
  const liveClasses = classes ?? null;

  const isLive = dbEvents !== null || liveClasses !== null;

  const cities = useMemo(() => {
    if (!isLive) return CITIES;
    const all = [...(dbEvents ?? []).map((e) => e.city), ...(liveClasses ?? []).map((c) => c.city)];
    const unique = [...new Set(all.filter((c): c is string => !!c))];
    return [ALL, ...unique.sort()];
  }, [isLive, dbEvents, liveClasses]);

  const events = useMemo(() => {
    if (isLive) {
      const map = classesForMonth(cursor.year, cursor.month, liveClasses ?? [], locale);
      if (city !== ALL) {
        for (const d of Object.keys(map)) {
          map[Number(d)] = map[Number(d)].filter((e) => e.city === city);
          if (!map[Number(d)].length) delete map[Number(d)];
        }
      }
      // Approximate Ramadan/Eid dates show for every city, live or sample.
      const days = new Date(cursor.year, cursor.month + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const special = SPECIAL_DATES[`${cursor.year}-${cursor.month}-${d}`];
        if (special) {
          (map[d] ||= []).push({
            type: "special",
            title: sampleText[special],
            meta: sampleText.approx,
            city: null,
          });
        }
      }
      for (const ev of dbEvents ?? []) {
        const [y, m, d] = ev.event_date.split("-").map(Number);
        if (y !== cursor.year || m - 1 !== cursor.month) continue;
        if (city !== ALL && ev.city !== null && ev.city !== city) continue;
        const type = (EVENT_TYPES as string[]).includes(ev.type)
          ? (ev.type as EventType)
          : "monthly";
        (map[d] ||= []).push({
          type,
          title: ev[`title_${locale}`] || ev.title,
          meta: ev[`meta_${locale}`] || ev.meta || "",
          city: ev.city,
          time: ev.time,
          location: ev.location,
          presenter: ev.presenter,
        });
      }
      return map;
    }
    const all = eventsForMonth(cursor.year, cursor.month, sampleText);
    if (city === ALL) return all;
    const filtered: Record<number, CalEvent[]> = {};
    for (const [d, list] of Object.entries(all)) {
      const keep = list.filter((e) => e.city === null || e.city === city);
      if (keep.length) filtered[Number(d)] = keep;
    }
    return filtered;
  }, [isLive, dbEvents, liveClasses, city, cursor, sampleText, locale]);

  const firstDow = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();

  const shiftMonth = (delta: number) => {
    setSelected(null);
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const selectedEvents = selected != null ? events[selected] : undefined;

  return (
    <div className="evb">
      <div className="evb-toolbar">
        <CityFilter
          cities={cities}
          value={city}
          label={t("filterCity")}
          labelOf={cityLabel}
          onChange={(c) => {
            setCity(c);
            setSelected(null);
          }}
        />
        <div className="evb-legend" aria-label={t("legend")}>
          {EVENT_TYPES.map((type) => (
            <span key={type} className="evb-legend-item">
              <span className={`evb-dot ev-${type}`} aria-hidden="true" />
              {typeLabel(type)}
            </span>
          ))}
        </div>
      </div>

      <div className="evb-board">
        <div className="evb-cal">
          <div className="evb-header">
            <button className="cal-nav-btn" onClick={() => shiftMonth(-1)} aria-label={t("prevMonth")}>
              {t("prevArrow")}
            </button>
            <h3>{t("monthTitle", { month: months[cursor.month], year: cursor.year })}</h3>
            <button className="cal-nav-btn" onClick={() => shiftMonth(1)} aria-label={t("nextMonth")}>
              {t("nextArrow")}
            </button>
          </div>
          <div className="evb-grid">
            {dow.map((d) => (
              <div key={d} className="evb-dow">
                {d}
              </div>
            ))}
            {Array.from({ length: firstDow }, (_, i) => (
              <div key={`pad-${i}`} className="evb-cell empty" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1;
              const list = events[d];
              const has = !!list;
              return (
                <div
                  key={d}
                  className={`evb-cell ${has ? "has-event" : ""} ${selected === d ? "active" : ""}`}
                  tabIndex={has ? 0 : undefined}
                  role={has ? "button" : undefined}
                  aria-label={
                    has
                      ? t("cellLabel", {
                          day: d,
                          month: months[cursor.month],
                          titles: list.map((e) => e.title).join(locale === "ar" ? "، " : ", "),
                        })
                      : undefined
                  }
                  onMouseEnter={has ? () => setSelected(d) : undefined}
                  onFocus={has ? () => setSelected(d) : undefined}
                  onClick={has ? () => setSelected(d) : undefined}
                  onKeyDown={
                    has
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelected(d);
                          }
                        }
                      : undefined
                  }
                >
                  <span className="evb-daynum">{d}</span>
                  {has && (
                    <span className="evb-dots">
                      {list.slice(0, 3).map((e, j) => (
                        <span key={j} className={`evb-dot ev-${e.type}`} />
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="evb-panel">
          {selectedEvents ? (
            <>
              <h4>
                {t("dayTitle", { month: months[cursor.month], day: selected ?? "", year: cursor.year })}
              </h4>
              {selectedEvents.map((e, i) => (
                <div key={i} className="evb-event">
                  <span className={`evb-tag ev-${e.type}-text`}>
                    <span className={`evb-dot ev-${e.type}`} aria-hidden="true" />
                    {typeLabel(e.type)}
                    {e.city ? ` · ${cityLabel(e.city)}` : ""}
                  </span>
                  <div className="evb-event-title">{e.title}</div>
                  {e.time && <div className="evb-event-meta">{e.time}</div>}
                  {e.location && <div className="evb-event-meta">{e.location}</div>}
                  {e.presenter && <div className="evb-event-meta">{t("with", { name: e.presenter })}</div>}
                  {e.meta && <div className="evb-event-meta">{e.meta}</div>}
                  {e.classId && (
                    <Link
                      className="evb-enroll"
                      href={{ pathname: "/contact", query: { class: e.classId } }}
                    >
                      {tClasses("enroll")} →
                    </Link>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p className="evb-empty">{t("empty")}</p>
          )}
        </aside>
      </div>

      <p className="evb-note">
        {isLive ? t("noteLive") : t("noteSample")}
      </p>
    </div>
  );
}
