import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

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
    { label: "Raised This Month", value: `$${monthTotal.toLocaleString()}` },
    { label: "Raised All Time", value: `$${allTimeTotal.toLocaleString()}` },
    { label: "Donations Logged", value: (allDonations.data ?? []).length },
    { label: "Contact Messages", value: messages.count ?? 0 },
    { label: "Newsletter Subscribers", value: subscribers.count ?? 0 },
    { label: "Upcoming Events", value: upcomingEvents.count ?? 0 },
  ];

  return (
    <div>
      <h1>Overview</h1>
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
