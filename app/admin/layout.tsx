import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { SITE_URL } from "@/lib/siteUrl";
import { fontClasses } from "@/lib/fonts";
import "../globals.css";

// Keep every admin page out of search results.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Emara Admin",
  robots: { index: false, follow: false },
};

/** Root layout of the admin (always rendered per request — it's private and
 *  its language comes from the ADMIN_LOCALE cookie). */
export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={fontClasses}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
