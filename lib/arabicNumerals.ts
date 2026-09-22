const INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Converts a positive integer to Arabic-Indic numerals, e.g. 12 -> "١٢". */
export function arabicIndicNumeral(n: number): string {
  return String(n)
    .split("")
    .map((d) => INDIC_DIGITS[Number(d)] ?? d)
    .join("");
}

const ORDINALS = [
  "الأول",
  "الثاني",
  "الثالث",
  "الرابع",
  "الخامس",
  "السادس",
  "السابع",
  "الثامن",
  "التاسع",
  "العاشر",
  "الحادي عشر",
  "الثاني عشر",
];

/** Chapter heading for the nth (1-indexed) program, e.g. 1 -> "الفصل الأول". */
export function chapterHeading(n: number): string {
  const ordinal = ORDINALS[n - 1] ?? arabicIndicNumeral(n);
  return `الفصل ${ordinal}`;
}
