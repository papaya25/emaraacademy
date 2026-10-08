/** The "Un Corán para ti" campaign (owner, 2026-10-08): free Spanish Qur'ans
 *  across Mexico, requested through a Google Form. */
export const CORAN_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeUyD1J1FWPu2RwCiGxsz7ftCYHWhbKbD8jvGWwwaa0jDg5zQ/viewform";
export const CORAN_FORM_EMBED = `${CORAN_FORM_URL}?embedded=true`;

/** The campaign photos (public/campaign), in page order, with their alt-text keys. */
export const CORAN_PHOTOS = [
  { src: "/campaign/coran-mezquita.jpg", alt: "mosque", width: 1086, height: 1448 },
  { src: "/campaign/coranes-con-tarjeta.jpg", alt: "tags", width: 1086, height: 1448 },
  { src: "/campaign/coran-caja-regalo.jpg", alt: "box", width: 1312, height: 1199 },
  { src: "/campaign/coran-separador.jpg", alt: "bookmark", width: 1086, height: 1448 },
] as const;
