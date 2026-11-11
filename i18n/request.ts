import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, routing } from "./routing";
import { applyPageText, type PageTextStore } from "@/lib/pageText";

/** Page texts edited in the admin (cached; saving in the admin refreshes it). */
async function savedPageText(locale: string): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return {};
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?key=eq.page_text&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300, tags: ["page-text"] },
    });
    if (!res.ok) return {};
    const rows = (await res.json()) as { value: PageTextStore }[];
    return rows[0]?.value?.text?.[locale as keyof PageTextStore["text"]] ?? {};
  } catch {
    return {}; // database unreachable — the built-in text still shows
  }
}

async function adminLocale(): Promise<string> {
  const picked = (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value;
  return hasLocale(routing.locales, picked) ? picked : "en";
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  // Public pages: the language comes from the URL (no cookies read, so they
  // stay static). Routes outside app/[locale] — the admin panel — have none;
  // they use the language picked in the admin sidebar (English by default).
  const locale = hasLocale(routing.locales, requested) ? requested : await adminLocale();

  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages: applyPageText(messages, await savedPageText(locale)) };
});
