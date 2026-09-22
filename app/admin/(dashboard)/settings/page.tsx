import { createClient } from "@/lib/supabase/server";
import { updateContactInfo, updateImpactStats, updateDonationGoal } from "@/app/admin/actions";
import { DEFAULT_CONTACT } from "@/lib/contactInfo";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("site_settings")
    .select("key,value")
    .in("key", ["contact_info", "impact_stats", "donation_month"]);

  const settings = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value])) as {
    contact_info?: { email: string; phone: string };
    impact_stats?: { new_muslims: number; students: number; supported: number };
    donation_month?: { goal: number };
  };

  const contact = settings.contact_info ?? DEFAULT_CONTACT;
  const impact = settings.impact_stats ?? { new_muslims: 0, students: 0, supported: 0 };
  const goal = settings.donation_month?.goal ?? 5000;

  return (
    <div>
      <h1>Settings</h1>

      <details className="admin-card admin-details" open>
        <summary>Contact info</summary>
        <form action={updateContactInfo} className="admin-form">
          <label>
            Email
            <input type="email" name="email" defaultValue={contact.email} required />
          </label>
          <label>
            Phone (used for calls and WhatsApp)
            <input name="phone" defaultValue={contact.phone} required />
          </label>
          <button className="btn btn-green" type="submit">
            Save
          </button>
        </form>
      </details>

      <details className="admin-card admin-details">
        <summary>Impact numbers (homepage)</summary>
        <form action={updateImpactStats} className="admin-form">
          <div className="admin-form-row">
            <label>
              New Muslims
              <input type="number" name="new_muslims" defaultValue={impact.new_muslims} />
            </label>
            <label>
              Students
              <input type="number" name="students" defaultValue={impact.students} />
            </label>
            <label>
              People Supported
              <input type="number" name="supported" defaultValue={impact.supported} />
            </label>
          </div>
          <button className="btn btn-green" type="submit">
            Save
          </button>
        </form>
      </details>

      <details className="admin-card admin-details">
        <summary>Monthly donation goal</summary>
        <p className="admin-hint">
          The &ldquo;raised so far&rdquo; number updates on its own from the Donations
          tab — only the goal is set here.
        </p>
        <form action={updateDonationGoal} className="admin-form">
          <label>
            Goal (USD)
            <input type="number" name="goal" defaultValue={goal} />
          </label>
          <button className="btn btn-green" type="submit">
            Save
          </button>
        </form>
      </details>
    </div>
  );
}
