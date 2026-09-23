import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Rosette from "@/components/Rosette";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">الصفحة المفقودة</p>
          <Rosette />
          <h1>{t("title")}</h1>
          <p>{t("lede")}</p>
          <div className="title-actions" style={{ marginTop: "1.6em" }}>
            <Link className="btn btn-green" href="/">
              {t("home")}
            </Link>
            <Link className="btn btn-ghost" href="/programs">
              {t("programs")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
