import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ClassesAdmin from "@/components/admin/ClassesAdmin";

export default async function AdminClassesPage() {
  const t = await getTranslations("admin.classes");
  const supabase = await createClient();
  const [{ data: classes }, { data: availability }] = await Promise.all([
    supabase.from("classes").select("*").order("sort_order", { ascending: true }),
    supabase.from("class_availability").select("class_id,taken"),
  ]);
  const taken = Object.fromEntries((availability ?? []).map((a) => [a.class_id, a.taken]));

  return (
    <div>
      <h1>{t("title")}</h1>
      <ClassesAdmin classes={classes ?? []} taken={taken} />
    </div>
  );
}
