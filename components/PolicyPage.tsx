import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Rosette from "./Rosette";

export type PolicySection = { heading: string; paragraphs: string[] };
export type PolicyKey = "privacy" | "donation" | "acceptance";

/** A legal policy page; its text lives in messages under `policies.<policy>`. */
export default function PolicyPage({ policy, arabic }: { policy: PolicyKey; arabic: string }) {
  const t = useTranslations("policies");
  const sections = t.raw(`${policy}.sections`) as PolicySection[];
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">{arabic}</p>
          <Rosette />
          <h1>{t(`${policy}.title`)}</h1>
          <p>{t(`${policy}.intro`)}</p>
        </div>
      </section>
      <section className="policy-body">
        <div className="wrap narrow">
          {sections.map((s) => (
            <div className="policy-section" key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ))}
          <div className="policy-section policy-footer-note">
            <p>
              {t.rich("common.questions", {
                write: (c) => <Link href="/contact">{c}</Link>,
              })}
            </p>
            <p className="policy-updated">{t("common.updated")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
