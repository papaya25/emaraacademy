"use client";

import { useTranslations } from "next-intl";
import { useSetting } from "@/lib/settings";

// Fallback figures until the `site_settings` row loads (or before the
// table exists). The live values are managed in Supabase → site_settings
// under the key `impact_stats`, editable from the admin panel later.
const FALLBACK = { new_muslims: 35, students: 90, supported: 50 };

export default function ImpactStats() {
  const t = useTranslations("impact");
  const stats = useSetting("impact_stats", FALLBACK);

  const items = [
    { value: stats.new_muslims, label: t("newMuslims") },
    { value: stats.students, label: t("students") },
    { value: stats.supported, label: t("supported") },
  ];

  return (
    <div className="impact-stats">
      {items.map((s) => (
        <div className="impact-stat" key={s.label}>
          <span className="impact-value">{s.value}</span>
          <span className="impact-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
