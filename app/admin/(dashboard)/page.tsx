import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const t = await getTranslations("admin.overview");
  const locale = await getLocale();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const monthStr = startOfMonth.toISOString().slice(0, 10);
  const todayStr = new Date().toISOString().slice(0, 10);

  const [monthDonations, allDonations, messages, subscribers, upcomingEvents] =
    await Promise.all([
      supabase.from("donations").select("amount").gte("occurred_on", monthStr),
      supabase.from("donations").select("amount"),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .gte("event_date", todayStr),
    ]);

  const monthTotal = (monthDonations.data ?? []).reduce((s, d) => s + Number(d.amount), 0);
  const allTimeTotal = (allDonations.data ?? []).reduce((s, d) => s + Number(d.amount), 0);

  const cards = [
    { label: t("raisedMonth"), value: `$${monthTotal.toLocaleString(locale)}` },
    { label: t("raisedAll"), value: `$${allTimeTotal.toLocaleString(locale)}` },
    { label: t("donationsLogged"), value: (allDonations.data ?? []).length },
    { label: t("contactMessages"), value: messages.count ?? 0 },
    { label: t("subscribers"), value: subscribers.count ?? 0 },
    { label: t("upcomingEvents"), value: upcomingEvents.count ?? 0 },
  ];

  return (
    <div>
      <h1>{t("title")}</h1>
      <div className="admin-cards">
        {cards.map((c) => (
          <div className="admin-card" key={c.label}>
            <span className="admin-card-label">{c.label}</span>
            <span className="admin-card-value">{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
