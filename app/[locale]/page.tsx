import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { rich } from "@/lib/rich";
import { hasText } from "@/lib/pageText";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import NewsletterForm from "@/components/NewsletterForm";
import ImpactStats from "@/components/ImpactStats";
import ProgramShelf from "@/components/ProgramShelf";
import HeroActions from "@/components/HeroActions";
import WhatsAppLink from "@/components/WhatsAppLink";

const ROLES = ["assistant", "mentor", "translator", "eventHelper", "retreat"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return { title: t("title"), description: t("description") };
}

export default function Home() {
  const t = useTranslations("home");
  const tShared = useTranslations("shared");
  const tNav = useTranslations("nav");
  // A text shows only when this language has it and it isn't empty — so the
  // admin (Page texts) can hide a line by emptying it, and English/Spanish
  // keep parts the Arabic dropped until they're re-translated.
  const has = (key: string) => hasText(t, key);
  return (
    <main>
      {/* Title page */}
      <section className="titlepage">
        <div className="wrap">
          <div className="plate">
            <span className="corner" />
            <Image
              className="title-logo"
              src="/logo.png"
              alt={tNav("logoAlt")}
              width={104}
              height={146}
              priority
            />
            <Rosette />
            {has("hero.title") && <h1>{t.rich("hero.title", rich)}</h1>}
            {has("hero.subtitle") && <p className="title-sub">{t("hero.subtitle")}</p>}
            <HeroActions />
            {has("hero.place") && <p className="title-place">{t("hero.place")}</p>}
          </div>
        </div>
      </section>

      {/* Table of contents — programs */}
      <section className="chapters" id="programs">
        <div className="wrap">
          <Reveal className="contents-head">
            {has("programs.eyebrow") && <span className="smallcaps">{t("programs.eyebrow")}</span>}
            {has("programs.title") && <h2>{t("programs.title")}</h2>}
            {has("programs.lede") && <p className="contents-lede">{t("programs.lede")}</p>}
          </Reveal>
          <Reveal>
            <ProgramShelf />
          </Reveal>
        </div>
      </section>

      {/* Campaign: Un Corán para ti — remove when it ends */}
      {has("coran.title") && (
        <section className="coran-home">
          <div className="wrap coran-home-grid">
            <Reveal>
              <Image
                src="/campaign/coran-caja-regalo.jpg"
                alt={t("coran.title")}
                width={1312}
                height={1199}
                sizes="(max-width: 760px) 100vw, 45vw"
              />
            </Reveal>
            <Reveal>
              {has("coran.eyebrow") && <span className="smallcaps">{t("coran.eyebrow")}</span>}
              <h2>{t("coran.title")}</h2>
              {has("coran.lede") && <p>{t("coran.lede")}</p>}
              {has("coran.cta") && (
                <Link className="btn btn-green" href="/coran">
                  {t("coran.cta")}
                </Link>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* Chapter I — the problem / for new Muslims */}
      {has("newMuslims.title") && (
        <section className="spread" id="new-muslims">
          <div className="wrap spread-grid">
            <Reveal>
              {has("newMuslims.folio") && <p className="folio">{t("newMuslims.folio")}</p>}
              {has("newMuslims.title") && <h2>{t.rich("newMuslims.title", rich)}</h2>}
            </Reveal>
            <Reveal className="lede-col">
              {has("newMuslims.p1") && <p className="dropcap">{t("newMuslims.p1")}</p>}
              {has("newMuslims.p2") && <p>{t("newMuslims.p2")}</p>}
              <div className="spread-cta">
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
      )}

      {/* Events */}
      <section className="events" id="events">
        <div className="wrap">
          <Reveal className="events-head">
            {has("events.eyebrow") && <span className="smallcaps">{t("events.eyebrow")}</span>}
            {has("events.title") && <h2>{t("events.title")}</h2>}
            {has("events.lede") && <p>{t("events.lede")}</p>}
          </Reveal>
          <Reveal>
            {has("events.cadence") && <p className="events-cadence-line">{t("events.cadence")}</p>}
            <div className="events-actions">
              {has("events.cta") && (
                <Link className="btn btn-green" href="/events">
                  {t("events.cta")}
                </Link>
              )}
              {has("events.note") && <p className="events-note">{t("events.note")}</p>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="wrap narrow">
          <Reveal>
            {has("newsletter.eyebrow") && <span className="smallcaps">{t("newsletter.eyebrow")}</span>}
            {has("newsletter.title") && <h2>{t("newsletter.title")}</h2>}
            <NewsletterForm />
          </Reveal>
        </div>
      </section>

      {/* Impact stats */}
      <section className="impact">
        <div className="wrap">
          <Reveal>
            {has("impact.eyebrow") && <span className="smallcaps impact-eyebrow">{t("impact.eyebrow")}</span>}
            <ImpactStats />
          </Reveal>
        </div>
      </section>

      {/* Volunteer */}
      {has("volunteer.title") && (
        <section className="volunteer">
          <div className="wrap">
            <Reveal className="volunteer-grid">
              <div>
                {has("volunteer.eyebrow") && <span className="smallcaps">{t("volunteer.eyebrow")}</span>}
                <h2>
                  <em>{t("volunteer.title")}</em>
                </h2>
                {has("volunteer.lede") && <p className="lede">{t("volunteer.lede")}</p>}
                <div className="role-list">
                  {ROLES.filter((r) => has(`volunteer.roles.${r}`)).map((r) => (
                    <span key={r}>{t(`volunteer.roles.${r}`)}</span>
                  ))}
                </div>
              </div>
              {has("volunteer.cta") && (
                <Link className="btn btn-green" href="/contact">
                  {t("volunteer.cta")}
                </Link>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {has("contactCta.title") && (
        <section className="contact-cta" id="contact">
          <div className="wrap narrow">
            <Reveal>
              {has("contactCta.eyebrow") && <span className="smallcaps">{t("contactCta.eyebrow")}</span>}
              {has("contactCta.title") && <h2>{t.rich("contactCta.title", rich)}</h2>}
              {has("contactCta.lede") && <p>{t("contactCta.lede")}</p>}
              {has("contactCta.cta") && (
                <Link className="btn btn-green" href="/contact">
                  {t("contactCta.cta")}
                </Link>
              )}
            </Reveal>
          </div>
        </section>
      )}
    </main>
  );
}
