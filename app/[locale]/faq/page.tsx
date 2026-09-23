import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import { rich } from "@/lib/rich";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq.meta" });
  return { title: t("title"), description: t("description") };
}

type FaqItem = { q: string; a: string };

function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details className="faq-item" key={item.q}>
          <summary>
            <span className="faq-q">{item.q}</span>
            <span className="faq-marker" aria-hidden="true" />
          </summary>
          <p className="faq-a">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const t = useTranslations("faq");
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">سؤال وجواب</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الأول</p>
            <h2>{t.rich("newMuslims.title", rich)}</h2>
          </Reveal>
          <Reveal>
            <FaqList items={t.raw("newMuslims.items") as FaqItem[]} />
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الفصل الثاني</p>
            <h2>{t.rich("donors.title", rich)}</h2>
          </Reveal>
          <Reveal>
            <FaqList items={t.raw("donors.items") as FaqItem[]} />
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
