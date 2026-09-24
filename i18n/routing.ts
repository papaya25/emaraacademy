import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "es", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

/** The admin panel's own language choice (the public site uses the URL). */
export const ADMIN_LOCALE_COOKIE = "ADMIN_LOCALE";

export const { Link, usePathname, useRouter } = createNavigation(routing);
