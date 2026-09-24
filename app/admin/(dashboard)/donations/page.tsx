import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { addDonation, deleteDonation } from "@/app/admin/actions";

const METHODS = ["card", "bank", "other"];

export default async function AdminDonationsPage() {
  const supabase = await createClient();
  const t = await getTranslations("admin");
  const locale = await getLocale();
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .order("occurred_on", { ascending: false })
    .limit(200);

  const total = (donations ?? []).reduce((s, d) => s + Number(d.amount), 0);

  return (
    <div>
      <h1>{t("donations.title")}</h1>
      <p className="admin-hint">
        {t("donations.summary", {
          count: (donations ?? []).length,
          total: total.toLocaleString(locale),
        })}
      </p>

      <details className="admin-card admin-details">
        <summary>{t("donations.log")}</summary>
        <form action={addDonation} className="admin-form">
          <div className="admin-form-row">
            <label>
              {t("donations.date")}
              <input
                type="date"
                name="occurred_on"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
              />
            </label>
            <label>
              {t("donations.amount")}
              <input type="number" name="amount" min="0.01" step="0.01" required />
            </label>
            <label>
              {t("donations.method")}
              <select name="method" defaultValue="bank">
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {t(`donations.methods.${m}`)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("donations.frequency")}
              <select name="frequency" defaultValue="once">
                <option value="once">{t("donations.frequencies.once")}</option>
                <option value="monthly">{t("donations.frequencies.monthly")}</option>
              </select>
            </label>
          </div>
          <label>
            {t("donations.donor")}
            <input name="donor_name" />
          </label>
          <label>
            {t("donations.note")}
            <input name="note" />
          </label>
          <button className="btn btn-green" type="submit">
            {t("donations.addButton")}
          </button>
        </form>
      </details>

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t("donations.col.date")}</th>
            <th>{t("donations.col.donor")}</th>
            <th>{t("donations.col.amount")}</th>
            <th>{t("donations.col.method")}</th>
            <th>{t("donations.col.frequency")}</th>
            <th>{t("donations.col.note")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(donations ?? []).length === 0 && (
            <tr>
              <td colSpan={7} className="admin-hint">
                {t("donations.empty")}
              </td>
            </tr>
          )}
          {(donations ?? []).map((d) => (
            <tr key={d.id}>
              <td>{d.occurred_on}</td>
              <td>{d.donor_name ?? t("common.anonymous")}</td>
              <td>${Number(d.amount).toLocaleString(locale)}</td>
              <td>{METHODS.includes(d.method) ? t(`donations.methods.${d.method}`) : d.method}</td>
              <td>{d.frequency === "once" || d.frequency === "monthly" ? t(`donations.frequencies.${d.frequency}`) : d.frequency}</td>
              <td>{d.note ?? "—"}</td>
              <td className="admin-table-actions">
                <form action={deleteDonation}>
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" className="admin-link admin-link-danger">
                    {t("common.delete")}
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
