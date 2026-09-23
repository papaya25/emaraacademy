import { useTranslations } from "next-intl";

export default function HeroActions() {
  const t = useTranslations("shared");
  return (
    <div className="title-actions">
      <a className="btn btn-green" href="#programs">
        {t("seeOurWork")}
      </a>
    </div>
  );
}
