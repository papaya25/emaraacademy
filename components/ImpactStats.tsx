"use client";

import { useSetting } from "@/lib/settings";

// Fallback figures until the `site_settings` row loads (or before the
// table exists). The live values are managed in Supabase → site_settings
// under the key `impact_stats`, editable from the admin panel later.
const FALLBACK = { new_muslims: 35, students: 90, supported: 50 };

export default function ImpactStats() {
  const stats = useSetting("impact_stats", FALLBACK);

  const items = [
    { value: stats.new_muslims, label: "New Muslims Walking With Us" },
    { value: stats.students, label: "Students in Weekly Classes" },
    { value: stats.supported, label: "People Supported by Our Programs" },
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
