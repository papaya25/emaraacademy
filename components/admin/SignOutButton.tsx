"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const t = useTranslations("admin.nav");
  return (
    <button
      className="admin-signout"
      type="button"
      onClick={async () => {
        await createClient().auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      {t("signOut")}
    </button>
  );
}
