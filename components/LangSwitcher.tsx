"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";

const LANGS = [
  { code: "en", label: "English", ready: true },
  { code: "es", label: "Español", ready: false },
  { code: "ar", label: "العربية", ready: true },
];

export default function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen(!open)}
      >
        {locale.toUpperCase()}
      </button>
      {open && (
        <div className="lang-menu" role="listbox" aria-label="Languages">
          {LANGS.map((l) =>
            l.ready ? (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={l.code === locale}
                className={`lang-option ${l.code === locale ? "active" : ""}`}
                onClick={() => {
                  setOpen(false);
                  // A full navigation, not Next's client-side router: the
                  // site's true root layout (app/layout.tsx) sits outside
                  // app/[locale] so /admin can stay locale-free, which means
                  // it won't re-run getLocale() on a plain client-side
                  // transition between locales (stale <html dir/lang>).
                  //
                  // Always include the explicit /<locale> prefix, even for
                  // English — once a NEXT_LOCALE cookie is set to a
                  // non-default locale, a bare unprefixed URL is ambiguous
                  // and the middleware honors the cookie over it, so the
                  // English option would silently no-op. The middleware
                  // normalizes /en/... back down to the unprefixed URL
                  // (and updates the cookie) once it sees the explicit
                  // prefix, so this still lands on the right clean URL.
                  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional, see above
                  window.location.href = `/${l.code}${pathname === "/" ? "" : pathname}`;
                }}
              >
                <span>{l.label}</span>
              </button>
            ) : (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={false}
                className="lang-option"
                disabled
              >
                <span>{l.label}</span>
                <span className="lang-soon">soon</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
