import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DonateFlow from "@/components/DonateFlow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate.meta" });
  // Owner's call: reachable by direct link, but kept out of search results.
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default function DonatePage() {
  return (
    <main>
      <DonateFlow />
    </main>
  );
}
