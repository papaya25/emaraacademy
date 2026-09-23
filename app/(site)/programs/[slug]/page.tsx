import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import { PROGRAMS, type Program } from "@/lib/programs";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 60;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

async function getPrograms(): Promise<Program[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) return PROGRAMS;
    const { data, error } = await supabase
      .from("programs")
      .select("slug,num,chapter,category,title,tagline,activities,what_it_is,problem")
      .order("sort_order", { ascending: true });
    if (error || !data || !data.length) return PROGRAMS;
    return data.map((p) => ({
      slug: p.slug,
      num: p.num,
      chapter: p.chapter,
      category: p.category,
      title: p.title,
      tagline: p.tagline,
      whatItIs: p.what_it_is,
      activities: p.activities,
      problem: p.problem,
    }));
  } catch {
    return PROGRAMS;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const programs = await getPrograms();
  const program = programs.find((p) => p.slug === slug);
  if (!program) return {};
  return {
    title: `${program.title} — Emara Academy`,
    description: program.tagline,
  };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const programs = await getPrograms();
  const index = programs.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const program = programs[index];
  const prev = programs[index - 1];
  const next = programs[index + 1];

  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <p className="ar">{program.chapter}</p>
          <Rosette />
          <h1>{program.title}</h1>
          <p>{program.tagline}</p>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="folio">{program.num}</p>
            <h2>
              What it <em>is</em>
            </h2>
          </Reveal>
          <Reveal className="about-body">
            <p className="dropcap">{program.whatItIs}</p>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <h2>
              What it <em>looks like</em>
            </h2>
          </Reveal>
          <Reveal>
            <ul className="values-list">
              {program.activities.map((a, i) => (
                <li key={a.title}>
                  <span className="v-num" aria-hidden="true">
                    {"١٢٣٤٥٦٧٨٩"[i] ?? "•"}
                  </span>
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <h2>
              The moment it <em>answers</em>
            </h2>
          </Reveal>
          <Reveal className="about-body">
            <p>{program.problem}</p>
            <div className="spread-cta">
              <Link className="btn btn-green" href="/contact">
                Ask About It First
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <nav className="chapter-nav wrap" aria-label="Program chapters">
        {prev ? (
          <Link href={`/programs/${prev.slug}`} className="chapter-nav-link">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/programs" className="chapter-nav-link chapter-nav-toc">
          Table of Contents
        </Link>
        {next ? (
          <Link href={`/programs/${next.slug}`} className="chapter-nav-link">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
