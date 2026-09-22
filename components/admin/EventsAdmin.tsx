"use client";

import { useState } from "react";
import { upsertEvent, deleteEvent } from "@/app/admin/actions";

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
};

const TYPES = ["weekly", "monthly", "quarterly", "special"];

export default function EventsAdmin({ events }: { events: EventRow[] }) {
  const [editing, setEditing] = useState<EventRow | null>(null);

  return (
    <div>
      <details className="admin-card admin-details" open={!!editing}>
        <summary>{editing ? `Editing: ${editing.title}` : "Add a new event"}</summary>
        <form
          action={async (fd) => {
            await upsertEvent(fd);
            setEditing(null);
          }}
          className="admin-form"
          key={editing?.id ?? "new"}
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <label>
            Title
            <input name="title" defaultValue={editing?.title} required />
          </label>
          <div className="admin-form-row">
            <label>
              Type
              <select name="type" defaultValue={editing?.type ?? "weekly"}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              City (blank = all cities)
              <input name="city" defaultValue={editing?.city ?? ""} />
            </label>
            <label>
              Date
              <input type="date" name="event_date" defaultValue={editing?.event_date} required />
            </label>
            <label>
              Time
              <input name="time" placeholder="7:00 PM" defaultValue={editing?.time ?? ""} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              Location
              <input name="location" defaultValue={editing?.location ?? ""} />
            </label>
            <label>
              Presenter
              <input name="presenter" defaultValue={editing?.presenter ?? ""} />
            </label>
          </div>
          <label>
            Notes (shown under the event)
            <input name="meta" defaultValue={editing?.meta ?? ""} />
          </label>
          <div className="admin-form-row">
            <button className="btn btn-green" type="submit">
              {editing ? "Save Changes" : "Add Event"}
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
            <th>Date</th>
            <th>Title</th>
            <th>Type</th>
            <th>City</th>
            <th>Location</th>
            <th>Presenter</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td>{e.event_date}</td>
              <td>{e.title}</td>
              <td>{e.type}</td>
              <td>{e.city ?? "All"}</td>
              <td>{e.location ?? "—"}</td>
              <td>{e.presenter ?? "—"}</td>
              <td className="admin-table-actions">
                <button type="button" className="admin-link" onClick={() => setEditing(e)}>
                  Edit
                </button>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={e.id} />
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
