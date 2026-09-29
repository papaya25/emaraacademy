import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import { rich } from "@/lib/rich";
import { arabicIndicNumeral } from "@/lib/arabicNumerals";
import { hasText } from "@/lib/pageText";

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
  const has = (key: string) => hasText(t, key); // empty (admin → Page texts) = hidden
  const values = (t.raw("values.items") as { title: string; desc: string }[]).filter((v) => v.title);
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          {has("ornament") && <p className="ar">{t("ornament")}</p>}
          <Rosette />
          {has("title") && <h1>{t("title")}</h1>}
          {has("lede") && <p>{t("lede")}</p>}
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            {has("story.folio") && <p className="folio">{t("story.folio")}</p>}
            {has("story.title") && <h2>{t.rich("story.title", rich)}</h2>}
          </Reveal>
          <Reveal className="about-body">
            {has("story.p1") && <p className="dropcap">{t("story.p1")}</p>}
            {has("story.p2") && <p>{t("story.p2")}</p>}
            {has("story.p3") && <p>{t("story.p3")}</p>}
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            {has("name.folio") && <p className="folio">{t("name.folio")}</p>}
            {has("name.title") && <h2>{t.rich("name.title", rich)}</h2>}
          </Reveal>
          <Reveal className="about-body">
            {has("name.p1") && <p>{t.rich("name.p1", rich)}</p>}
            {has("name.p2") && <p>{t("name.p2")}</p>}
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            {has("work.folio") && <p className="folio">{t("work.folio")}</p>}
            {has("work.title") && <h2>{t.rich("work.title", rich)}</h2>}
          </Reveal>
          <Reveal className="about-body">
            {has("work.p1") && <p>{t("work.p1")}</p>}
            {has("work.p2") && <p>{t("work.p2")}</p>}
            {has("work.link") && (
              <p>
                <Link href="/programs" className="transparency-cta-link">
                  {t("work.link")}
                </Link>
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            {has("values.folio") && <p className="folio">{t("values.folio")}</p>}
            {has("values.title") && <h2>{t("values.title")}</h2>}
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
                    {v.desc && <p>{v.desc}</p>}
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
            {has("future.folio") && <p className="folio">{t("future.folio")}</p>}
            {has("future.title") && <h2>{t.rich("future.title", rich)}</h2>}
          </Reveal>
          <Reveal className="about-body">
            {has("future.p1") && <p>{t("future.p1")}</p>}
            {has("future.p2") && <p>{t("future.p2")}</p>}
            {has("future.p3") && (
              <p>
                {t.rich("future.p3", {
                  volunteer: (c) => <Link href="/contact">{c}</Link>,
                  write: (c) => <Link href="/contact">{c}</Link>,
                })}
              </p>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
