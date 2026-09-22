"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CLASSES, CLASS_CITIES, type ClassInfo } from "@/lib/classes";
import { getSupabase } from "@/lib/supabase";
import CityFilter from "@/components/CityFilter";
import WhatsAppLink from "@/components/WhatsAppLink";

const WHATSAPP_MESSAGE = "Assalamu alaikum — I'd like to join a class at Emara Academy.";

export default function ClassesBoard() {
  const [city, setCity] = useState(CLASS_CITIES[0]);

  // Real classes from Supabase; null = none yet, fall back to the sample list
  const [dbClasses, setDbClasses] = useState<ClassInfo[] | null>(null);
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("classes")
      .select("id,subject,blurb,track,language,city,location,day,time,format,status")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!cancelled && !error && data && data.length) {
          setDbClasses(data as ClassInfo[]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isLive = dbClasses !== null;
  const list = dbClasses ?? CLASSES;

  const cities = useMemo(() => {
    if (!dbClasses) return CLASS_CITIES;
    const unique = [...new Set(dbClasses.map((c) => c.city))];
    return ["All Cities", ...unique.sort()];
  }, [dbClasses]);

  const visible =
    city === "All Cities" ? list : list.filter((c) => c.city === city);

  return (
    <div>
      <div className="classes-filter">
        <CityFilter cities={cities} value={city} label="Filter by city" onChange={setCity} />
      </div>

      <div className="class-list">
        {visible.map((c) => (
          <article className="class-card" key={c.id}>
            <div className="class-card-head">
              <span className={`class-status s-${c.status.replace(/\s/g, "").toLowerCase()}`}>
                {c.status}
              </span>
              <span className="class-track">{c.track}</span>
            </div>
            <h3>{c.subject}</h3>
            <p className="class-blurb">{c.blurb}</p>
            <dl className="class-meta">
              <div>
                <dt>Where</dt>
                <dd>
                  {c.city}
                  {c.format === "Online" ? "" : ` · ${c.format}`}
                  {c.location && (
                    <>
                      <br />
                      {c.location}
                    </>
                  )}
                </dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>
                  {c.day} · {c.time}
                </dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{c.language}</dd>
              </div>
            </dl>
            <div className="class-actions">
              {c.status === "Full" ? (
                <Link className="btn btn-ghost class-btn" href="/contact">
                  Join the Waitlist
                </Link>
              ) : (
                <>
                  <Link className="btn btn-green class-btn" href="/contact">
                    Reserve a Spot
                  </Link>
                  <WhatsAppLink className="btn btn-ghost class-btn" message={WHATSAPP_MESSAGE}>
                    Ask on WhatsApp
                  </WhatsAppLink>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {!isLive && (
        <p className="evb-note">
          Sample schedule shown while our first season is being planned — real
          classes, times, and cities will replace it as cohorts open.
        </p>
      )}
    </div>
  );
}
