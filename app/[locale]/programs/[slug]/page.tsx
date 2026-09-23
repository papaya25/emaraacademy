import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { rich } from "@/lib/rich";
import Reveal from "@/components/Reveal";
import Rosette from "@/components/Rosette";
import { PROGRAMS, localizeProgram, type Program } from "@/lib/programs";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 60;

type Params = { locale: string; slug: string };

export function generateStaticParams(): Pick<Params, "slug">[] {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

async function getPrograms(locale: string): Promise<Program[]> {
  return (await fetchPrograms()).map((p) => localizeProgram(p, locale));
}

async function fetchPrograms(): Promise<Program[]> {
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
  const { locale, slug } = await params;
  const programs = await getPrograms(locale);
  const program = programs.find((p) => p.slug === slug);
  if (!program) return {};
  const t = await getTranslations({ locale, namespace: "program" });
  return {
    title: t("metaTitle", { title: program.title }),
    description: program.tagline,
  };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const programs = await getPrograms(locale);
  const t = await getTranslations({ locale, namespace: "program" });
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
            <h2>{t.rich("whatItIs", rich)}</h2>
          </Reveal>
          <Reveal className="about-body">
            <p className="dropcap">{program.whatItIs}</p>
          </Reveal>
        </div>
      </section>

      <section className="about-section">
        <div className="wrap about-grid">
          <Reveal>
            <h2>{t.rich("looksLike", rich)}</h2>
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
            <h2>{t.rich("answers", rich)}</h2>
          </Reveal>
          <Reveal className="about-body">
            <p>{program.problem}</p>
            <div className="spread-cta">
              <Link className="btn btn-green" href="/contact">
                {t("askFirst")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <nav className="chapter-nav wrap" aria-label={t("chaptersLabel")}>
        {prev ? (
          <Link href={`/programs/${prev.slug}`} className="chapter-nav-link">
            {t("prev", { title: prev.title })}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/programs" className="chapter-nav-link chapter-nav-toc">
          {t("toc")}
        </Link>
        {next ? (
          <Link href={`/programs/${next.slug}`} className="chapter-nav-link">
            {t("next", { title: next.title })}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
