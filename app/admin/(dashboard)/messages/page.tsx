import { createClient } from "@/lib/supabase/server";
import { deleteMessage } from "@/app/admin/actions";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Messages</h1>
      <p className="admin-hint">
        Sent from the contact form. Delete a message once you&rsquo;ve handled it.
      </p>
      {(messages ?? []).length === 0 ? (
        <p className="admin-hint">No messages yet.</p>
      ) : (
        (messages ?? []).map((m) => (
          <div className="admin-card" key={m.id}>
            <div className="admin-message-head">
              <div>
                <strong>{m.name}</strong> · {m.email}
                {m.reason && <span className="admin-message-reason"> · {m.reason}</span>}
              </div>
              <span className="admin-hint">
                {new Date(m.created_at).toLocaleString()}
              </span>
            </div>
            <p>{m.message}</p>
            <form action={deleteMessage}>
              <input type="hidden" name="id" value={m.id} />
              <button type="submit" className="admin-link admin-link-danger">
                Delete
              </button>
            </form>
          </div>
        ))
      )}
    </div>
  );
}
