import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import Rosette from "./Rosette";
import ContactDetails from "./ContactDetails";
import { POLICY_LINKS_ENABLED } from "@/lib/policies";

const POLICIES = [
  { href: "/privacy-policy", key: "privacy" },
  { href: "/donation-policy", key: "donationPolicy" },
  { href: "/donation-acceptance-policy", key: "acceptancePolicy" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  return (
    <footer className="site-footer">
      <div className="wrap">
        <Rosette />
        <div className="footer-grid">
          <div className="footer-id">
            <Image src="/logo.png" alt={tNav("logoAlt")} width={104} height={146} />
            <p className="footer-tagline">{t("tagline")}</p>
            <p className="ar footer-ar" aria-hidden="true">
              عِمَارَة
            </p>
          </div>
          <nav className="footer-col" aria-label={t("explore")}>
            <h3>{t("explore")}</h3>
            <Link href="/new-muslims">{tNav("newMuslims")}</Link>
            <Link href="/programs">{tNav("programs")}</Link>
            <Link href="/events">{tNav("events")}</Link>
            <Link href="/about">{tNav("about")}</Link>
            <Link href="/faq">{t("faq")}</Link>
          </nav>
          <div className="footer-col" aria-label={t("contact")}>
            <h3>{t("contact")}</h3>
            <Link href="/contact">{t("writeToUs")}</Link>
            <ContactDetails />
            <p className="footer-place">
              {t("placeLine1")}
              <br />
              {t("placeLine2")}
            </p>
          </div>
          <div className="footer-col" aria-label={t("policies")}>
            <h3>{t("policies")}</h3>
            {POLICIES.map((p) =>
              POLICY_LINKS_ENABLED ? (
                <Link key={p.key} href={p.href}>
                  {t(p.key)}
                </Link>
              ) : (
                <span key={p.key} className="footer-policy-off">
                  {t(p.key)}
                </span>
              )
            )}
          </div>
        </div>
        <div className="footer-legal">
          <span>{t("copyright")}</span>
          <span>{t("legal")}</span>
        </div>
      </div>
    </footer>
  );
}
