"use client";

import { useActionState } from "react";
import { sendNewsletter, type SendNewsletterState } from "@/app/admin/actions";

export default function NewsletterSend({ resendConfigured }: { resendConfigured: boolean }) {
  const [state, formAction, pending] = useActionState<SendNewsletterState, FormData>(
    sendNewsletter,
    null
  );

  return (
    <details className="admin-card admin-details" open>
      <summary>Compose &amp; send</summary>
      {!resendConfigured && (
        <p className="admin-offline">
          Resend isn&rsquo;t connected yet — add <code>RESEND_API_KEY</code> (and ideally{" "}
          <code>RESEND_FROM_EMAIL</code>) to send. You can still write a draft below.
        </p>
      )}
      <form action={formAction} className="admin-form">
        <label>
          Subject
          <input name="subject" required disabled={pending} />
        </label>
        <label>
          Message
          <textarea name="body" rows={8} required disabled={pending} />
        </label>
        <div className="admin-form-row">
          <button className="btn btn-green" type="submit" disabled={pending || !resendConfigured}>
            {pending ? "Sending…" : "Send to All Subscribers"}
          </button>
        </div>
        {state && (
          <p className={state.ok ? "admin-hint" : "admin-offline"}>{state.message}</p>
        )}
      </form>
    </details>
  );
}
