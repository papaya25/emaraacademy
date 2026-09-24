"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { upsertEvent, deleteEvent } from "@/app/admin/actions";
import LangTabs from "@/components/admin/LangTabs";

type EventRow = {
  id: string;
  title: string;
  meta: string | null;
  city: string | null;
  type: string;
  event_date: string;
  time: string | null;
  location: string | null;
  presenter: string | null;
  title_es?: string | null;
  meta_es?: string | null;
  title_ar?: string | null;
  meta_ar?: string | null;
};

const TYPES = ["weekly", "monthly", "quarterly", "special"] as const;

export default function EventsAdmin({ events }: { events: EventRow[] }) {
  const t = useTranslations("admin");
  const [editing, setEditing] = useState<EventRow | null>(null);
  const typeLabel = (type: string) =>
    (TYPES as readonly string[]).includes(type) ? t(`events.types.${type}`) : type;

  // Title and notes per language; English (no suffix) is required.
  const textFields = (suffix: "" | "_es" | "_ar") => (
    <>
      <label>
        {t("events.titleField")}
        <input
          name={`title${suffix}`}
          defaultValue={(editing?.[`title${suffix}`] as string | null | undefined) ?? ""}
          required={suffix === ""}
        />
      </label>
      <label>
        {t("events.notes")}
        <input
          name={`meta${suffix}`}
          defaultValue={(editing?.[`meta${suffix}`] as string | null | undefined) ?? ""}
        />
      </label>
    </>
  );

  return (
    <div>
      <details className="admin-card admin-details" open={!!editing}>
        <summary>{editing ? t("events.editing", { title: editing.title }) : t("events.add")}</summary>
        <form
          action={async (fd) => {
            await upsertEvent(fd);
            setEditing(null);
          }}
          className="admin-form"
          key={editing?.id ?? "new"}
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <LangTabs en={textFields("")} es={textFields("_es")} ar={textFields("_ar")} />
          <div className="admin-form-row">
            <label>
              {t("events.type")}
              <select name="type" defaultValue={editing?.type ?? "weekly"}>
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`events.types.${type}`)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("events.city")}
              <input name="city" defaultValue={editing?.city ?? ""} />
            </label>
            <label>
              {t("events.date")}
              <input type="date" name="event_date" defaultValue={editing?.event_date} required />
            </label>
            <label>
              {t("events.time")}
              <input name="time" placeholder="7:00 PM" defaultValue={editing?.time ?? ""} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              {t("events.location")}
              <input name="location" defaultValue={editing?.location ?? ""} />
            </label>
            <label>
              {t("events.presenter")}
              <input name="presenter" defaultValue={editing?.presenter ?? ""} />
            </label>
          </div>
          <div className="admin-form-row">
            <button className="btn btn-green" type="submit">
              {editing ? t("common.saveChanges") : t("events.addButton")}
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
            <th>{t("events.col.date")}</th>
            <th>{t("events.col.title")}</th>
            <th>{t("events.col.type")}</th>
            <th>{t("events.col.city")}</th>
            <th>{t("events.col.location")}</th>
            <th>{t("events.col.presenter")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan={7} className="admin-hint">
                {t("events.empty")}
              </td>
            </tr>
          )}
          {events.map((e) => (
            <tr key={e.id}>
              <td>{e.event_date}</td>
              <td>{e.title}</td>
              <td>{typeLabel(e.type)}</td>
              <td>{e.city ?? t("common.all")}</td>
              <td>{e.location ?? "—"}</td>
              <td>{e.presenter ?? "—"}</td>
              <td className="admin-table-actions">
                <button type="button" className="admin-link" onClick={() => setEditing(e)}>
                  {t("common.edit")}
                </button>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={e.id} />
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
