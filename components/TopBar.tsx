"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LangSwitcher from "./LangSwitcher";

const links = [
  { href: "/new-muslims", label: "New Muslims" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "Who We Are" },
  { href: "/contact", label: "Contact" },
];

export default function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="wrap topbar-row">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Emara Academy" width={104} height={146} priority />
        </Link>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <nav className={`topbar-nav ${open ? "open" : ""}`}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link className="donate-seal" href="/#give" onClick={() => setOpen(false)}>
            Donate
          </Link>
          <LangSwitcher />
        </nav>
      </div>
    </header>
  );
}
