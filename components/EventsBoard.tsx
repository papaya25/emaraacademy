"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import CityFilter from "@/components/CityFilter";
import { displayValue } from "@/lib/i18nDisplay";

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
      .select("id,title,meta,city,type,event_date,time,location,presenter")
      .then(({ data, error }) => {
        if (!cancelled && !error && data && data.length) setDbEvents(data as DbEvent[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isLive = dbEvents !== null;

  const cities = useMemo(() => {
    if (!dbEvents) return CITIES;
    const unique = [...new Set(dbEvents.map((e) => e.city).filter((c): c is string => !!c))];
    return [ALL, ...unique.sort()];
  }, [dbEvents]);

  const events = useMemo(() => {
    if (dbEvents) {
      const map: Record<number, CalEvent[]> = {};
      for (const ev of dbEvents) {
        const [y, m, d] = ev.event_date.split("-").map(Number);
        if (y !== cursor.year || m - 1 !== cursor.month) continue;
        if (city !== ALL && ev.city !== null && ev.city !== city) continue;
        const type = (EVENT_TYPES as string[]).includes(ev.type)
          ? (ev.type as EventType)
          : "monthly";
        (map[d] ||= []).push({
          type,
          title: ev.title,
          meta: ev.meta ?? "",
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
  }, [dbEvents, city, cursor, sampleText]);

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
