import { createClient } from "@/lib/supabase/server";
import EventsAdmin from "@/components/admin/EventsAdmin";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id,title,meta,city,type,event_date,time,location,presenter")
    .order("event_date", { ascending: true });

  return (
    <div>
      <h1>Events</h1>
      <EventsAdmin events={events ?? []} />
    </div>
  );
}
