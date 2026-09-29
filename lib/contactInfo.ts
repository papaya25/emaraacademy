export type ContactInfo = {
  email: string;
  phone: string;
  // Full profile links (edited in admin → Settings); blank = not shown.
  instagram?: string;
  facebook?: string;
  tiktok?: string;
};

/** Fallback until the `contact_info` site_setting loads (or if it's never set).
 *  The social links are placeholders until the owner sets the real accounts. */
export const DEFAULT_CONTACT: ContactInfo = {
  email: "info@emaraacademy.org",
  phone: "+52 55 2670 9079",
  instagram: "https://www.instagram.com/emaraacademy",
  facebook: "https://www.facebook.com/emaraacademy",
  tiktok: "https://www.tiktok.com/@emaraacademy",
};

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function whatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${phoneDigits(phone)}?text=${encodeURIComponent(message)}`;
}
