import Link from "next/link";
import Rosette from "./Rosette";

export type PolicySection = { heading: string; paragraphs: string[] };

export default function PolicyPage({
  title,
  arabic,
  intro,
  sections,
}: {
  title: string;
  arabic: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">{arabic}</p>
          <Rosette />
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </section>
      <section className="policy-body">
        <div className="wrap narrow">
          {sections.map((s) => (
            <div className="policy-section" key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ))}
          <div className="policy-section policy-footer-note">
            <p>
              Questions about this policy? <Link href="/contact">Write to us</Link>{" "}
              — a real person answers.
            </p>
            <p className="policy-updated">
              Draft published August 2026 — under review by our legal advisors;
              wording may be refined before launch.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
