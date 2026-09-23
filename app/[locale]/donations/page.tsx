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
  const t = await getTranslations({ locale, namespace: "donations.meta" });
  return { title: t("title"), description: t("description") };
}

// TODO: read from Supabase once donations go live — sample row until then
// (its month/note text is in messages under donations.sample).
const SAMPLE = { raised: 1850, goal: 5000 };

export default function DonationsPage() {
  const t = useTranslations("donations");
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">سِجِلّ</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">الأمانة</p>
            <h2>{t.rich("heading", rich)}</h2>
          </Reveal>
          <Reveal className="about-body">
            <p>{t("body")}</p>
            <div className="ledger-table" role="table" aria-label={t("table")}>
              <div className="ledger-row ledger-head" role="row">
                <span role="columnheader">{t("month")}</span>
                <span role="columnheader">{t("raised")}</span>
                <span role="columnheader">{t("goal")}</span>
                <span role="columnheader">{t("directedTo")}</span>
              </div>
              <div className="ledger-row" role="row">
                <span role="cell">{t("sample.month")}</span>
                <span role="cell">
                  <bdi>${SAMPLE.raised.toLocaleString("en-US")}</bdi>
                </span>
                <span role="cell">
                  <bdi>${SAMPLE.goal.toLocaleString("en-US")}</bdi>
                </span>
                <span role="cell">{t("sample.note")}</span>
              </div>
            </div>
            <p className="ledger-note">{t("note")}</p>
            <p>
              {t.rich("questions", {
                write: (c) => <Link href="/contact">{c}</Link>,
              })}
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
