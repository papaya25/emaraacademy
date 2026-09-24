import { createClient } from "@/lib/supabase/server";
import { addDonation, deleteDonation } from "@/app/admin/actions";

const METHODS = ["card", "bank", "other"];

export default async function AdminDonationsPage() {
  const supabase = await createClient();
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .order("occurred_on", { ascending: false })
    .limit(200);

  const total = (donations ?? []).reduce((s, d) => s + Number(d.amount), 0);

  return (
    <div>
      <h1>Donations</h1>
      <p className="admin-hint">
        {(donations ?? []).length} donations logged · ${total.toLocaleString()} total.
        Stripe isn&rsquo;t connected yet, so every donation is logged here
        by hand for now.
      </p>

      <details className="admin-card admin-details">
        <summary>Log a donation</summary>
        <form action={addDonation} className="admin-form">
          <div className="admin-form-row">
            <label>
              Date
              <input
                type="date"
                name="occurred_on"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
              />
            </label>
            <label>
              Amount (USD)
              <input type="number" name="amount" min="0.01" step="0.01" required />
            </label>
            <label>
              Method
              <select name="method" defaultValue="bank">
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Frequency
              <select name="frequency" defaultValue="once">
                <option value="once">One-time</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
          <label>
            Donor name (blank = anonymous)
            <input name="donor_name" />
          </label>
          <label>
            Note
            <input name="note" />
          </label>
          <button className="btn btn-green" type="submit">
            Add Donation
          </button>
        </form>
      </details>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Donor</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Frequency</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(donations ?? []).length === 0 && (
            <tr>
              <td colSpan={7} className="admin-hint">
                No donations logged yet.
              </td>
            </tr>
          )}
          {(donations ?? []).map((d) => (
            <tr key={d.id}>
              <td>{d.occurred_on}</td>
              <td>{d.donor_name ?? "Anonymous"}</td>
              <td>${Number(d.amount).toLocaleString()}</td>
              <td>{d.method}</td>
              <td>{d.frequency}</td>
              <td>{d.note ?? "—"}</td>
              <td className="admin-table-actions">
                <form action={deleteDonation}>
                  <input type="hidden" name="id" value={d.id} />
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
