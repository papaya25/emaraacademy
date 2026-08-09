import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";

export const metadata: Metadata = {
  title: "Who We Are — Emara Academy",
  description:
    "The story of Emara Academy: why we exist, what the name means, the work we do for new Muslims across Latin America, and where we're going.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">عِمَارَة</p>
          <Rosette />
          <h1>Who We Are</h1>
          <p>
            A legally incorporated non-profit born in Playa del Carmen, México,
            with one conviction: no one who finds Islam should have to keep it
            alone.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الأول</p>
            <h2>
              Our story begins with a <em>pattern we couldn&rsquo;t ignore.</em>
            </h2>
          </Reveal>
          <Reveal className="about-body">
            <p className="dropcap">
              Someone says the shahada at a mosque in Quintana Roo. Everyone
              embraces them. And within weeks — they stop coming. Not because
              they stopped believing, but because nobody checked in, nobody
              taught them to pray in a way they could follow, nobody invited
              them to eat, and nobody was there when a family member mocked them
              for converting.
            </p>
            <p>
              We watched this happen, again and again, and heard the same story
              echoed by imams and convert communities across Latin America. The
              region is one of the fastest-growing frontiers for conversion to
              Islam — yet almost none of that growth is captured by lasting
              community. Da&rsquo;wah, as usually practiced, optimizes for the
              moment of conversion. Almost nothing is built for the year after.
            </p>
            <p>
              So we built the thing that was missing: an academy for that year,
              and every year that follows.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الثاني</p>
            <h2>
              Why <em>&ldquo;Emara&rdquo;</em>
            </h2>
          </Reveal>
          <Reveal className="about-body">
            <p>
              Our name comes from the Arabic{" "}
              <em>ʿimārah</em> (عِمَارَة) — cultivation, construction, the act
              of making a place flourish and inhabited. The Qur&rsquo;anic root
              speaks of building something that lasts and filling it with life.
            </p>
            <p>
              We chose it because our mission is not to plant a single seed of
              conversion and walk away. It is to build — classes, friendships,
              safety nets, and celebrations — until every person who accepts
              Islam in Latin America finds a community already standing around
              them.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الثالث</p>
            <h2>
              The work, in one sentence: <em>we help new Muslims stay.</em>
            </h2>
          </Reveal>
          <Reveal className="about-body">
            <p>
              Everything we run is aimed at the moments converts most often
              disengage: right after conversion, during their first Ramadan,
              during family conflict, in moments of material need, and in the
              slow erosion of having no one to share the journey with.
            </p>
            <p>
              Weekly education in Spanish and Portuguese. Imams and teachers
              trained specifically in the care converts need. Community events
              built around belonging. A confidential mutual aid fund. Outdoor
              retreats. And exchanges that connect convert communities across
              the continent — so no city has to build alone.
            </p>
            <p>
              <Link href="/#programs" className="transparency-cta-link">
                See all six programs on the home page →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الرابع</p>
            <h2>What we believe about the work</h2>
          </Reveal>
          <Reveal>
            <ul className="values-list">
              <li>
                <span className="v-num" aria-hidden="true">١</span>
                <div>
                  <h3>People before numbers</h3>
                  <p>
                    One retained new Muslim matters more to us than ten
                    uncontacted shahadas.
                  </p>
                </div>
              </li>
              <li>
                <span className="v-num" aria-hidden="true">٢</span>
                <div>
                  <h3>Consistency over charisma</h3>
                  <p>
                    Programs are built as systems, not personalities — they must
                    survive any one person leaving.
                  </p>
                </div>
              </li>
              <li>
                <span className="v-num" aria-hidden="true">٣</span>
                <div>
                  <h3>Dignity in giving</h3>
                  <p>
                    Material support is delivered without humiliation, judgment,
                    or public exposure of need.
                  </p>
                </div>
              </li>
              <li>
                <span className="v-num" aria-hidden="true">٤</span>
                <div>
                  <h3>Local language, local culture</h3>
                  <p>
                    Everything is delivered in Spanish and Portuguese, adapted
                    to local custom — not imported wholesale.
                  </p>
                </div>
              </li>
              <li>
                <span className="v-num" aria-hidden="true">٥</span>
                <div>
                  <h3>Open doors, not closed circles</h3>
                  <p>
                    Converts of any school of thought and any stage of practice
                    are welcome.
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
            <p className="folio">الفصل الخامس</p>
            <h2>
              Where we&rsquo;re going: <em>city by city, country by country.</em>
            </h2>
          </Reveal>
          <Reveal className="about-body">
            <p>
              We start by proving the full model in Playa del Carmen — education,
              teacher formation, events, mutual aid, and retreats. From there,
              the plan extends through partner mosques to Cancún, Mérida, Mexico
              City, and Guadalajara, then to convert communities across Latin
              America: Colombia, Argentina, Brazil, Chile, Costa Rica, Panama.
            </p>
            <p>
              The goal is a network — a regional family of communities sharing
              one curriculum, trained teachers, and an annual gathering — so
              that a person who converts anywhere on the continent is never more
              than one introduction away from belonging.
            </p>
            <p>
              We are a young organization with our legal foundation, bank
              account, and program blueprint in place — and we publish our
              progress openly as we grow. If you want to be part of building
              this,{" "}
              <Link href="/#give">give</Link>,{" "}
              <Link href="/contact">volunteer</Link>, or simply{" "}
              <Link href="/contact">write to us</Link>.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
