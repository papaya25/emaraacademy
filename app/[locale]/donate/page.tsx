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
  return { title: t("title"), description: t("description") };
}

export default function DonatePage() {
  return (
    <main>
      <DonateFlow />
    </main>
  );
}
