import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import WhatsAppLink from "@/components/WhatsAppLink";
import { rich } from "@/lib/rich";
import { arabicIndicNumeral } from "@/lib/arabicNumerals";
import { hasText } from "@/lib/pageText";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newMuslims.meta" });
  return { title: t("title"), description: t("description") };
}

export default function NewMuslimsPage() {
  const t = useTranslations("newMuslims");
  const tShared = useTranslations("shared");
  const has = (key: string) => hasText(t, key); // empty (admin → Page texts) = hidden
  // Arabic leads: it has the new "path" list; English/Spanish keep the older
  // sections until they're re-translated from the Arabic.
  const steps = (
    t.has("steps.items") ? (t.raw("steps.items") as { title: string; desc: string }[]) : []
  ).filter((s) => s.title);
  const path = (t.has("path") ? (t.raw("path") as { title: string; items: string[] }[]) : [])
    .filter((s) => s.title)
    .map((s) => ({ ...s, items: s.items.filter(Boolean) }));
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

      {has("steps.title") && (
        <section className="about-section">
          <div className="wrap about-grid">
            <Reveal>
              {has("steps.folio") && <p className="folio">{t("steps.folio")}</p>}
              {has("steps.title") && <h2>{t.rich("steps.title", rich)}</h2>}
            </Reveal>
            <Reveal>
              <ul className="values-list">
                {steps.map((s, i) => (
                  <li key={s.title}>
                    <span className="v-num" aria-hidden="true">
                      {arabicIndicNumeral(i + 1)}
                    </span>
                    <div>
                      <h3>{s.title}</h3>
                      {s.desc && <p>{s.desc}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {has("asYouAre.title") && (
        <section className="about-section">
          <div className="wrap about-grid">
            <Reveal>
              {has("asYouAre.folio") && <p className="folio">{t("asYouAre.folio")}</p>}
              {has("asYouAre.title") && <h2>{t.rich("asYouAre.title", rich)}</h2>}
            </Reveal>
            <Reveal className="about-body">
              {has("asYouAre.p1") && <p className="dropcap">{t("asYouAre.p1")}</p>}
              {has("asYouAre.p2") && <p>{t("asYouAre.p2")}</p>}
              {has("asYouAre.faqLink") && (
                <p>
                  <Link href="/faq">{t("asYouAre.faqLink")}</Link>
                </p>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {path.length > 0 && (
        <section className="about-section">
          <div className="wrap narrow">
            <Reveal>
              <ul className="values-list">
                {path.map((step, i) => (
                  <li key={step.title}>
                    <span className="v-num" aria-hidden="true">
                      {arabicIndicNumeral(i + 1)}
                    </span>
                    <div>
                      <h3>{step.title}</h3>
                      {step.items.length > 0 && (
                        <ul className="path-items">
                          {step.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      <section className="contact-cta">
        <div className="wrap narrow">
          <Reveal>
            {has("cta.eyebrow") && <span className="smallcaps">{t("cta.eyebrow")}</span>}
            {has("cta.title") && <h2>{t.rich("cta.title", rich)}</h2>}
            {has("cta.lede") && <p>{t("cta.lede")}</p>}
            <div className="title-actions">
              <Link className="btn btn-green" href="/classes">
                {tShared("joinAClass")}
              </Link>
              <WhatsAppLink
                className="btn btn-ghost"
                message={tShared("whatsappGreeting")}
              >
                {tShared("talkToSomeoneFirst")}
              </WhatsAppLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
