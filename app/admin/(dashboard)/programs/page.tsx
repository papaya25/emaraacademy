import { createClient } from "@/lib/supabase/server";
import { updateProgram, createProgram, deleteProgram } from "@/app/admin/actions";
import { PROGRAMS } from "@/lib/programs";

type ProgramRow = {
  slug: string;
  num: string;
  category: string;
  title: string;
  tagline: string;
  what_it_is: string;
  activities: { title: string; desc: string }[];
  problem: string;
};

const FIELDS = (
  <>
    <label>
      Category
      <input name="category" required />
    </label>
    <label>
      Title
      <input name="title" required />
    </label>
    <label>
      Tagline
      <textarea name="tagline" rows={2} required />
    </label>
    <label>
      What it is
      <textarea name="what_it_is" rows={3} required />
    </label>
    <label>
      Activities (one per line: Title | Description)
      <textarea name="activities" rows={6} />
    </label>
    <label>
      The moment it answers
      <textarea name="problem" rows={3} required />
    </label>
  </>
);

export default async function AdminProgramsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });

  const live = data && data.length > 0;
  const programs: ProgramRow[] = live
    ? data
    : PROGRAMS.map((p) => ({
        slug: p.slug,
        num: p.num,
        category: p.category,
        title: p.title,
        tagline: p.tagline,
        what_it_is: p.whatItIs,
        activities: p.activities,
        problem: p.problem,
      }));

  return (
    <div>
      <h1>Programs</h1>
      <p className="admin-hint">
        These are the program chapters shown on the homepage and /programs. Adding or
        removing one renumbers the rest so the chapter numbers stay in order. Activities:
        one per line, as <code>Title | Description</code>.
      </p>
      {!live && (
        <p className="admin-offline">
          Showing today&rsquo;s content as a preview — Supabase isn&rsquo;t connected
          (project paused or migration not run yet), so saving, adding, or deleting
          won&rsquo;t persist until it is.
        </p>
      )}

      <details className="admin-card admin-details">
        <summary>Add a new program</summary>
        <form action={createProgram} className="admin-form">
          {FIELDS}
          <button className="btn btn-green" type="submit">
            Add Program
          </button>
        </form>
      </details>

      {programs.map((p) => (
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
                defaultValue={p.activities.map((a) => `${a.title} | ${a.desc}`).join("\n")}
              />
            </label>
            <label>
              The moment it answers
              <textarea name="problem" defaultValue={p.problem} rows={3} required />
            </label>
            <div className="admin-form-row">
              <button className="btn btn-green" type="submit">
                Save
              </button>
            </div>
          </form>
          <form action={deleteProgram} className="admin-delete-row">
            <input type="hidden" name="slug" value={p.slug} />
            <button type="submit" className="admin-link admin-link-danger">
              Delete this program
            </button>
          </form>
        </details>
      ))}
    </div>
  );
}
