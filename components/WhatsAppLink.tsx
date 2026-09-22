"use client";

import { useSetting } from "@/lib/settings";
import { DEFAULT_CONTACT, whatsappUrl } from "@/lib/contactInfo";

type Props = {
  message: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

/** WhatsApp CTA that always points at the live admin-managed phone number. */
export default function WhatsAppLink({ message, className, onClick, children }: Props) {
  const contact = useSetting("contact_info", DEFAULT_CONTACT);
  return (
    <a
      className={className}
      href={whatsappUrl(contact.phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
