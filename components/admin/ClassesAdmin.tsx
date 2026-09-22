"use client";

import { useState } from "react";
import { upsertClass, deleteClass } from "@/app/admin/actions";

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
};

const STATUSES = ["Open", "Starting soon", "Full"];
const FORMATS = ["In person", "Online"];

export default function ClassesAdmin({ classes }: { classes: ClassRow[] }) {
  const [editing, setEditing] = useState<ClassRow | null>(null);

  return (
    <div>
      <details className="admin-card admin-details" open={!!editing}>
        <summary>{editing ? `Editing: ${editing.subject}` : "Add a new class"}</summary>
        <form
          action={async (fd) => {
            await upsertClass(fd);
            setEditing(null);
          }}
          className="admin-form"
          key={editing?.id ?? "new"}
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <label>
            Subject
            <input name="subject" defaultValue={editing?.subject} required />
          </label>
          <label>
            Blurb
            <textarea name="blurb" defaultValue={editing?.blurb ?? ""} rows={2} />
          </label>
          <div className="admin-form-row">
            <label>
              City
              <input name="city" defaultValue={editing?.city} required />
            </label>
            <label>
              Location (address / venue)
              <input
                name="location"
                placeholder="Mezquita Al-Noor, Av. 10 Nte"
                defaultValue={editing?.location ?? ""}
              />
            </label>
            <label>
              Track
              <input name="track" defaultValue={editing?.track ?? "Foundations"} />
            </label>
            <label>
              Language
              <input name="language" defaultValue={editing?.language ?? "Español"} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              Day
              <input name="day" placeholder="Thursdays" defaultValue={editing?.day ?? ""} />
            </label>
            <label>
              Time
              <input name="time" placeholder="7:00 PM" defaultValue={editing?.time ?? ""} />
            </label>
            <label>
              Format
              <select name="format" defaultValue={editing?.format ?? "In person"}>
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue={editing?.status ?? "Open"}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Sort order (lower shows first)
            <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} />
          </label>
          <div className="admin-form-row">
            <button className="btn btn-green" type="submit">
              {editing ? "Save Changes" : "Add Class"}
            </button>
            {editing && (
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </details>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>City</th>
            <th>Location</th>
            <th>Day / Time</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 && (
            <tr>
              <td colSpan={6} className="admin-hint">
                No classes yet — add one above.
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
              <td>{c.status}</td>
              <td className="admin-table-actions">
                <button type="button" className="admin-link" onClick={() => setEditing(c)}>
                  Edit
                </button>
                <form action={deleteClass}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="admin-link admin-link-danger">
                    Delete
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
