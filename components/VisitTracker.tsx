"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

// The last page reported — the same page twice in a row is one view (React
// runs effects twice in development, and a language switch reloads in place).
let lastSent = "";

/** Tells the site's own counter (/api/track) that a page was viewed. Sends
 *  only the page, language and the site that linked here — no cookies. */
export default function VisitTracker() {
  const pathname = usePathname();
  const locale = useLocale();
  useEffect(() => {
    if (navigator.webdriver || lastSent === `${locale}${pathname}`) return; // bots / repeat
    lastSent = `${locale}${pathname}`;
    let referrer = "";
    try {
      const host = document.referrer ? new URL(document.referrer).hostname : "";
      if (host && host !== location.hostname) referrer = host.replace(/^www\./, "");
    } catch {}
    const body = JSON.stringify({ path: pathname, locale, referrer });
    if (!navigator.sendBeacon?.("/api/track", body)) {
      fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname, locale]);
  return null;
}
