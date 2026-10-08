import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import { rich } from "@/lib/rich";
import { hasText } from "@/lib/pageText";
import { CORAN_PHOTOS } from "@/lib/coranCampaign";
import CoranRequestForm from "@/components/CoranRequestForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coran.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { images: [CORAN_PHOTOS[2].src] },
  };
}

/** "Un Corán para ti" — the free Qur'an campaign page. */
export default function CoranPage() {
  const t = useTranslations("coran");
  const has = (key: string) => hasText(t, key); // empty (admin → Page texts) = hidden
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          {has("ornament") && <p className="ar">{t("ornament")}</p>}
          <Rosette />
          {has("title") && <h1>{t("title")}</h1>}
          {has("lede") && <p>{t("lede")}</p>}
          <a className="btn btn-green coran-jump" href="#coran-form">
            {t("form.title")}
          </a>
        </div>
      </section>

      <section className="coran-gallery">
        <div className="wrap">
          {CORAN_PHOTOS.map((p, i) => (
            <Image
              key={p.src}
              src={p.src}
              alt={t(`photos.${p.alt}`)}
              width={p.width}
              height={p.height}
              sizes="(max-width: 760px) 50vw, 25vw"
              priority={i < 2}
            />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>{has("gift.title") && <h2>{t.rich("gift.title", rich)}</h2>}</Reveal>
          <Reveal className="about-body">
            {has("gift.p1") && <p>{t("gift.p1")}</p>}
            {has("gift.quote") && <blockquote className="coran-quote">{t("gift.quote")}</blockquote>}
          </Reveal>
        </div>
      </section>

      <section className="coran-form-section" id="coran-form">
        <div className="wrap narrow">
          {has("form.title") && <h2>{t("form.title")}</h2>}
          {has("form.lede") && <p>{t("form.lede")}</p>}
          <div className="corr-plate coran-plate">
            <CoranRequestForm />
          </div>
        </div>
      </section>
    </main>
  );
}
