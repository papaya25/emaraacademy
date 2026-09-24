import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ClassesAdmin from "@/components/admin/ClassesAdmin";

export default async function AdminClassesPage() {
  const t = await getTranslations("admin.classes");
  const supabase = await createClient();
  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1>{t("title")}</h1>
      <ClassesAdmin classes={classes ?? []} />
    </div>
  );
}
