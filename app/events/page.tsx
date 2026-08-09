import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import EventsBoard from "@/components/EventsBoard";

export const metadata: Metadata = {
  title: "Events & Lessons — Emara Academy",
  description:
    "Classes, community nights, retreats, and Eid gatherings for new Muslims across Latin America — see what's on and when.",
};

export default function EventsPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">الفعاليات</p>
          <Rosette />
          <h1>Events &amp; Lessons</h1>
          <p>
            Classes, gatherings, and retreats run on a steady rhythm, so you
            always know when to show up — pick your city and browse the
            calendar.
          </p>
        </div>
      </section>

      <section className="evb-section">
        <div className="wrap">
          <Reveal>
            <EventsBoard />
          </Reveal>
        </div>
      </section>

      <section className="spread">
        <div className="wrap spread-grid">
          <Reveal>
            <p className="folio">إن شاء الله</p>
            <h2>
              Want a seat at any of these? <em>Just write.</em>
            </h2>
          </Reveal>
          <Reveal className="lede-col">
            <p>
              Every class and gathering is free, and nobody checks how much you
              already know. Tell us which city you&rsquo;re in and what
              you&rsquo;d like to join — we&rsquo;ll save you a place and someone
              will be waiting to welcome you.
            </p>
            <div className="spread-cta">
              <Link className="btn btn-green" href="/contact">
                Reserve a Spot
              </Link>
              <Link className="btn btn-ghost" href="/#programs">
                See the Programs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
