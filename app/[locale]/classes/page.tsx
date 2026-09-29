import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import ClassesBoard from "@/components/ClassesBoard";
import { rich } from "@/lib/rich";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "classes.meta" });
  return { title: t("title"), description: t("description") };
}

export default function ClassesPage() {
  const t = useTranslations("classes");
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">الدروس</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>

      <section className="evb-section">
        <div className="wrap">
          <Reveal>
            <ClassesBoard />
          </Reveal>
        </div>
      </section>

      <section className="contact-cta">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">{t("cta.eyebrow")}</span>
            <h2>{t.rich("cta.title", rich)}</h2>
            <p>{t("cta.lede")}</p>
            <Link className="btn btn-green" href="/contact">
              {t("cta.button")}
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
