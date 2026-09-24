"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { sendNewsletter, type SendNewsletterState } from "@/app/admin/actions";

export default function NewsletterSend({ resendConfigured }: { resendConfigured: boolean }) {
  const t = useTranslations("admin.newsletter");
  const [state, formAction, pending] = useActionState<SendNewsletterState, FormData>(
    sendNewsletter,
    null
  );

  return (
    <details className="admin-card admin-details" open>
      <summary>{t("compose")}</summary>
      {!resendConfigured && (
        <p className="admin-offline">
          {t.rich("resendMissing", { code: (c) => <code>{c}</code> })}
        </p>
      )}
      <form action={formAction} className="admin-form">
        <label>
          {t("subject")}
          <input name="subject" required disabled={pending} />
        </label>
        <label>
          {t("message")}
          <textarea name="body" rows={8} required disabled={pending} />
        </label>
        <div className="admin-form-row">
          <button className="btn btn-green" type="submit" disabled={pending || !resendConfigured}>
            {pending ? t("sending") : t("send")}
          </button>
        </div>
        {state && (
          <p className={state.ok ? "admin-hint" : "admin-offline"}>{state.message}</p>
        )}
      </form>
    </details>
  );
}
