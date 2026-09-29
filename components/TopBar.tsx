"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import LangSwitcher from "./LangSwitcher";
import WhatsAppLink from "./WhatsAppLink";

const links = [
  { href: "/new-muslims", key: "newMuslims" },
  { href: "/programs", key: "programs" },
  { href: "/events", key: "events" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function TopBar() {
  const t = useTranslations("nav");
  const tShared = useTranslations("shared");
  const [open, setOpen] = useState(false);

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="topbar">
      <div className="wrap topbar-row">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt={t("logoAlt")} width={104} height={146} priority />
        </Link>
        <button
          className="menu-toggle"
          aria-label={t("toggleMenu")}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {t("menu")}
        </button>
        <nav className={`topbar-nav ${open ? "open" : ""}`}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {t(l.key)}
            </Link>
          ))}
          <WhatsAppLink
            className="nav-whatsapp"
            message={tShared("whatsappGreeting")}
            onClick={() => setOpen(false)}
          >
            {t("whatsapp")}
          </WhatsAppLink>
          <LangSwitcher />
        </nav>
      </div>
    </header>
  );
}
