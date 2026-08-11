"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Sticky bottom donate bar — mobile only (hidden by CSS above 820px).
 *  Appears after the visitor scrolls past the hero; never shown during checkout. */
export default function MobileDonateBar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/donate") return null;

  return (
    <div className={`mobile-donate-bar ${show ? "show" : ""}`} aria-hidden={!show}>
      <span className="mdb-text">
        <span className="ar" aria-hidden="true">
          صدقة جارية
        </span>
        Ongoing charity, lasting knowledge
      </span>
      <Link className="btn btn-gold mdb-btn" href="/#give" tabIndex={show ? 0 : -1}>
        Donate
      </Link>
    </div>
  );
}
