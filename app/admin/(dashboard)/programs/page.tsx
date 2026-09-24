import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { updateProgram, createProgram, deleteProgram } from "@/app/admin/actions";
import { PROGRAMS, localizeProgram, programFromRow, type Program } from "@/lib/programs";
import LangTabs from "@/components/admin/LangTabs";

type T = Awaited<ReturnType<typeof getTranslations<"admin">>>;

/** One language's fields. English (no suffix) is required; Spanish (_es)
 *  and Arabic (_ar) may be left blank. */
function ProgramFields({ t, p, suffix }: { t: T; p?: Program; suffix: "" | "_es" | "_ar" }) {
  const required = suffix === "";
  return (
    <>
      <label>
        {t("programs.category")}
        <input name={`category${suffix}`} defaultValue={p?.category} required={required} />
      </label>
      <label>
        {t("programs.titleField")}
        <input name={`title${suffix}`} defaultValue={p?.title} required={required} />
      </label>
      <label>
        {t("programs.tagline")}
        <textarea name={`tagline${suffix}`} defaultValue={p?.tagline} rows={2} required={required} />
      </label>
      <label>
        {t("programs.whatItIs")}
        <textarea name={`what_it_is${suffix}`} defaultValue={p?.whatItIs} rows={3} required={required} />
      </label>
      <label>
        {t("programs.activities")}
        <textarea
          name={`activities${suffix}`}
          rows={6}
          defaultValue={p?.activities.map((a) => `${a.title} | ${a.desc}`).join("\n")}
        />
      </label>
      <label>
        {t("programs.problem")}
        <textarea name={`problem${suffix}`} defaultValue={p?.problem} rows={3} required={required} />
      </label>
    </>
  );
}

/** Spanish/Arabic tabs start from what the public site shows today (typed
 *  translation or the built-in one), so saving keeps it. */
function AllLanguages({ t, p }: { t: T; p?: Program }) {
  return (
    <LangTabs
      en={<ProgramFields t={t} p={p} suffix="" />}
      es={<ProgramFields t={t} p={p && localizeProgram(p, "es")} suffix="_es" />}
      ar={<ProgramFields t={t} p={p && localizeProgram(p, "ar")} suffix="_ar" />}
    />
  );
}

export default async function AdminProgramsPage() {
  const t = await getTranslations("admin");
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });

  const live = !!data && data.length > 0;
  const programs: Program[] = live ? data.map(programFromRow) : PROGRAMS;

  return (
    <div>
      <h1>{t("programs.title")}</h1>
      <p className="admin-hint">{t.rich("programs.hint", { code: (c) => <code>{c}</code> })}</p>
      {!live && <p className="admin-offline">{t("programs.offline")}</p>}

      <details className="admin-card admin-details">
        <summary>{t("programs.add")}</summary>
        <form action={createProgram} className="admin-form">
          <AllLanguages t={t} />
          <button className="btn btn-green" type="submit">
            {t("programs.addButton")}
          </button>
        </form>
      </details>

      {programs.map((p) => (
        <details className="admin-card admin-details" key={p.slug}>
          <summary>
            {p.num} · {p.title}
          </summary>
          <form action={updateProgram} className="admin-form">
            <input type="hidden" name="slug" value={p.slug} />
            <AllLanguages t={t} p={p} />
            <div className="admin-form-row">
              <button className="btn btn-green" type="submit">
                {t("common.save")}
              </button>
            </div>
          </form>
          <form action={deleteProgram} className="admin-delete-row">
            <input type="hidden" name="slug" value={p.slug} />
            <button type="submit" className="admin-link admin-link-danger">
              {t("programs.deleteThis")}
            </button>
          </form>
        </details>
      ))}
    </div>
  );
}
