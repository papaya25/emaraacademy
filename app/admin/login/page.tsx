"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
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
        <h1>Admin</h1>
        <p className="admin-login-sub">Emara Academy</p>
        <label className="corr-label" htmlFor="admin-password">
          Password
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
          {status === "sending" ? "Signing in…" : "Sign In"}
        </button>
        {status === "error" && (
          <p className="corr-error" role="alert">
            Wrong password — try again.
          </p>
        )}
      </form>
    </main>
  );
}
