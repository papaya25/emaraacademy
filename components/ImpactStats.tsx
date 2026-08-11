// PLACEHOLDER FIGURES — not real yet. Maher will confirm actual counts later.
// TODO: once the admin/backend phase tracks real enrollments, mutual-aid cases,
// and converts supported in Supabase, replace this with live `SELECT COUNT(*)`
// queries against those tables instead of hardcoded values — see CLAUDE.md.
const STATS = [
  { value: "35", label: "New Muslims Walking With Us" },
  { value: "90", label: "Students in Weekly Classes" },
  { value: "50", label: "People Supported by Our Programs" },
];

export default function ImpactStats() {
  return (
    <div className="impact-stats">
      {STATS.map((s) => (
        <div className="impact-stat" key={s.label}>
          <span className="impact-value">{s.value}</span>
          <span className="impact-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
