import { createClient } from "@/lib/supabase/server";
import ClassesAdmin from "@/components/admin/ClassesAdmin";

export default async function AdminClassesPage() {
  const supabase = await createClient();
  const { data: classes } = await supabase
    .from("classes")
    .select("id,subject,blurb,track,language,city,day,time,format,status,sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1>Classes</h1>
      <ClassesAdmin classes={classes ?? []} />
    </div>
  );
}
