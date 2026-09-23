import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { rich } from "@/lib/rich";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import ProgramShelf from "@/components/ProgramShelf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "programs.meta" });
  return { title: t("title"), description: t("description") };
}

export default function ProgramsPage() {
  const t = useTranslations("programs");
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">الفهرس</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>

      <section className="chapters">
        <div className="wrap">
          <Reveal>
            <ProgramShelf />
          </Reveal>
        </div>
      </section>

      <section className="contact-cta">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">{t("involved.eyebrow")}</span>
            <h2>{t.rich("involved.title", rich)}</h2>
            <p>{t("involved.lede")}</p>
            <div className="spread-cta">
              <Link className="btn btn-green" href="/contact">
                {t("involved.cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
