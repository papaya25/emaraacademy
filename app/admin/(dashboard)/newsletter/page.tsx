import { createClient } from "@/lib/supabase/server";
import { isResendConfigured } from "@/lib/resend";
import NewsletterSend from "@/components/admin/NewsletterSend";

export default async function AdminNewsletterPage() {
  const supabase = await createClient();
  const [{ data: subscribers }, { data: campaigns }] = await Promise.all([
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
    supabase.from("email_campaigns").select("*").order("sent_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1>Newsletter</h1>
      <p className="admin-hint">{(subscribers ?? []).length} subscribers.</p>

      <NewsletterSend resendConfigured={isResendConfigured()} />

      {(campaigns ?? []).length > 0 && (
        <>
          <h2 className="admin-subheading">Past campaigns</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sent</th>
                <th>Subject</th>
                <th>Recipients</th>
              </tr>
            </thead>
            <tbody>
              {(campaigns ?? []).map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.sent_at).toLocaleString()}</td>
                  <td>{c.subject}</td>
                  <td>{c.recipient_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2 className="admin-subheading">Subscribers</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {(subscribers ?? []).length === 0 && (
            <tr>
              <td colSpan={2} className="admin-hint">
                No subscribers yet.
              </td>
            </tr>
          )}
          {(subscribers ?? []).map((s) => (
            <tr key={s.id ?? s.email}>
              <td>{s.email}</td>
              <td>{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
