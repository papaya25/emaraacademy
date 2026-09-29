import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { rich } from "@/lib/rich";
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
  // Parts that a language no longer has text for are left out (Arabic leads;
  // English/Spanish keep theirs until they're re-translated from the Arabic).
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
            <h1>{t.rich("hero.title", rich)}</h1>
            <p className="title-sub">{t("hero.subtitle")}</p>
            <HeroActions />
            <p className="title-place">{t("hero.place")}</p>
          </div>
        </div>
      </section>

      {/* Table of contents — programs */}
      <section className="chapters" id="programs">
        <div className="wrap">
          <Reveal className="contents-head">
            <span className="smallcaps">{t("programs.eyebrow")}</span>
            <h2>{t("programs.title")}</h2>
            {t.has("programs.lede") && <p className="contents-lede">{t("programs.lede")}</p>}
          </Reveal>
          <Reveal>
            <ProgramShelf />
          </Reveal>
        </div>
      </section>

      {/* Chapter I — the problem / for new Muslims */}
      {t.has("newMuslims.title") && (
        <section className="spread" id="new-muslims">
          <div className="wrap spread-grid">
            <Reveal>
              <p className="folio">{t("newMuslims.folio")}</p>
              <h2>{t.rich("newMuslims.title", rich)}</h2>
            </Reveal>
            <Reveal className="lede-col">
              <p className="dropcap">{t("newMuslims.p1")}</p>
              <p>{t("newMuslims.p2")}</p>
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
            <span className="smallcaps">{t("events.eyebrow")}</span>
            <h2>{t("events.title")}</h2>
            <p>{t("events.lede")}</p>
          </Reveal>
          <Reveal>
            {t.has("events.cadence") && (
              <p className="events-cadence-line">{t("events.cadence")}</p>
            )}
            <div className="events-actions">
              <Link className="btn btn-green" href="/events">
                {t("events.cta")}
              </Link>
              {t.has("events.note") && <p className="events-note">{t("events.note")}</p>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="wrap narrow">
          <Reveal>
            <span className="smallcaps">{t("newsletter.eyebrow")}</span>
            <h2>{t("newsletter.title")}</h2>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>

      {/* Impact stats */}
      <section className="impact">
        <div className="wrap">
          <Reveal>
            <span className="smallcaps impact-eyebrow">{t("impact.eyebrow")}</span>
            <ImpactStats />
          </Reveal>
        </div>
      </section>

      {/* Volunteer */}
      {t.has("volunteer.title") && (
        <section className="volunteer">
          <div className="wrap">
            <Reveal className="volunteer-grid">
              <div>
                <span className="smallcaps">{t("volunteer.eyebrow")}</span>
                <h2>
                  <em>{t("volunteer.title")}</em>
                </h2>
                <p className="lede">{t("volunteer.lede")}</p>
                <div className="role-list">
                  {ROLES.map((r) => (
                    <span key={r}>{t(`volunteer.roles.${r}`)}</span>
                  ))}
                </div>
              </div>
              <Link className="btn btn-green" href="/contact">
                {t("volunteer.cta")}
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {t.has("contactCta.title") && (
        <section className="contact-cta" id="contact">
          <div className="wrap narrow">
            <Reveal>
              <span className="smallcaps">{t("contactCta.eyebrow")}</span>
              <h2>{t.rich("contactCta.title", rich)}</h2>
              <p>{t("contactCta.lede")}</p>
              <Link className="btn btn-green" href="/contact">
                {t("contactCta.cta")}
              </Link>
            </Reveal>
          </div>
        </section>
      )}
    </main>
  );
}
