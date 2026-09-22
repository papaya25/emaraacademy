export type ContactInfo = { email: string; phone: string };

/** Fallback until the `contact_info` site_setting loads (or if it's never set). */
export const DEFAULT_CONTACT: ContactInfo = {
  email: "info@emaraacademy.org",
  phone: "+52 55 2670 9079",
};

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function whatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${phoneDigits(phone)}?text=${encodeURIComponent(message)}`;
}
