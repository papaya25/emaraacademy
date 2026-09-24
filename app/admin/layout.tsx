import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

// Keep every admin page out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
