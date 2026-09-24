"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/adminAuth";
import AdminLangSwitcher from "@/components/admin/AdminLangSwitcher";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations("admin.login");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    if (error) {
      setStatus("error");
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <h1>{t("title")}</h1>
        <p className="admin-login-sub">Emara Academy</p>
        <label className="corr-label" htmlFor="admin-password">
          {t("password")}
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={status === "sending"}
        />
        <button className="btn btn-green" type="submit" disabled={status === "sending"}>
          {status === "sending" ? t("signingIn") : t("signIn")}
        </button>
        {status === "error" && (
          <p className="corr-error" role="alert">
            {t("wrong")}
          </p>
        )}
        <AdminLangSwitcher />
      </form>
    </main>
  );
}
