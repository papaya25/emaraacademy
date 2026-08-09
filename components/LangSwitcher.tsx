"use client";

import { useEffect, useRef, useState } from "react";

const LANGS = [
  { code: "EN", label: "English", ready: true },
  { code: "ES", label: "Español", ready: false },
  { code: "AR", label: "العربية", ready: false },
];

export default function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        EN
      </button>
      {open && (
        <div className="lang-menu" role="listbox" aria-label="Languages">
          {LANGS.map((l) => (
            // TODO: wire ES/AR to real locales once translations exist
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === "EN"}
              className={`lang-option ${l.code === "EN" ? "active" : ""}`}
              disabled={!l.ready}
              onClick={() => setOpen(false)}
            >
              <span>{l.label}</span>
              {!l.ready && <span className="lang-soon">soon</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
