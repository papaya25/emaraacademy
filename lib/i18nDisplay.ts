/**
 * Arabic display names for short structured values (cities, weekdays, class
 * tracks...) that are stored in English in Supabase and the sample data.
 * The stored value never changes — only what the visitor sees. Anything
 * missing from a table is shown as-is, so a new city added in the admin
 * panel still displays (in its original spelling) until it's added here.
 */

type Table = Record<string, string>;

const AR: Record<string, Table> = {
  city: {
    "Playa del Carmen": "بلايا ديل كارمن",
    "Cancún": "كانكون",
    Cancun: "كانكون",
    "Mérida": "ميريدا",
    Merida: "ميريدا",
    "Tulum": "تولوم",
    "Mexico City": "مدينة مكسيكو",
    "Ciudad de México": "مدينة مكسيكو",
    "Guadalajara": "غوادالاخارا",
    "Monterrey": "مونتيري",
    "Puerto Morelos": "بويرتو موريلوس",
    "Chetumal": "تشيتومال",
    Online: "عبر الإنترنت",
  },
  day: {
    Mondays: "كل إثنين",
    Tuesdays: "كل ثلاثاء",
    Wednesdays: "كل أربعاء",
    Thursdays: "كل خميس",
    Fridays: "كل جمعة",
    Saturdays: "كل سبت",
    Sundays: "كل أحد",
    Monday: "الإثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    Saturday: "السبت",
    Sunday: "الأحد",
  },
  track: {
    Foundations: "التأسيس",
    Practice: "الممارسة",
    Deepening: "التعمّق",
  },
  status: {
    Open: "التسجيل مفتوح",
    "Starting soon": "يبدأ قريبًا",
    Full: "مكتمل",
  },
  format: {
    "In person": "حضوري",
    Online: "عبر الإنترنت",
  },
  language: {
    "Español": "الإسبانية",
    Spanish: "الإسبانية",
    "Português": "البرتغالية",
    Portuguese: "البرتغالية",
    English: "الإنجليزية",
    "العربية": "العربية",
    Arabic: "العربية",
  },
};

export type DisplayKind = keyof typeof AR;

/** The visitor-facing label for a stored value, e.g. ("city", "Cancún", "ar") -> "كانكون". */
export function displayValue(kind: DisplayKind, value: string, locale: string): string {
  if (locale !== "ar") return value;
  return AR[kind]?.[value.trim()] ?? value;
}
