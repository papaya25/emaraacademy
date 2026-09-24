import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import EventsAdmin from "@/components/admin/EventsAdmin";

export default async function AdminEventsPage() {
  const t = await getTranslations("admin.events");
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  return (
    <div>
      <h1>{t("title")}</h1>
      <EventsAdmin events={events ?? []} />
    </div>
  );
}
