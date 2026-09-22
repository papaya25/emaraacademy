"use client";

import { useSetting } from "@/lib/settings";
import { DEFAULT_CONTACT, phoneDigits } from "@/lib/contactInfo";

/** Phone + email links, always the live admin-managed values. */
export default function ContactDetails() {
  const contact = useSetting("contact_info", DEFAULT_CONTACT);
  return (
    <>
      <a href={`tel:+${phoneDigits(contact.phone)}`}>{contact.phone}</a>
      <a href={`mailto:${contact.email}`}>{contact.email}</a>
    </>
  );
}
