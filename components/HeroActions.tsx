import { useTranslations } from "next-intl";
import { hasText } from "@/lib/pageText";

export default function HeroActions() {
  const t = useTranslations("shared");
  if (!hasText(t, "seeOurWork")) return null; // emptied in admin → Page texts
  return (
    <div className="title-actions">
      <a className="btn btn-green" href="#programs">
        {t("seeOurWork")}
      </a>
    </div>
  );
}
