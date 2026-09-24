/**
 * Spanish and Arabic display names for short structured values (cities, weekdays, class
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

const ES: Record<keyof typeof AR, Table> = {
  city: {
    Cancun: "Cancún",
    Merida: "Mérida",
    "Mexico City": "Ciudad de México",
    Online: "En línea",
  },
  day: {
    Mondays: "Los lunes",
    Tuesdays: "Los martes",
    Wednesdays: "Los miércoles",
    Thursdays: "Los jueves",
    Fridays: "Los viernes",
    Saturdays: "Los sábados",
    Sundays: "Los domingos",
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  },
  track: {
    Foundations: "Fundamentos",
    Practice: "Práctica",
    Deepening: "Profundización",
  },
  status: {
    Open: "Inscripciones abiertas",
    "Starting soon": "Empieza pronto",
    Full: "Cupo lleno",
  },
  format: {
    "In person": "Presencial",
    Online: "En línea",
  },
  language: {
    Spanish: "Español",
    "Português": "Portugués",
    Portuguese: "Portugués",
    English: "Inglés",
    "العربية": "Árabe",
    Arabic: "Árabe",
  },
};

const TABLES: Record<string, Record<keyof typeof AR, Table>> = { es: ES, ar: AR };

export type DisplayKind = keyof typeof AR;

/** The visitor-facing label for a stored value, e.g. ("city", "Cancún", "ar") -> "كانكون". */
export function displayValue(kind: DisplayKind, value: string, locale: string): string {
  return TABLES[locale]?.[kind]?.[value.trim()] ?? value;
}
