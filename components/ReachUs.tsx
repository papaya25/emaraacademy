"use client";

import { useTranslations } from "next-intl";
import { useSetting } from "@/lib/settings";
import { DEFAULT_CONTACT, whatsappUrl } from "@/lib/contactInfo";

/** "How to reach us" on the contact page — every value comes from admin → Settings. */
export default function ReachUs() {
  const t = useTranslations("contact.reach");
  const tShared = useTranslations("shared");
  // Older saved settings have no social links yet — fall back per field.
  const saved = useSetting("contact_info", DEFAULT_CONTACT);
  const contact = { ...DEFAULT_CONTACT, ...saved };

  const rows = [
    {
      key: "whatsapp",
      href: whatsappUrl(contact.phone, tShared("whatsappGreeting")),
      text: contact.phone,
      external: true,
    },
    { key: "email", href: `mailto:${contact.email}`, text: contact.email, external: false },
    ...(["instagram", "facebook", "tiktok"] as const)
      .filter((k) => contact[k])
      .map((k) => ({ key: k, href: contact[k]!, text: handleOf(contact[k]!), external: true })),
  ];

  return (
    <section className="reach-us">
      <div className="wrap narrow">
        <h2>{t("title")}</h2>
        <dl className="reach-list">
          {rows.map((r) => (
            <div key={r.key}>
              <dt>{t(r.key)}</dt>
              <dd>
                <a
                  href={r.href}
                  dir="ltr"
                  {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {r.text}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** "https://www.instagram.com/emaraacademy" → "@emaraacademy" (the link stays whole). */
function handleOf(url: string): string {
  const last = url.replace(/\/+$/, "").split("/").pop() ?? url;
  return last.startsWith("@") ? last : `@${last}`;
}
