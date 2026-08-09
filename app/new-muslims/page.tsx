import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";

export const metadata: Metadata = {
  title: "New to Islam — Emara Academy",
  description:
    "You said the shahada — here's what happens next. Free weekly classes in Spanish and Portuguese, a mentor in your first two weeks, and a community that already knows your name.",
};

export default function NewMuslimsPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">أهلاً بك</p>
          <Rosette />
          <h1>New to Islam</h1>
          <p>
            You&rsquo;re not late, you&rsquo;re not behind, and you don&rsquo;t
            have to figure any of this out alone. Here is exactly what happens
            next.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الأول</p>
            <h2>
              What happens <em>from your first day</em>
            </h2>
          </Reveal>
          <Reveal>
            <ul className="values-list">
              <li>
                <span className="v-num" aria-hidden="true">١</span>
                <div>
                  <h3>Day one — someone talks with you</h3>
                  <p>
                    No forms, no test, no pressure. Just a conversation about
                    where you are, what you&rsquo;re wondering, and what you
                    need — in Spanish, Portuguese, or English.
                  </p>
                </div>
              </li>
              <li>
                <span className="v-num" aria-hidden="true">٢</span>
                <div>
                  <h3>Your first two weeks — a mentor</h3>
                  <p>
                    You&rsquo;re paired with an established Muslim — a big
                    brother or sister for your first year — who checks on you,
                    answers the small questions, and sits with you at your first
                    gathering.
                  </p>
                </div>
              </li>
              <li>
                <span className="v-num" aria-hidden="true">٣</span>
                <div>
                  <h3>Every week — a class and a meal</h3>
                  <p>
                    Weekly classes that start from absolute zero: how to pray,
                    how to fast, what to believe — always around a shared meal,
                    because this is a family, not a lecture hall.
                  </p>
                </div>
              </li>
              <li>
                <span className="v-num" aria-hidden="true">٤</span>
                <div>
                  <h3>When life gets hard — quiet help</h3>
                  <p>
                    If conversion costs you a job, family support, or stability,
                    our mutual aid fund helps with food, clothing, and
                    emergencies — confidentially, with dignity, no gossip.
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الثاني</p>
            <h2>
              Come <em>as you are</em>
            </h2>
          </Reveal>
          <Reveal className="about-body">
            <p className="dropcap">
              No Arabic needed. No cost, ever. No one checks how much you
              practice, which school of thought you lean toward, or whether
              you&rsquo;ve even said the shahada yet — the curious are as
              welcome as the convinced.
            </p>
            <p>
              And if you carry the heavier things — a family that doesn&rsquo;t
              understand, doubts you&rsquo;re ashamed of, loneliness you
              didn&rsquo;t expect — you will be surrounded by people who carried
              exactly the same things, and stayed. That is the whole point of
              this community: nobody walks alone.
            </p>
            <p>
              <Link href="/faq">Read honest answers to common questions →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="contact-cta">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">Whenever You&rsquo;re Ready</span>
            <h2>
              One message is all it takes to <em>stop doing this alone.</em>
            </h2>
            <p>
              Tell us your city and where you are on the journey — we&rsquo;ll
              take it from there.
            </p>
            <div className="title-actions">
              <Link className="btn btn-green" href="/classes">
                Join a Class
              </Link>
              <a
                className="btn btn-ghost"
                href="https://wa.me/525526709079?text=Assalamu%20alaikum%20%E2%80%94%20I%27d%20like%20to%20talk%20to%20someone%20at%20Emara%20Academy."
                target="_blank"
                rel="noopener noreferrer"
              >
                Talk to Someone First
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
