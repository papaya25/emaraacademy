import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/siteUrl";
import { fontClasses } from "@/lib/fonts";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Emara Academy — Building Communities",
  description:
    "Emara Academy is a school and a family for new Muslims across Latin America — structured learning, real mentorship, and a community that holds you through your first years of faith. Based in Playa del Carmen, Mexico.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Root layout of the public site. It's the root (owns <html>) so the page's
 * language comes from the URL: with setRequestLocale here and in every page,
 * Next can prerender all pages as static HTML instead of running a function
 * per visit (Vercel CPU, 2026-11-11). The admin has its own root layout.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={fontClasses}>
        <NextIntlClientProvider>
          <TopBar />
          {children}
          <Footer />
          <VisitTracker />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
