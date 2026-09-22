"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
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
      Sign Out
    </button>
  );
}
