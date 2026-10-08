/** The "Un Corán para ti" campaign (owner, 2026-10-08): free Spanish Qur'ans
 *  across Mexico, requested through the site's own form (`coran_requests`,
 *  migration 013) — it replaced the owner's Google Form, keeping its fields. */

/** The campaign photos (public/campaign), in page order, with their alt-text keys. */
export const CORAN_PHOTOS = [
  { src: "/campaign/coran-mezquita.jpg", alt: "mosque", width: 1086, height: 1448 },
  { src: "/campaign/coranes-con-tarjeta.jpg", alt: "tags", width: 1086, height: 1448 },
  { src: "/campaign/coran-caja-regalo.jpg", alt: "box", width: 1312, height: 1199 },
  { src: "/campaign/coran-separador.jpg", alt: "bookmark", width: 1086, height: 1448 },
] as const;

/** The 32 federal entities, stored as written here (proper names, same in
 *  every language) so "by state" statistics stay clean. */
export const MX_STATES = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
] as const;

export const MAX_COPIES = 10;
export const RELATIONS = ["curious", "new_muslim", "muslim", "gift", "other"] as const;
export const HEARD_FROM = ["instagram", "facebook", "tiktok", "whatsapp", "friend", "mosque", "other"] as const;
export const REQUEST_STATUSES = ["pending", "sent", "delivered", "cancelled"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type CoranRequest = {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  street: string;
  ext_int_number: string;
  colonia: string;
  postal_code: string;
  city: string;
  state: string;
  address_refs: string;
  first_quran: boolean | null;
  reason: string | null;
  comments: string | null;
  quantity: number;
  relation: (typeof RELATIONS)[number] | null;
  heard_from: (typeof HEARD_FROM)[number] | null;
  locale: string | null;
  status: RequestStatus;
  tracking: string | null;
  status_changed_at: string | null;
  created_at: string;
};
