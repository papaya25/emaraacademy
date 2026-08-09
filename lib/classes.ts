// Sample class schedule — replace with real data (later: Supabase `classes` table).
export type ClassInfo = {
  id: string;
  city: string;
  subject: string;
  track: "Foundations" | "Practice" | "Deepening";
  language: string;
  day: string;
  time: string;
  format: "In person" | "Online";
  status: "Open" | "Starting soon" | "Full";
  blurb: string;
};

export const CLASS_CITIES = ["All Cities", "Playa del Carmen", "Cancún", "Online"];

export const CLASSES: ClassInfo[] = [
  {
    id: "pdc-foundations-es",
    city: "Playa del Carmen",
    subject: "Islam from Zero — prayer, purification & first beliefs",
    track: "Foundations",
    language: "Español",
    day: "Thursdays",
    time: "7:00–8:30 PM",
    format: "In person",
    status: "Open",
    blurb:
      "For brand-new Muslims and the curious. Learn to pray step by step, with a shared dinner after every class.",
  },
  {
    id: "pdc-quran-es",
    city: "Playa del Carmen",
    subject: "Qur'an Reading from Zero",
    track: "Foundations",
    language: "Español",
    day: "Saturdays",
    time: "10:00–11:30 AM",
    format: "In person",
    status: "Open",
    blurb:
      "The Arabic letters, sound by sound, until you read the Qur'an on your own. No prior Arabic — ever — required.",
  },
  {
    id: "pdc-practice-es",
    city: "Playa del Carmen",
    subject: "Living Islam — fasting, zakat, family & daily life",
    track: "Practice",
    language: "Español",
    day: "Tuesdays",
    time: "7:00–8:30 PM",
    format: "In person",
    status: "Starting soon",
    blurb:
      "Your first Ramadan, navigating non-Muslim family, and the fiqh of everyday life in Latin America.",
  },
  {
    id: "cun-foundations-es",
    city: "Cancún",
    subject: "Islam from Zero — prayer, purification & first beliefs",
    track: "Foundations",
    language: "Español",
    day: "Sundays",
    time: "11:00 AM–12:30 PM",
    format: "In person",
    status: "Starting soon",
    blurb:
      "Our first Cancún cohort — small group, patient pace, and lunch together after class.",
  },
  {
    id: "online-foundations-pt",
    city: "Online",
    subject: "Islã do Zero — oração e primeiros passos",
    track: "Foundations",
    language: "Português",
    day: "Wednesdays",
    time: "8:00–9:00 PM",
    format: "Online",
    status: "Open",
    blurb:
      "For Portuguese speakers anywhere in Latin America — live online, with a mentor assigned in your first two weeks.",
  },
  {
    id: "online-deepening-es",
    city: "Online",
    subject: "Seerah & Tafsir Circle",
    track: "Deepening",
    language: "Español",
    day: "Mondays",
    time: "8:00–9:00 PM",
    format: "Online",
    status: "Full",
    blurb:
      "The life of the Prophet ﷺ and the meanings of the Qur'an, for those ready to go deeper. Next cohort opens soon.",
  },
];
