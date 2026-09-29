import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EDITABLE_PAGES, type EditablePage } from "@/lib/pageText";

export default async function AdminPageTextsIndex() {
  const t = await getTranslations("admin.pageTexts");
  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="admin-hint">{t("intro")}</p>
      <div className="admin-cards">
        {(Object.keys(EDITABLE_PAGES) as EditablePage[]).map((page) => (
          <Link className="admin-card admin-card-link" href={`/admin/pages/${page}`} key={page}>
            <span className="admin-card-value">{t(`pages.${page}`)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
