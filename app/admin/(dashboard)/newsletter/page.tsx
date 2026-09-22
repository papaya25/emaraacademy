import { createClient } from "@/lib/supabase/server";

export default async function AdminNewsletterPage() {
  const supabase = await createClient();
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Newsletter</h1>
      <p className="admin-hint">{(subscribers ?? []).length} subscribers.</p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed</th>
          </tr>
        </thead>
        <tbody>
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
