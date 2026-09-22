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
          <div className={`book ${ACCENTS[i % 3]}`} key={p.slug} data-open={open}>
            <button
              className="book-cover"
              onClick={() => setOpenSlug(open ? null : p.slug)}
              aria-expanded={open}
            >
              <span className="book-num" aria-hidden="true">
                {p.num}
              </span>
              <span className="book-cat">{p.category}</span>
              <span className="book-title">{p.title}</span>
              <span className="book-hint">{open ? "Close the book" : "Open the book"}</span>
            </button>
            <div className="book-pages">
              <div className="book-pages-inner">
                <div className="book-pages-content">
                  <p>{p.whatItIs}</p>
                  <Link href={`/programs/${p.slug}`}>Read the full chapter →</Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
