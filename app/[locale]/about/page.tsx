import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import { rich } from "@/lib/rich";
import { arabicIndicNumeral } from "@/lib/arabicNumerals";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return { title: t("title"), description: t("description") };
}

export default function AboutPage() {
  const t = useTranslations("about");
  const values = t.raw("values.items") as { title: string; desc: string }[];
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">عِمَارَة</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الأول</p>
            <h2>{t.rich("story.title", rich)}</h2>
          </Reveal>
          <Reveal className="about-body">
            <p className="dropcap">{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
            <p>{t("story.p3")}</p>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الثاني</p>
            <h2>{t.rich("name.title", rich)}</h2>
          </Reveal>
          <Reveal className="about-body">
            <p>{t.rich("name.p1", rich)}</p>
            <p>{t("name.p2")}</p>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الثالث</p>
            <h2>{t.rich("work.title", rich)}</h2>
          </Reveal>
          <Reveal className="about-body">
            <p>{t("work.p1")}</p>
            <p>{t("work.p2")}</p>
            <p>
              <Link href="/programs" className="transparency-cta-link">
                {t("work.link")}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الرابع</p>
            <h2>{t("values.title")}</h2>
          </Reveal>
          <Reveal>
            <ul className="values-list">
              {values.map((v, i) => (
                <li key={v.title}>
                  <span className="v-num" aria-hidden="true">
                    {arabicIndicNumeral(i + 1)}
                  </span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الخامس</p>
            <h2>{t.rich("future.title", rich)}</h2>
          </Reveal>
          <Reveal className="about-body">
            <p>{t("future.p1")}</p>
            <p>{t("future.p2")}</p>
            <p>
              {t.rich("future.p3", {
                volunteer: (c) => <Link href="/contact">{c}</Link>,
                write: (c) => <Link href="/contact">{c}</Link>,
              })}
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
