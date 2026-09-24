"use client";

import { useLocale, useTranslations } from "next-intl";
import { ADMIN_LOCALE_COOKIE } from "@/i18n/routing";

const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
];

export default function AdminLangSwitcher() {
  const t = useTranslations("admin.nav");
  const locale = useLocale();
  return (
    <label className="admin-lang">
      {t("language")}
      <select
        value={locale}
        onChange={(e) => {
          document.cookie = `${ADMIN_LOCALE_COOKIE}=${e.target.value}; path=/; max-age=31536000; samesite=lax`;
          // Full reload so <html lang/dir> (set in the root layout) switches too.
          window.location.reload();
        }}
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
