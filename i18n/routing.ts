import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "es", "ar"],
  // Arabic is the main language (owner, 2026-09-28): it lives at the plain
  // URLs, English under /en and Spanish under /es. A first-time visitor is
  // still sent to their browser's language when it's one of these three.
  defaultLocale: "ar",
  localePrefix: "as-needed",
});

/** The admin panel's own language choice (the public site uses the URL). */
export const ADMIN_LOCALE_COOKIE = "ADMIN_LOCALE";

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
