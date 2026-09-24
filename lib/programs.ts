import { PROGRAMS_AR } from "./programs.ar";
import { PROGRAMS_ES } from "./programs.es";

export type Program = {
  slug: string;
  num: string; // Arabic-Indic chapter numeral
  chapter: string; // Arabic chapter heading
  category: string; // short label for the bookshelf spine
  title: string;
  tagline: string;
  whatItIs: string;
  activities: { title: string; desc: string }[];
  problem: string;
  /** Spanish/Arabic typed in the admin panel (blank fields left out). */
  translations?: Partial<Record<string, Partial<ProgramText>>>;
};

export type ProgramText = Pick<
  Program,
  "category" | "title" | "tagline" | "whatItIs" | "activities" | "problem"
>;

/** Languages besides English that program text can be translated into. */
export const TRANSLATED_LOCALES = ["es", "ar"] as const;

type Row = Record<string, unknown>;
const text = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);
const list = (v: unknown) =>
  Array.isArray(v) && v.length ? (v as Program["activities"]) : undefined;

/** A `programs` table row (select "*") as a Program, translations included. */
export function programFromRow(r: Row): Program {
  const translations: Program["translations"] = {};
  for (const l of TRANSLATED_LOCALES) {
    translations[l] = {
      category: text(r[`category_${l}`]),
      title: text(r[`title_${l}`]),
      tagline: text(r[`tagline_${l}`]),
      whatItIs: text(r[`what_it_is_${l}`]),
      problem: text(r[`problem_${l}`]),
      activities: list(r[`activities_${l}`]),
    };
  }
  return {
    slug: r.slug as string,
    num: r.num as string,
    chapter: r.chapter as string,
    category: r.category as string,
    title: r.title as string,
    tagline: r.tagline as string,
    whatItIs: r.what_it_is as string,
    activities: (r.activities as Program["activities"]) ?? [],
    problem: r.problem as string,
    translations,
  };
}

export const PROGRAMS: Program[] = [
  {
    slug: "new-muslim-education",
    category: "Education",
    num: "١",
    chapter: "الفصل الأول",
    title: "New Muslim Education",
    tagline:
      "Structured, ongoing classes — not a one-time orientation — that take a convert from their first day to confident, independent practice.",
    whatItIs:
      "A tiered curriculum — Foundations, then Practice, then Deepening — taught in Spanish and Portuguese, delivered weekly at partner mosques, and always paired with a shared meal, so class is a social occasion, not a lecture.",
    activities: [
      {
        title: "Foundations track",
        desc: "Purification, prayer, basic beliefs, Qur'an reading from zero, and halal/haram basics for daily life in Latin America.",
      },
      {
        title: "Practice track",
        desc: "The fiqh of fasting and Ramadan, zakat, family and marriage in Islam, and navigating non-Muslim family relationships.",
      },
      {
        title: "Deepening track",
        desc: "Seerah, tafsir circles, Arabic literacy, and pathways into memorization for those who want to go further.",
      },
      {
        title: "Take-home materials",
        desc: "Printed and digital materials in Spanish and Portuguese — because most existing Islamic literature is in Arabic or English.",
      },
      {
        title: "Food at every session",
        desc: "A small, deliberate signal that this is a place you are fed and welcomed, not just instructed.",
      },
    ],
    problem:
      "Converts often disengage simply because there is nowhere consistent to keep learning after the initial rush of conversion fades. A weekly, no-cost, food-included class turns “I should learn more sometime” into a standing appointment they belong to.",
  },
  {
    slug: "imam-teacher-formation",
    category: "Formation",
    num: "٢",
    chapter: "الفصل الثاني",
    title: "Imam & Teacher Formation",
    tagline:
      "Training local imams and lay teachers specifically in how to teach and pastorally support converts — a different skill from leading born-Muslim congregations.",
    whatItIs:
      "A certification track covering convert psychology, trauma-informed pastoral care, simplified teaching methodology, and culturally adapted Spanish/Portuguese da'wah materials — so every partner mosque has at least one person equipped to run these programs well.",
    activities: [
      {
        title: "Convert-experience workshops",
        desc: "The specific challenges converts face: family rejection, identity loss, isolation, doubt, and burnout.",
      },
      {
        title: "Teaching methodology",
        desc: "How to teach fiqh and Qur'an to adult beginners with no religious-Arabic background.",
      },
      {
        title: "Shared curriculum library",
        desc: "A translated teaching-materials library, so no imam has to build lessons from scratch.",
      },
      {
        title: "Annual teachers' gathering",
        desc: "Trained imams and teachers from partner cities exchange experience and refine the program together.",
      },
    ],
    problem:
      "A well-meaning imam without convert-specific training can unintentionally make a new Muslim feel judged, rushed, or out of place. Training the teachers is what makes every other program reproducible city to city, instead of dependent on one gifted individual.",
  },
  {
    slug: "community-events",
    category: "Community",
    num: "٣",
    chapter: "الفصل الثالث",
    title: "Community Events",
    tagline:
      "Regular, genuinely fun gatherings whose real purpose is belonging: food, games, and the chance to tell your story and hear others'.",
    whatItIs:
      "Monthly community nights and seasonal larger gatherings — Ramadan iftars, Eid celebrations, welcome parties for recent converts — hosted at or near partner mosques, built around food, games, and storytelling.",
    activities: [
      {
        title: "Convert story nights",
        desc: "Monthly evenings where members share their journey — giving new converts language for their own experience.",
      },
      {
        title: "Eid & Ramadan celebrations",
        desc: "Designed for people with no Muslim family to celebrate with.",
      },
      {
        title: "Games & icebreakers",
        desc: "Structured social activities aimed at building friendships, not just acquaintances.",
      },
      {
        title: "First-90-days welcome nights",
        desc: "Dedicated welcomes for the newest converts, paired with a mentor introduction.",
      },
    ],
    problem:
      "Many converts describe conversion as gaining a religion and losing a social world overnight. Events replace the social world that was lost — the single biggest predictor of whether someone stays engaged long-term.",
  },
  {
    slug: "mutual-aid-fund",
    category: "Support",
    num: "٤",
    chapter: "الفصل الرابع",
    title: "Mutual Aid & Emergency Fund",
    tagline:
      "A dignified, needs-based safety net so that material hardship never becomes the reason someone drifts away.",
    whatItIs:
      "A confidential support fund, administered through partner mosques, providing direct, time-limited help — food, clothing, emergency cash, and connections to livelihood opportunities — for new Muslims in genuine need, many of whom lost family financial support because of their conversion.",
    activities: [
      {
        title: "Confidential intake",
        desc: "Requests for help never become mosque gossip.",
      },
      {
        title: "Emergency essentials",
        desc: "Food packages, clothing — including modest-clothing starter kits — and short-term cash assistance.",
      },
      {
        title: "Livelihood track",
        desc: "Micro-grants and interest-free loans (qard hasan) to help converts who lost income get back on their feet.",
      },
      {
        title: "Professional referral network",
        desc: "Lawyers, doctors, and therapists willing to offer discounted or free help to new Muslims.",
      },
    ],
    problem:
      "Converts — especially women who begin wearing hijab — can face real economic and family consequences for converting. Without a safety net, financial hardship becomes the practical, non-ideological reason people quietly stop practicing.",
  },
  {
    slug: "outdoor-retreats",
    category: "Retreat",
    num: "٥",
    chapter: "الفصل الخامس",
    title: "Outdoor Retreats",
    tagline:
      "Weekend retreats combining nature, sport, and Islamic learning — built for people who find classroom-only formats hard to stay engaged with.",
    whatItIs:
      "Quarterly weekend retreats — camping trips, beach and jungle excursions fitting our home on the Riviera Maya, and day tours — blending outdoor activity with short, high-impact teaching sessions and free time to bond.",
    activities: [
      {
        title: "Weekend campouts",
        desc: "Teaching circles around the fire, paired with hiking, kayaking, and beach activities.",
      },
      {
        title: "Inter-mosque sports",
        desc: "Football and volleyball tournaments — a low-barrier way to meet Muslims from other communities.",
      },
      {
        title: "Local day trips",
        desc: "Exploring this new life together, not just sitting and learning together.",
      },
    ],
    problem:
      "Retreats reach converts who won't come to another lecture but will come to a camping trip — and once there, they absorb more community and knowledge than a classroom delivers, while forming the friendships that keep people anchored.",
  },
  {
    slug: "inter-community-exchange",
    category: "Exchange",
    num: "٦",
    chapter: "الفصل السادس",
    title: "Inter-Community Exchange",
    tagline:
      "Structured trips connecting new-Muslim communities across Latin America, so no city's program has to reinvent itself in isolation.",
    whatItIs:
      "An exchange program sending small delegations of converts, teachers, and organizers to visit partner communities in other Latin American countries — sharing program models, building cross-border friendships, and letting converts see the size of the ummah they've joined.",
    activities: [
      {
        title: "Annual regional conference",
        desc: "A rotating host city brings together chapters and partner organizations from across the region.",
      },
      {
        title: "Delegation exchanges",
        desc: "Mexico converts visiting communities in Colombia, Brazil, or Argentina — and vice versa.",
      },
      {
        title: "Shared regional directory",
        desc: "A digital directory of new-Muslim organizations across Latin America, coordinating resources and avoiding duplicated effort.",
      },
    ],
    problem:
      "Isolation is not only individual — entire national convert communities can feel small and disconnected. Showing a new Muslim that there are thousands like them across the continent reframes conversion from a lonely event into membership in a real, large, connected community.",
  },
];

const BUILT_IN: Record<string, typeof PROGRAMS_AR> = { es: PROGRAMS_ES, ar: PROGRAMS_AR };

/** The program's text in the visitor's language, field by field: what was
 *  typed in the admin panel, else the built-in translation for the six
 *  original programs, else English.
 *  ponytail: a Spanish/Arabic field cleared in the admin shows the built-in
 *  text again, not English — the admin form pre-fills and saves it anyway. */
export function localizeProgram(p: Program, locale: string): Program {
  const typed = p.translations?.[locale];
  const builtIn = BUILT_IN[locale]?.[p.slug];
  if (!typed && !builtIn) return p;
  const pick = <K extends keyof ProgramText>(k: K): ProgramText[K] => typed?.[k] ?? builtIn?.[k] ?? p[k];
  return {
    ...p,
    category: pick("category"),
    title: pick("title"),
    tagline: pick("tagline"),
    whatItIs: pick("whatItIs"),
    activities: pick("activities"),
    problem: pick("problem"),
  };
}
