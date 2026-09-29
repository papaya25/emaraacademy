import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import WhatsAppLink from "@/components/WhatsAppLink";
import { rich } from "@/lib/rich";
import { arabicIndicNumeral } from "@/lib/arabicNumerals";

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
  // Arabic leads: it has the new "path" list; English/Spanish keep the older
  // sections until they're re-translated from the Arabic.
  const steps = t.has("steps.items") ? (t.raw("steps.items") as { title: string; desc: string }[]) : [];
  const path = t.has("path") ? (t.raw("path") as { title: string; items: string[] }[]) : [];
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">مرحباً بك</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>

      {t.has("steps.title") && (
        <section className="about-section">
          <div className="wrap about-grid">
            <Reveal>
              <p className="folio">الفصل الأول</p>
              <h2>{t.rich("steps.title", rich)}</h2>
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
                      <p>{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {t.has("asYouAre.title") && (
        <section className="about-section">
          <div className="wrap about-grid">
            <Reveal>
              <p className="folio">الفصل الثاني</p>
              <h2>{t.rich("asYouAre.title", rich)}</h2>
            </Reveal>
            <Reveal className="about-body">
              <p className="dropcap">{t("asYouAre.p1")}</p>
              <p>{t("asYouAre.p2")}</p>
              <p>
                <Link href="/faq">{t("asYouAre.faqLink")}</Link>
              </p>
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
            <span className="smallcaps">{t("cta.eyebrow")}</span>
            <h2>{t.rich("cta.title", rich)}</h2>
            <p>{t("cta.lede")}</p>
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
