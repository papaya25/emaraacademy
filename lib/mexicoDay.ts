/** A date in Mexico City time (the academy's day) as YYYY-MM-DD. */
export const mexicoDay = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(date);
