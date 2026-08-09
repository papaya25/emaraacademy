import Link from "next/link";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import NewsletterForm from "@/components/NewsletterForm";
import DonatePanel from "@/components/DonatePanel";

export default function Home() {
  return (
    <main>
      {/* Title page */}
      <section className="titlepage">
        <div className="wrap">
          <div className="plate">
            <span className="corner" />
            <p className="ar">عِمَارَة</p>
            <Rosette />
            <h1>
              Knowledge builds what <em>conversion alone</em> cannot.
            </h1>
            <p className="title-sub">
              Emara Academy is a school and a family for new Muslims across
              Latin America — structured learning, real mentorship, and a
              community that holds you through your first years of faith.
            </p>
            <div className="title-actions">
              <Link className="btn btn-green" href="#give">
                Support the Work
              </Link>
              <Link className="btn btn-ghost" href="/new-muslims">
                Begin Your Journey
              </Link>
            </div>
            <p className="title-place">Playa del Carmen · Quintana Roo · México</p>
          </div>
        </div>
      </section>

      {/* Chapter I — the problem / for new Muslims */}
      <section className="spread" id="new-muslims">
        <div className="wrap spread-grid">
          <Reveal>
            <p className="folio">الفصل الأول</p>
            <h2>
              The year <em>after</em> the shahada is where faith is kept — or
              quietly lost.
            </h2>
          </Reveal>
          <Reveal className="lede-col">
            <p className="dropcap">
              Across Latin America, people find Islam every day — and most of
              them find it alone. No classes in their language. No one to teach
              them to pray. No one to sit with at Eid. Da&rsquo;wah celebrates
              the moment of conversion; almost nothing is built for the year
              that follows.
            </p>
            <p>
              Emara Academy exists for that year, and every year after it:
              weekly classes in Spanish and Portuguese, a mentor within your
              first two weeks, dignified help when life gets hard, and a
              community that already knows your name.
            </p>
            <div className="spread-cta">
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

      {/* Table of contents — programs */}
      <section className="contents" id="programs">
        <div className="wrap">
          <Reveal className="contents-head">
            <span className="smallcaps">Table of Contents</span>
            <h2>Six chapters of one mission</h2>
          </Reveal>
          <Reveal className="toc">
            {[
              {
                slug: "new-muslim-education",
                num: "١",
                title: "New Muslim Education",
                desc: "Weekly classes from first prayer to deep study, always with a shared meal",
              },
              {
                slug: "imam-teacher-formation",
                num: "٢",
                title: "Imam & Teacher Formation",
                desc: "Training teachers in the pastoral care converts actually need",
              },
              {
                slug: "community-events",
                num: "٣",
                title: "Community Events",
                desc: "Story nights, Eid gatherings, and tables with room for you",
              },
              {
                slug: "mutual-aid-fund",
                num: "٤",
                title: "Mutual Aid Fund",
                desc: "Quiet, dignified help with food, clothing, and emergencies",
              },
              {
                slug: "outdoor-retreats",
                num: "٥",
                title: "Outdoor Retreats",
                desc: "Camping, sport, and halaqas under open sky",
              },
              {
                slug: "inter-community-exchange",
                num: "٦",
                title: "Inter-Community Exchange",
                desc: "Connecting convert communities across the continent",
              },
            ].map((p) => (
              <Link className="toc-row" href={`/programs/${p.slug}`} key={p.title}>
                <span className="toc-num" aria-hidden="true">
                  {p.num}
                </span>
                <span className="toc-title">{p.title}</span>
                <span className="toc-leader" aria-hidden="true" />
                <span className="toc-desc">{p.desc}</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Events */}
      <section className="events" id="events">
        <div className="wrap">
          <Reveal className="events-head">
            <span className="smallcaps">Events &amp; Lessons</span>
            <h2>A place to be, most weeks of the month</h2>
            <p>
              Classes, gatherings, and retreats run on a steady rhythm, so you
              always know when to show up.
            </p>
          </Reveal>
          <Reveal>
            <p className="events-cadence-line">
              Weekly classes · Monthly community nights · Quarterly retreats ·
              Eid &amp; Ramadan gatherings
            </p>
            <div className="events-actions">
              <Link className="btn btn-green" href="/events">
                Open the Full Calendar
              </Link>
              <p className="events-note">
                Filter by city, browse month by month, and see Eid and Ramadan
                dates — or write to us to reserve a spot.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">Stay Connected</span>
            <h2>Get news on classes, events, and how your support helps</h2>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>

      {/* Hadith + donate */}
      <section className="waqf" id="give">
        <div className="wrap narrow">
          <Reveal>
            <p className="ar">إِذَا مَاتَ ابْنُ آدَمَ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ</p>
            <p className="waqf-quote">
              &ldquo;When a person dies, their deeds come to an end — except
              three: an ongoing charity, knowledge that continues to benefit,
              and a righteous child who prays for them.&rdquo;
            </p>
            <p className="waqf-source">Ṣaḥīḥ Muslim</p>
          </Reveal>
          <Reveal>
            <DonatePanel />
          </Reveal>
        </div>
      </section>

      {/* Volunteer */}
      <section className="volunteer">
        <div className="wrap">
          <Reveal className="volunteer-grid">
            <div>
              <span className="smallcaps">Give Your Time</span>
              <h2>
                Can&rsquo;t give financially? <em>Give your time.</em>
              </h2>
              <p className="lede">
                Emara Academy runs on people who show up: class assistants,
                mentors for new converts, translators, event organizers, and
                hands for retreats and mutual aid deliveries.
              </p>
              <div className="role-list">
                <span>Class Assistant</span>
                <span>Mentor</span>
                <span>Translator</span>
                <span>Event Helper</span>
                <span>Retreat Support</span>
              </div>
            </div>
            <Link className="btn btn-green" href="/contact">
              Offer Your Time
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Transparency */}
      <section className="transparency">
        <div className="wrap">
          <Reveal>
            <span className="smallcaps">Transparency</span>
            <h2>Where your donation goes</h2>
            <p className="lede">
              Every donation is tracked under restricted-fund accounting, so you can
              earmark a donation to a specific program. We publish independently
              reviewed financial statements and report on spending at least once
              a year.
            </p>
            <div className="fund-list">
              <span>Education</span>
              <span>Imam &amp; Teacher Training</span>
              <span>Community Events</span>
              <span>Mutual Aid Fund</span>
              <span>Outdoor Retreats</span>
              <span>Regional Exchange</span>
              <span>Digital Presence</span>
              <span>Core Operations</span>
            </div>
            <p className="transparency-cta">
              Considering a major gift, or have questions before you give?{" "}
              <Link href="/contact">Talk to us first →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta" id="contact">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">Correspondence</span>
            <h2>
              Every letter is read by a person, <em>not a system.</em>
            </h2>
            <p>
              A question about a class, a donation, volunteering — or your own
              first steps in Islam. Write to us and a real person replies.
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
