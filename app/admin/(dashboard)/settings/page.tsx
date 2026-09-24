import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { updateContactInfo, updateImpactStats, updateDonationGoal } from "@/app/admin/actions";
import { DEFAULT_CONTACT } from "@/lib/contactInfo";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const t = await getTranslations("admin");
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
      <h1>{t("settings.title")}</h1>

      <details className="admin-card admin-details" open>
        <summary>{t("settings.contact")}</summary>
        <form action={updateContactInfo} className="admin-form">
          <label>
            {t("settings.email")}
            <input type="email" name="email" defaultValue={contact.email} required />
          </label>
          <label>
            {t("settings.phone")}
            <input name="phone" defaultValue={contact.phone} required />
          </label>
          <button className="btn btn-green" type="submit">
            {t("common.save")}
          </button>
        </form>
      </details>

      <details className="admin-card admin-details">
        <summary>{t("settings.impact")}</summary>
        <form action={updateImpactStats} className="admin-form">
          <div className="admin-form-row">
            <label>
              {t("settings.newMuslims")}
              <input type="number" name="new_muslims" defaultValue={impact.new_muslims} />
            </label>
            <label>
              {t("settings.students")}
              <input type="number" name="students" defaultValue={impact.students} />
            </label>
            <label>
              {t("settings.supported")}
              <input type="number" name="supported" defaultValue={impact.supported} />
            </label>
          </div>
          <button className="btn btn-green" type="submit">
            {t("common.save")}
          </button>
        </form>
      </details>

      <details className="admin-card admin-details">
        <summary>{t("settings.goalSection")}</summary>
        <p className="admin-hint">{t("settings.goalHint")}</p>
        <form action={updateDonationGoal} className="admin-form">
          <label>
            {t("settings.goal")}
            <input type="number" name="goal" defaultValue={goal} />
          </label>
          <button className="btn btn-green" type="submit">
            {t("common.save")}
          </button>
        </form>
      </details>
    </div>
  );
}
