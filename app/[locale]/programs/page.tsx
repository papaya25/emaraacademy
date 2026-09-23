import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import ProgramShelf from "@/components/ProgramShelf";

export const metadata: Metadata = {
  title: "Programs — Emara Academy",
  description:
    "Six programs, one mission: education, teacher formation, community events, mutual aid, retreats, and regional exchange for new Muslims across Latin America.",
};

export default function ProgramsPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">الفهرس</p>
          <Rosette />
          <h1>Programs</h1>
          <p>
            Six chapters of one mission — each built around a moment when new
            Muslims most often drift away, and designed to hold them instead.
          </p>
        </div>
      </section>

      <section className="chapters">
        <div className="wrap">
          <Reveal>
            <ProgramShelf />
          </Reveal>
        </div>
      </section>

      <section className="contact-cta">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">Get Involved</span>
            <h2>
              Support our work, <em>however you can.</em>
            </h2>
            <p>
              Volunteer as a mentor, translator, or event helper — these six
              programs run on people who show up.
            </p>
            <div className="spread-cta">
              <Link className="btn btn-green" href="/contact">
                Offer Your Time
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
