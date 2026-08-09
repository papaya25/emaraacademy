import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";

export const metadata: Metadata = {
  title: "Questions & Answers — Emara Academy",
  description:
    "Honest answers for new Muslims and for donors: what classes are like, what it costs, where donations go, and how to get involved.",
};

const NEW_MUSLIM_FAQ = [
  {
    q: "Do I need to speak Arabic?",
    a: "No. Every class is taught in Spanish and Portuguese, starting from zero. Arabic reading is something we teach you, gently, over time — it is never a requirement to walk in the door.",
  },
  {
    q: "Does any of this cost money?",
    a: "No. Classes, community nights, mentorship, and the shared meals are free, always. Our programs are funded by donations precisely so that a new Muslim never has to pay to learn their religion.",
  },
  {
    q: "I converted alone and there's no mosque near me. Can I still join?",
    a: "Yes. Write to us wherever you are — we'll connect you with the nearest community we know, and our online materials and check-ins are built exactly for people in your situation. You are the reason we exist.",
  },
  {
    q: "I'm not Muslim yet — I'm just curious. Is it okay to come?",
    a: "Completely. There is no pressure, no one will push you toward a decision, and your questions are welcome for as long as you have them.",
  },
  {
    q: "What if my family doesn't accept my conversion?",
    a: "You are not alone in this — family tension is one of the most common things new Muslims carry, and our teachers are trained for it. We'll help you navigate those relationships with patience and kindness, and our community becomes a second family alongside yours, not a replacement for it.",
  },
  {
    q: "Which school of thought do you follow?",
    a: "Our doors are open to converts of every school of thought and every stage of practice. Classes teach the shared foundations, and our teachers will honestly present differences where they exist, without sectarianism.",
  },
  {
    q: "What is the first class actually like?",
    a: "A small group, a teacher who knows your name, and a meal shared together. You won't be tested, singled out, or asked to know anything in advance. Most people say the surprise isn't the lesson — it's realizing they were expected, and welcome.",
  },
];

const DONOR_FAQ = [
  {
    q: "Is my donation tax-deductible?",
    a: "Emara Academy is a legally incorporated non-profit association in Mexico. Our tax-receipt registrations are in progress — write to us before you give and we'll tell you exactly what documentation we can provide for your situation and country.",
  },
  {
    q: "Can I sponsor a specific program?",
    a: "Yes. Every program — education, teacher formation, events, the mutual aid fund, retreats, and regional exchange — can be sponsored individually, and restricted-fund accounting keeps your donation inside the program you chose.",
  },
  {
    q: "How do I know how the money is spent?",
    a: "We publish our donation ledger openly, report spending at least annually, and share independently reviewed financial statements with donors. If you want more detail than we publish, ask — we answer everything ourselves.",
  },
  {
    q: "Can I donate from outside Mexico?",
    a: "Yes. Card and PayPal donations work internationally, and we can provide transfer details for larger international gifts — write to us and we'll make it simple.",
  },
  {
    q: "Is online payment secure?",
    a: "Payments are processed by Stripe and PayPal — we never see or store your card details. For bank transfers, details come directly from us with a reference code so your donation is tracked correctly.",
  },
  {
    q: "I can't give money. Is there another way to help?",
    a: "Yes, and it matters just as much: class assistants, mentors for new converts, translators, event helpers, and hands for retreats and mutual-aid deliveries. Tell us what you're good at and how much time you have.",
  },
];

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details className="faq-item" key={item.q}>
          <summary>
            <span className="faq-q">{item.q}</span>
            <span className="faq-marker" aria-hidden="true" />
          </summary>
          <p className="faq-a">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function FaqPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">سؤال وجواب</p>
          <Rosette />
          <h1>Questions &amp; Answers</h1>
          <p>
            Honest answers, in plain language — for people finding their way
            into Islam, and for people deciding whether to trust us with their
            donation.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الأول</p>
            <h2>
              For <em>new Muslims</em>
            </h2>
          </Reveal>
          <Reveal>
            <FaqList items={NEW_MUSLIM_FAQ} />
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الثاني</p>
            <h2>
              For <em>donors</em>
            </h2>
          </Reveal>
          <Reveal>
            <FaqList items={DONOR_FAQ} />
          </Reveal>
        </div>
      </section>

      <section className="contact-cta">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">Still Wondering</span>
            <h2>
              Your question isn&rsquo;t here? <em>Ask it anyway.</em>
            </h2>
            <p>
              Write to us about anything — joining, giving, volunteering, or
              your own first steps. A real person reads and answers every
              letter.
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
