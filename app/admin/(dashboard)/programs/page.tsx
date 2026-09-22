import { createClient } from "@/lib/supabase/server";
import { updateProgram } from "@/app/admin/actions";

export default async function AdminProgramsPage() {
  const supabase = await createClient();
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1>Programs</h1>
      <p className="admin-hint">
        These are the six program chapters shown on the homepage and /programs.
        Activities: one per line, as <code>Title | Description</code>.
      </p>
      {(programs ?? []).map((p) => (
        <details className="admin-card admin-details" key={p.slug}>
          <summary>
            {p.num} · {p.title}
          </summary>
          <form action={updateProgram} className="admin-form">
            <input type="hidden" name="slug" value={p.slug} />
            <label>
              Category
              <input name="category" defaultValue={p.category} required />
            </label>
            <label>
              Title
              <input name="title" defaultValue={p.title} required />
            </label>
            <label>
              Tagline
              <textarea name="tagline" defaultValue={p.tagline} rows={2} required />
            </label>
            <label>
              What it is
              <textarea name="what_it_is" defaultValue={p.what_it_is} rows={3} required />
            </label>
            <label>
              Activities (one per line: Title | Description)
              <textarea
                name="activities"
                rows={6}
                defaultValue={(p.activities as { title: string; desc: string }[])
                  .map((a) => `${a.title} | ${a.desc}`)
                  .join("\n")}
              />
            </label>
            <label>
              The moment it answers
              <textarea name="problem" defaultValue={p.problem} rows={3} required />
            </label>
            <button className="btn btn-green" type="submit">
              Save
            </button>
          </form>
        </details>
      ))}
    </div>
  );
}
