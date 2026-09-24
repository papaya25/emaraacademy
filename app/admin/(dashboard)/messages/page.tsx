import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { deleteMessage } from "@/app/admin/actions";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const t = await getTranslations("admin");
  const locale = await getLocale();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>{t("messages.title")}</h1>
      <p className="admin-hint">{t("messages.hint")}</p>
      {(messages ?? []).length === 0 ? (
        <p className="admin-hint">{t("messages.empty")}</p>
      ) : (
        (messages ?? []).map((m) => (
          <div className="admin-card" key={m.id}>
            <div className="admin-message-head">
              <div>
                <strong>{m.name}</strong> · {m.email}
                {m.reason && <span className="admin-message-reason"> · {m.reason}</span>}
              </div>
              <span className="admin-hint">
                {new Date(m.created_at).toLocaleString(locale)}
              </span>
            </div>
            <p>{m.message}</p>
            <form action={deleteMessage}>
              <input type="hidden" name="id" value={m.id} />
              <button type="submit" className="admin-link admin-link-danger">
                {t("common.delete")}
              </button>
            </form>
          </div>
        ))
      )}
    </div>
  );
}
