import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PolicyPage from "@/components/PolicyPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "policies.privacy.meta" });
  return { title: t("title"), description: t("description") };
}

export default function PrivacyPolicyPage() {
  return <PolicyPage policy="privacy" arabic="الخصوصية" />;
}
