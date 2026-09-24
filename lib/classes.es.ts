import type { ClassInfo } from "./classes";

/** Spanish text for the sample classes, keyed by id. Structured fields
 *  (city, day, track, status...) are translated by lib/i18nDisplay.ts. */
export const CLASSES_ES: Record<string, Pick<ClassInfo, "subject" | "blurb" | "time">> = {
  "pdc-foundations-es": {
    subject: "Islam desde cero — la oración, la purificación y las primeras creencias",
    time: "7:00–8:30 p. m.",
    blurb: "Para quienes acaban de abrazar el islam y para los curiosos. Aprende a rezar paso a paso, con una cena compartida después de cada clase.",
  },
  "pdc-quran-es": {
    subject: "Lectura del Corán desde cero",
    time: "10:00–11:30 a. m.",
    blurb: "Las letras árabes, sonido por sonido, hasta que leas el Corán por tu cuenta. No necesitas saber nada de árabe, de verdad.",
  },
  "pdc-practice-es": {
    subject: "Vivir el islam — el ayuno, el zakat, la familia y el día a día",
    time: "7:00–8:30 p. m.",
    blurb: "Tu primer Ramadán, cómo llevar la relación con tu familia no musulmana y el fiqh de la vida diaria en América Latina.",
  },
  "cun-foundations-es": {
    subject: "Islam desde cero — la oración, la purificación y las primeras creencias",
    time: "11:00 a. m.–12:30 p. m.",
    blurb: "Nuestro primer grupo en Cancún: pocas personas, a un ritmo tranquilo y con comida juntos después de clase.",
  },
  "online-foundations-pt": {
    subject: "Islam desde cero (en portugués) — la oración y los primeros pasos",
    time: "8:00–9:00 p. m.",
    blurb: "Para quienes hablan portugués en cualquier parte de América Latina: en vivo por internet, con un mentor asignado en tus dos primeras semanas.",
  },
  "online-deepening-es": {
    subject: "Círculo de Sira y Tafsir",
    time: "8:00–9:00 p. m.",
    blurb: "La vida del Profeta ﷺ y los significados del Corán, para quienes quieren profundizar. El próximo grupo abre pronto.",
  },
};
