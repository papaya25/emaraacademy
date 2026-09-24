import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  // Routes outside app/[locale] (the admin panel) have no locale in the URL;
  // they use the language picked in the admin sidebar instead.
  const fallback = (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : hasLocale(routing.locales, fallback)
      ? fallback
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
