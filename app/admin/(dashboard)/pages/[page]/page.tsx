import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { savePageText } from "@/app/admin/actions";
import LangTabs from "@/components/admin/LangTabs";
import {
  EDITABLE_PAGES,
  EMPTY_STORE,
  LOCALES,
  applyPageText,
  flattenPage,
  type EditablePage,
  type Locale,
  type PageTextStore,
} from "@/lib/pageText";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

const BASE_MESSAGES = { ar, en, es };

/** "home.hero.title" → "hero › title"; list positions count from 1. */
function labelOf(path: string): string {
  return path
    .split(".")
    .slice(1)
    .map((k) => (/^\d+$/.test(k) ? String(Number(k) + 1) : k))
    .join(" › ");
}

export default async function AdminPageTextEditor({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!(page in EDITABLE_PAGES)) notFound();
  const p = page as EditablePage;
  const t = await getTranslations("admin.pageTexts");

  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "page_text")
    .maybeSingle();
  const store: PageTextStore = { ...EMPTY_STORE, ...(data?.value ?? {}) };

  // What the site shows now, per language (built-in text + saved edits).
  const fields = Object.fromEntries(
    LOCALES.map((l) => [l, flattenPage(applyPageText(BASE_MESSAGES[l], store.text[l] ?? {}), p)])
  ) as Record<Locale, Record<string, string>>;

  // English/Spanish text older than the Arabic next to it needs updating.
  const outdated = (l: Locale, path: string) => {
    const u = store.updated[path];
    return l !== "ar" && !!u?.ar && (!u[l] || u[l]! < u.ar);
  };

  const panel = (l: Locale) => (
    <>
      {Object.entries(fields[l]).map(([path, text]) => (
        <label key={path}>
          <span dir="ltr">{labelOf(path)}</span>
          {outdated(l, path) && <span className="admin-outdated">{t("outdated")}</span>}
          <textarea
            name={`${l}::${path}`}
            defaultValue={text}
            rows={Math.min(8, Math.max(1, Math.ceil(text.length / 90)))}
          />
        </label>
      ))}
    </>
  );

  return (
    <div>
      <p className="admin-hint">
        <Link href="/admin/pages">← {t("title")}</Link>
      </p>
      <h1>{t(`pages.${p}`)}</h1>
      <p className="admin-hint">
        {t("help", { lt: "<", gt: ">", example: "<em>…</em>" })}
      </p>
      <form action={savePageText} className="admin-form">
        <input type="hidden" name="page" value={p} />
        <LangTabs arabicFirst ar={panel("ar")} en={panel("en")} es={panel("es")} />
        <div className="admin-form-row">
          <button className="btn btn-green" type="submit">
            {t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}
