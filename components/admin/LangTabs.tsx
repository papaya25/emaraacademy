"use client";

import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslations } from "next-intl";

const TABS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
] as const;

type Code = (typeof TABS)[number]["code"];

/**
 * English / Español / العربية tabs around a form's translatable fields. All
 * three panels stay in the form (inactive ones are only hidden), so one Save
 * stores every language at once.
 */
export default function LangTabs(panels: Record<Code, React.ReactNode>) {
  const t = useTranslations("admin.langTabs");
  const [active, setActive] = useState<Code>("en");
  const id = useId();
  const refs = useRef<Partial<Record<Code, HTMLDivElement | null>>>({});

  // A required English field left empty while another tab is showing would
  // block Save with no visible message — jump to that tab so the browser can
  // point at the field.
  useEffect(() => {
    const cleanups = TABS.map(({ code }) => {
      const el = refs.current[code];
      if (!el) return () => {};
      const onInvalid = () => flushSync(() => setActive(code));
      el.addEventListener("invalid", onInvalid, true);
      return () => el.removeEventListener("invalid", onInvalid, true);
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div className="admin-langtabs">
      <div role="tablist" aria-label={t("label")} className="admin-langtabs-list">
        {TABS.map(({ code, label }, i) => (
          <button
            key={code}
            type="button"
            role="tab"
            id={`${id}-tab-${code}`}
            aria-controls={`${id}-panel-${code}`}
            lang={code}
            aria-selected={active === code}
            tabIndex={active === code ? 0 : -1}
            className="admin-langtab"
            onClick={() => setActive(code)}
            onKeyDown={(e) => {
              // Arrow keys move between tabs (visual order, so flipped in RTL).
              const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
              if (!step) return;
              e.preventDefault();
              const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
              const next = TABS[(i + (rtl ? -step : step) + TABS.length) % TABS.length].code;
              setActive(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {TABS.map(({ code }) => (
        <div
          key={code}
          role="tabpanel"
          id={`${id}-panel-${code}`}
          aria-labelledby={`${id}-tab-${code}`}
          data-lang={code}
          hidden={active !== code}
          ref={(el) => {
            refs.current[code] = el;
          }}
          className="admin-langtabs-panel"
        >
          {code !== "en" && (
            <p className="admin-hint">{t("blankHint", { language: t(`names.${code}`) })}</p>
          )}
          {panels[code]}
        </div>
      ))}
    </div>
  );
}
