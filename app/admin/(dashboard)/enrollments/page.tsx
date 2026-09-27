import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { confirmEnrollment, deleteEnrollment } from "@/app/admin/actions";
import { whatsappUrl } from "@/lib/contactInfo";

type Enrollment = {
  id: string;
  class_id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: "confirmed" | "waitlist";
  created_at: string;
};

export default async function AdminEnrollmentsPage() {
  const t = await getTranslations("admin");
  const locale = await getLocale();
  const supabase = await createClient();
  const [{ data: classes }, { data: enrollments }] = await Promise.all([
    supabase
      .from("classes")
      .select("id,subject,day,time,city,capacity")
      .order("sort_order", { ascending: true }),
    supabase.from("enrollments").select("*").order("created_at", { ascending: true }),
  ]);

  const byClass = new Map<string, Enrollment[]>();
  for (const e of (enrollments ?? []) as Enrollment[]) {
    byClass.set(e.class_id, [...(byClass.get(e.class_id) ?? []), e]);
  }
  // Every class, in the classes page's order — empty ones say so.
  const groups = classes ?? [];

  return (
    <div>
      <h1>{t("enrollments.title")}</h1>
      <p className="admin-hint">{t("enrollments.hint")}</p>

      {groups.length === 0 && <p className="admin-hint">{t("enrollments.empty")}</p>}

      {groups.map((c) => {
        const list = byClass.get(c.id) ?? [];
        // Confirmed first, then the waitlist in sign-up order.
        list.sort((a, b) => (a.status === b.status ? 0 : a.status === "confirmed" ? -1 : 1));
        const confirmed = list.filter((e) => e.status === "confirmed").length;
        const waiting = list.length - confirmed;
        return (
          <section className="admin-card" key={c.id} id={c.id}>
            <h2 className="admin-subheading">{c.subject}</h2>
            <p className="admin-hint">
              {[c.day, c.time, c.city].filter(Boolean).join(" · ")} —{" "}
              {c.capacity
                ? t("enrollments.taken", { taken: confirmed, capacity: c.capacity })
                : t("enrollments.takenNoLimit", { taken: confirmed })}
              {waiting > 0 && ` · ${t("enrollments.waitlistCount", { count: waiting })}`}
            </p>
            {list.length === 0 ? (
              <p className="admin-hint">{t("enrollments.noneForClass")}</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("enrollments.col.name")}</th>
                    <th>{t("enrollments.col.whatsapp")}</th>
                    <th>{t("enrollments.col.email")}</th>
                    <th>{t("enrollments.col.status")}</th>
                    <th>{t("enrollments.col.date")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((e) => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>
                        <a
                          className="admin-link"
                          href={whatsappUrl(e.whatsapp, "")}
                          target="_blank"
                          rel="noopener noreferrer"
                          dir="ltr"
                        >
                          {e.whatsapp}
                        </a>
                      </td>
                      <td>
                        <a className="admin-link" href={`mailto:${e.email}`} dir="ltr">
                          {e.email}
                        </a>
                      </td>
                      <td>{t(`enrollments.statuses.${e.status}`)}</td>
                      <td>{new Date(e.created_at).toLocaleDateString(locale)}</td>
                      <td className="admin-table-actions">
                        {e.status === "waitlist" && (
                          <form action={confirmEnrollment}>
                            <input type="hidden" name="id" value={e.id} />
                            <button type="submit" className="admin-link">
                              {t("enrollments.confirm")}
                            </button>
                          </form>
                        )}
                        <form action={deleteEnrollment}>
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
            )}
          </section>
        );
      })}
    </div>
  );
}
