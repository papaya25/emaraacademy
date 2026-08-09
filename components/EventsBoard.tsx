"use client";

import { useMemo, useState } from "react";

type EventType = "weekly" | "monthly" | "quarterly" | "special";

type CalEvent = {
  type: EventType;
  title: string;
  meta: string;
  city: string | null; // null = shown for every city (e.g. Islamic dates)
};

const CITIES = ["All Cities", "Playa del Carmen", "Cancún"];

const TYPE_LABELS: Record<EventType, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  special: "Eid & Islamic dates",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Approximate Islamic dates (confirmed by moon sighting closer to the day).
 * Keyed as `${year}-${month}-${day}` with month 0-indexed.
 * TODO: replace with real, admin-managed dates once events live in Supabase.
 */
const SPECIAL_DATES: Record<string, { title: string; meta: string }> = {
  "2026-1-18": { title: "Ramadan begins", meta: "Approximate — confirmed by moon sighting" },
  "2026-2-20": { title: "Eid al-Fitr", meta: "Approximate — confirmed by moon sighting" },
  "2026-4-27": { title: "Eid al-Adha", meta: "Approximate — confirmed by moon sighting" },
  "2027-1-8": { title: "Ramadan begins", meta: "Approximate — confirmed by moon sighting" },
  "2027-2-10": { title: "Eid al-Fitr", meta: "Approximate — confirmed by moon sighting" },
  "2027-4-17": { title: "Eid al-Adha", meta: "Approximate — confirmed by moon sighting" },
};

/**
 * Illustrative recurring schedule until real events live in Supabase:
 * Thursdays = weekly class, 3rd Saturday = community night (Playa del Carmen),
 * 1st Saturday = community night (Cancún), 2nd Sunday of Mar/Jun/Sep/Dec = retreat.
 */
function eventsForMonth(year: number, month: number): Record<number, CalEvent[]> {
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
        title: "New Muslim Class",
        meta: "7:00 PM · Foundations track",
        city: "Playa del Carmen",
      });
    }
    if (dow === 6) {
      satCount++;
      if (satCount === 1) {
        push(d, {
          type: "monthly",
          title: "Community Night",
          meta: "6:30 PM · Story night & shared meal",
          city: "Cancún",
        });
      }
      if (satCount === 3) {
        push(d, {
          type: "monthly",
          title: "Community Night",
          meta: "6:30 PM · Story night & shared meal",
          city: "Playa del Carmen",
        });
      }
    }
    if (dow === 0) {
      sunCount++;
      if (sunCount === 2 && [2, 5, 8, 11].includes(month)) {
        push(d, {
          type: "quarterly",
          title: "Outdoor Retreat",
          meta: "Weekend camping, sport & halaqas",
          city: "Playa del Carmen",
        });
      }
    }
    const special = SPECIAL_DATES[`${year}-${month}-${d}`];
    if (special) {
      push(d, { type: "special", title: special.title, meta: special.meta, city: null });
    }
  }
  return map;
}

export default function EventsBoard() {
  const [city, setCity] = useState(CITIES[0]);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selected, setSelected] = useState<number | null>(null);

  const events = useMemo(() => {
    const all = eventsForMonth(cursor.year, cursor.month);
    if (city === "All Cities") return all;
    const filtered: Record<number, CalEvent[]> = {};
    for (const [d, list] of Object.entries(all)) {
      const keep = list.filter((e) => e.city === null || e.city === city);
      if (keep.length) filtered[Number(d)] = keep;
    }
    return filtered;
  }, [city, cursor]);

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
        <div className="evb-cities" role="group" aria-label="Filter by city">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`reason-chip ${city === c ? "active" : ""}`}
              onClick={() => {
                setCity(c);
                setSelected(null);
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="evb-legend" aria-label="Event types">
          {(Object.keys(TYPE_LABELS) as EventType[]).map((t) => (
            <span key={t} className="evb-legend-item">
              <span className={`evb-dot ev-${t}`} aria-hidden="true" />
              {TYPE_LABELS[t]}
            </span>
          ))}
        </div>
      </div>

      <div className="evb-board">
        <div className="evb-cal">
          <div className="evb-header">
            <button className="cal-nav-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              ‹
            </button>
            <h3>
              {MONTHS[cursor.month]} {cursor.year}
            </h3>
            <button className="cal-nav-btn" onClick={() => shiftMonth(1)} aria-label="Next month">
              ›
            </button>
          </div>
          <div className="evb-grid">
            {DOW.map((d) => (
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
                      ? `${d} ${MONTHS[cursor.month]}: ${list.map((e) => e.title).join(", ")}`
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
                {MONTHS[cursor.month]} {selected}, {cursor.year}
              </h4>
              {selectedEvents.map((e, i) => (
                <div key={i} className="evb-event">
                  <span className={`evb-tag ev-${e.type}-text`}>
                    <span className={`evb-dot ev-${e.type}`} aria-hidden="true" />
                    {TYPE_LABELS[e.type]}
                    {e.city ? ` · ${e.city}` : ""}
                  </span>
                  <div className="evb-event-title">{e.title}</div>
                  <div className="evb-event-meta">{e.meta}</div>
                </div>
              ))}
            </>
          ) : (
            <p className="evb-empty">
              Hover or tap a marked day to see that day&rsquo;s events.
            </p>
          )}
        </aside>
      </div>

      <p className="evb-note">
        Sample schedule shown while our first season is being planned — dates for
        Islamic occasions are approximate and confirmed by moon sighting.
      </p>
    </div>
  );
}
