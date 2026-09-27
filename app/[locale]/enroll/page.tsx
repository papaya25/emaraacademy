import { Suspense } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Rosette from "@/components/Rosette";
import EnrollForm from "@/components/EnrollForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "enrollPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default function EnrollPage() {
  const t = useTranslations("enrollPage");
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">التسجيل</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>

      <section className="evb-section">
        <div className="wrap">
          {/* EnrollForm reads ?class= from the URL */}
          <Suspense>
            <EnrollForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
