import Link from "next/link";
import Image from "next/image";
import Rosette from "./Rosette";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <Rosette />
        <div className="footer-grid">
          <div className="footer-id">
            <Image src="/logo.png" alt="Emara Academy" width={104} height={146} />
            <p className="footer-tagline">
              Building communities that keep new Muslims — education, mentorship,
              and belonging across Latin America.
            </p>
            <p className="ar footer-ar" aria-hidden="true">
              عِمَارَة
            </p>
          </div>
          <nav className="footer-col" aria-label="Explore">
            <h3>Explore</h3>
            <Link href="/#new-muslims">New Muslims</Link>
            <Link href="/#programs">Programs</Link>
            <Link href="/events">Events</Link>
            <Link href="/donations">Donation Ledger</Link>
            <Link href="/about">Who We Are</Link>
            <Link href="/#give">Donate</Link>
          </nav>
          <div className="footer-col" aria-label="Contact">
            <h3>Contact</h3>
            <a href="tel:+525526709079">+52 55 2670 9079</a>
            <a href="mailto:info@emaraacademy.org">info@emaraacademy.org</a>
            <p className="footer-place">
              Playa del Carmen
              <br />
              Quintana Roo, México
            </p>
          </div>
          <div className="footer-col" aria-label="Policies">
            <h3>Policies</h3>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/donation-policy">Donation &amp; Refund Policy</Link>
            <Link href="/donation-acceptance-policy">Donation Acceptance Policy</Link>
          </div>
        </div>
        <div className="footer-legal">
          <span>© 2026 Emara Academy</span>
          <span>Legally incorporated non-profit association</span>
        </div>
      </div>
    </footer>
  );
}
