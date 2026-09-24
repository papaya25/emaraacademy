"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { upsertClass, deleteClass } from "@/app/admin/actions";
import LangTabs from "@/components/admin/LangTabs";

type ClassRow = {
  id: string;
  subject: string;
  blurb: string | null;
  track: string;
  language: string;
  city: string;
  location: string | null;
  day: string | null;
  time: string | null;
  format: string;
  status: string;
  sort_order: number;
  subject_es?: string | null;
  blurb_es?: string | null;
  subject_ar?: string | null;
  blurb_ar?: string | null;
};

const STATUSES = ["Open", "Starting soon", "Full"] as const;
const FORMATS = ["In person", "Online"] as const;

export default function ClassesAdmin({ classes }: { classes: ClassRow[] }) {
  const t = useTranslations("admin");
  const [editing, setEditing] = useState<ClassRow | null>(null);
  const statusLabel = (s: string) =>
    (STATUSES as readonly string[]).includes(s) ? t(`classes.statuses.${s}`) : s;

  // Subject and description per language; English (no suffix) is required.
  const textFields = (suffix: "" | "_es" | "_ar") => (
    <>
      <label>
        {t("classes.subject")}
        <input
          name={`subject${suffix}`}
          defaultValue={(editing?.[`subject${suffix}`] as string | null | undefined) ?? ""}
          required={suffix === ""}
        />
      </label>
      <label>
        {t("classes.blurb")}
        <textarea
          name={`blurb${suffix}`}
          defaultValue={(editing?.[`blurb${suffix}`] as string | null | undefined) ?? ""}
          rows={2}
        />
      </label>
    </>
  );

  return (
    <div>
      <details className="admin-card admin-details" open={!!editing}>
        <summary>
          {editing ? t("classes.editing", { title: editing.subject }) : t("classes.add")}
        </summary>
        <form
          action={async (fd) => {
            await upsertClass(fd);
            setEditing(null);
          }}
          className="admin-form"
          key={editing?.id ?? "new"}
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <LangTabs en={textFields("")} es={textFields("_es")} ar={textFields("_ar")} />
          <div className="admin-form-row">
            <label>
              {t("classes.city")}
              <input name="city" defaultValue={editing?.city} required />
            </label>
            <label>
              {t("classes.location")}
              <input
                name="location"
                placeholder="Mezquita Al-Noor, Av. 10 Nte"
                defaultValue={editing?.location ?? ""}
              />
            </label>
            <label>
              {t("classes.track")}
              <input name="track" defaultValue={editing?.track ?? "Foundations"} />
            </label>
            <label>
              {t("classes.language")}
              <input name="language" defaultValue={editing?.language ?? "Español"} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              {t("classes.day")}
              <input name="day" placeholder="Thursdays" defaultValue={editing?.day ?? ""} />
            </label>
            <label>
              {t("classes.time")}
              <input name="time" placeholder="7:00 PM" defaultValue={editing?.time ?? ""} />
            </label>
            <label>
              {t("classes.format")}
              <select name="format" defaultValue={editing?.format ?? "In person"}>
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {t(`classes.formats.${f}`)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("classes.status")}
              <select name="status" defaultValue={editing?.status ?? "Open"}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`classes.statuses.${s}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            {t("classes.sortOrder")}
            <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} />
          </label>
          <div className="admin-form-row">
            <button className="btn btn-green" type="submit">
              {editing ? t("common.saveChanges") : t("classes.addButton")}
            </button>
            {editing && (
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
                {t("common.cancel")}
              </button>
            )}
          </div>
        </form>
      </details>

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t("classes.col.subject")}</th>
            <th>{t("classes.col.city")}</th>
            <th>{t("classes.col.location")}</th>
            <th>{t("classes.col.dayTime")}</th>
            <th>{t("classes.col.status")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 && (
            <tr>
              <td colSpan={6} className="admin-hint">
                {t("classes.empty")}
              </td>
            </tr>
          )}
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.subject}</td>
              <td>{c.city}</td>
              <td>{c.location ?? "—"}</td>
              <td>
                {c.day} {c.time}
              </td>
              <td>{statusLabel(c.status)}</td>
              <td className="admin-table-actions">
                <button type="button" className="admin-link" onClick={() => setEditing(c)}>
                  {t("common.edit")}
                </button>
                <form action={deleteClass}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="admin-link admin-link-danger">
                    {t("common.delete")}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
