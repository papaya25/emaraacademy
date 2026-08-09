import type { Metadata } from "next";
import Rosette from "@/components/Rosette";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Emara Academy",
  description:
    "Write to Emara Academy about joining a class, donating, or volunteering — every letter is read by a person, and every question gets a real reply.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">المراسلات</p>
          <Rosette />
          <h1>Contact</h1>
          <p>
            Whether you&rsquo;re taking your first steps in Islam, thinking
            about a donation, or offering your time — write to us. We answer
            everything ourselves.
          </p>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
