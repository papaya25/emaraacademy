import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import EventsBoard from "@/components/EventsBoard";
import { rich } from "@/lib/rich";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events.meta" });
  return { title: t("title"), description: t("description") };
}

export default function EventsPage() {
  const t = useTranslations("events");
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">الفعاليات</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>

      <section className="evb-section">
        <div className="wrap">
          <Reveal>
            <EventsBoard />
          </Reveal>
        </div>
      </section>

      <section className="spread">
        <div className="wrap spread-grid">
          <Reveal>
            <p className="folio">إن شاء الله</p>
            <h2>{t.rich("cta.title", rich)}</h2>
          </Reveal>
          <Reveal className="lede-col">
            <p>{t("cta.lede")}</p>
            <div className="spread-cta">
              <Link className="btn btn-green" href="/contact">
                {t("cta.reserve")}
              </Link>
              <Link className="btn btn-ghost" href="/programs">
                {t("cta.programs")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
