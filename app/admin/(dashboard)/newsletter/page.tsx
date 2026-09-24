import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { isResendConfigured } from "@/lib/resend";
import NewsletterSend from "@/components/admin/NewsletterSend";

export default async function AdminNewsletterPage() {
  const supabase = await createClient();
  const t = await getTranslations("admin.newsletter");
  const locale = await getLocale();
  const [{ data: subscribers }, { data: campaigns }] = await Promise.all([
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
    supabase.from("email_campaigns").select("*").order("sent_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="admin-hint">{t("subscriberCount", { count: (subscribers ?? []).length })}</p>

      <NewsletterSend resendConfigured={isResendConfigured()} />

      {(campaigns ?? []).length > 0 && (
        <>
          <h2 className="admin-subheading">{t("pastCampaigns")}</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t("col.sent")}</th>
                <th>{t("col.subject")}</th>
                <th>{t("col.recipients")}</th>
              </tr>
            </thead>
            <tbody>
              {(campaigns ?? []).map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.sent_at).toLocaleString(locale)}</td>
                  <td>{c.subject}</td>
                  <td>{c.recipient_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2 className="admin-subheading">{t("subscribers")}</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{t("col.email")}</th>
            <th>{t("col.subscribed")}</th>
          </tr>
        </thead>
        <tbody>
          {(subscribers ?? []).length === 0 && (
            <tr>
              <td colSpan={2} className="admin-hint">
                {t("noSubscribers")}
              </td>
            </tr>
          )}
          {(subscribers ?? []).map((s) => (
            <tr key={s.id ?? s.email}>
              <td>{s.email}</td>
              <td>{s.created_at ? new Date(s.created_at).toLocaleDateString(locale) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
