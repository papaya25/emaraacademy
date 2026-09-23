import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Rosette from "@/components/Rosette";
import ContactSection from "@/components/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return { title: t("title"), description: t("description") };
}

export default function ContactPage() {
  const t = useTranslations("contact");
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">المراسلات</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
