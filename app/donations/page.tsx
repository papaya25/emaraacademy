import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";

export const metadata: Metadata = {
  title: "The Donation Ledger — Emara Academy",
  description:
    "Every donation to Emara Academy, recorded openly: monthly totals, program allocation, and annual reporting.",
};

// TODO: read from Supabase once donations go live — sample rows until then.
const SAMPLE_MONTHS = [
  { month: "August 2026", raised: 1850, goal: 5000, note: "Education & first retreat fund" },
];

export default function DonationsPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">سِجِلّ</p>
          <Rosette />
          <h1>The Donation Ledger</h1>
          <p>
            Every donation is recorded, allocated under restricted-fund
            accounting, and reported openly — this page is where that record
            lives.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الأمانة</p>
            <h2>
              Openness is part of <em>the trust you place in us.</em>
            </h2>
          </Reveal>
          <Reveal className="about-body">
            <p>
              We are at the very beginning — our first campaigns are being
              prepared, and live donation tracking will appear here the moment
              they open. From then on, this ledger will show monthly totals
              against our goals, how funds were allocated across programs, and
              our independently reviewed annual statements.
            </p>
            <div className="ledger-table" role="table" aria-label="Monthly donations">
              <div className="ledger-row ledger-head" role="row">
                <span role="columnheader">Month</span>
                <span role="columnheader">Raised</span>
                <span role="columnheader">Goal</span>
                <span role="columnheader">Directed to</span>
              </div>
              {SAMPLE_MONTHS.map((m) => (
                <div className="ledger-row" role="row" key={m.month}>
                  <span role="cell">{m.month}</span>
                  <span role="cell">${m.raised.toLocaleString()}</span>
                  <span role="cell">${m.goal.toLocaleString()}</span>
                  <span role="cell">{m.note}</span>
                </div>
              ))}
            </div>
            <p className="ledger-note">
              Sample figures shown while donations are in test mode — live
              tracking begins with our first campaign.
            </p>
            <p>
              Questions about a donation, or considering a larger one?{" "}
              <Link href="/#contact">Write to us first</Link> — we answer
              everything ourselves.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
