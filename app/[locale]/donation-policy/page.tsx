import { use } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PolicyPage from "@/components/PolicyPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "policies.donation.meta" });
  return { title: t("title"), description: t("description") };
}

export default function DonationPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale(use(params).locale); // lets this page be prerendered as static HTML
  return <PolicyPage policy="donation" arabic="الصدقات" />;
}
