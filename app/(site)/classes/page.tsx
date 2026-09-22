import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import ClassesBoard from "@/components/ClassesBoard";

export const metadata: Metadata = {
  title: "Join a Class — Emara Academy",
  description:
    "Free weekly classes for new Muslims in Spanish and Portuguese — from your first prayer to deep study. Pick your city and reserve a spot.",
};

export default function ClassesPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">الدروس</p>
          <Rosette />
          <h1>Join a Class</h1>
          <p>
            Free, weekly, and starting from absolute zero — pick your city,
            find your class, and we&rsquo;ll save you a seat at the table.
          </p>
        </div>
      </section>

      <section className="evb-section">
        <div className="wrap">
          <Reveal>
            <ClassesBoard />
          </Reveal>
        </div>
      </section>

      <section className="contact-cta">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">Not Sure Which One</span>
            <h2>
              Tell us where you are — <em>we&rsquo;ll suggest the right start.</em>
            </h2>
            <p>
              One message with your city and your situation is enough. No
              commitment, no pressure — just an honest recommendation.
            </p>
            <Link className="btn btn-green" href="/contact">
              Write to Us
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
