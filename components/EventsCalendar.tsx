"use client";

import { useCallback, useEffect, useState } from "react";

type CalEvent = { tag: string; title: string; meta: string };

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Illustrative recurring schedule until real events live in Supabase:
 * Thursdays = weekly class, third Saturday = community night.
 */
function eventsForMonth(year: number, month: number): Record<number, CalEvent[]> {
  const days = new Date(year, month + 1, 0).getDate();
  const map: Record<number, CalEvent[]> = {};
  let satCount = 0;
  for (let d = 1; d <= days; d++) {
    const dow = new Date(year, month, d).getDay();
    const list: CalEvent[] = [];
    if (dow === 4) {
      list.push({
        tag: "Weekly",
        title: "New Muslim Class",
        meta: "7:00 PM · Foundations track · Playa del Carmen",
      });
    }
    if (dow === 6) {
      satCount++;
      if (satCount === 3) {
        list.push({
          tag: "Monthly",
          title: "Community Night",
          meta: "6:30 PM · Story night & shared meal",
        });
      }
    }
    if (list.length) map[d] = list;
  }
  return map;
}

export default function EventsCalendar() {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selected, setSelected] = useState<number | null>(null);

  const events = eventsForMonth(cursor.year, cursor.month);
  const firstDow = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  const shiftMonth = (delta: number) => {
    setSelected(null);
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  return (
    <>
      <button className="btn btn-green" type="button" onClick={() => setOpen(true)}>
        See Full Calendar
      </button>

      {open && (
        <div className="cal-modal" role="presentation">
          <div className="cal-backdrop" onClick={close} />
          <div className="cal-dialog" role="dialog" aria-modal="true" aria-label="Events calendar">
            <button className="cal-close" onClick={close} aria-label="Close calendar">
              ×
            </button>
            <div className="cal-header">
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
            <div className="cal-grid">
              {DOW.map((d) => (
                <div key={d} className="cal-dow">
                  {d}
                </div>
              ))}
              {Array.from({ length: firstDow }, (_, i) => (
                <div key={`pad-${i}`} className="cal-cell empty" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const has = !!events[d];
                return (
                  <div
                    key={d}
                    className={`cal-cell ${has ? "has-event" : ""} ${selected === d ? "active" : ""}`}
                    tabIndex={has ? 0 : undefined}
                    role={has ? "button" : undefined}
                    aria-label={
                      has
                        ? `${d} ${MONTHS[cursor.month]}: ${events[d].map((e) => e.title).join(", ")}`
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
                    {d}
                    {has && <span className="dot" />}
                  </div>
                );
              })}
            </div>
            <div className="cal-day-panel">
              {selected && events[selected] ? (
                <>
                  <h4>
                    {MONTHS[cursor.month]} {selected}
                  </h4>
                  {events[selected].map((e) => (
                    <div key={e.title} className="cal-event-item">
                      <span className="tag">{e.tag}</span>
                      <div className="t">{e.title}</div>
                      <div className="m">{e.meta}</div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="cal-day-empty">Hover or tap a highlighted day to see what&rsquo;s on.</p>
              )}
            </div>
            <p className="cal-note">
              Illustrative example schedule based on our recurring program cadence — a live
              calendar is coming.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
