"use client";

import { useState } from "react";
import Link from "next/link";
import { PROGRAMS } from "@/lib/programs";

const ACCENTS = ["a", "b", "c"] as const;

export default function ProgramShelf() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="shelf">
      {PROGRAMS.map((p, i) => {
        const open = openSlug === p.slug;
        return (
          <div className={`book3d ${ACCENTS[i % 3]}`} key={p.slug}>
            <div className={`book3d-flip ${open ? "open" : ""}`}>
              <button
                className="book3d-face book3d-front"
                onClick={() => setOpenSlug(p.slug)}
                aria-expanded={open}
                aria-label={`Open ${p.title}`}
                tabIndex={open ? -1 : 0}
                aria-hidden={open}
              >
                <span className="book3d-spine" aria-hidden="true" />
                <span className="book3d-cover">
                  <span className="book-num" aria-hidden="true">
                    {p.num}
                  </span>
                  <span className="book-cat">{p.category}</span>
                  <span className="book-title">{p.title}</span>
                  <span className="book-hint">Tap to open</span>
                </span>
              </button>

              <div
                className="book3d-face book3d-back"
                aria-hidden={!open}
              >
                <button
                  className="book3d-close"
                  onClick={() => setOpenSlug(null)}
                  aria-label={`Close ${p.title}`}
                  tabIndex={open ? 0 : -1}
                >
                  ×
                </button>
                <span className="book-cat">{p.category}</span>
                <h3 className="book3d-back-title">{p.title}</h3>
                <p>{p.whatItIs}</p>
                <Link href={`/programs/${p.slug}`} tabIndex={open ? 0 : -1}>
                  Read the full chapter →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
