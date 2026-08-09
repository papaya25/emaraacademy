import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Donation Acceptance Policy — Emara Academy",
  description:
    "What donations Emara Academy accepts, how directed gifts are honored, and when we say no.",
};

export default function DonationAcceptancePolicyPage() {
  return (
    <PolicyPage
      title="Donation Acceptance Policy"
      arabic="القبول"
      intro="What we accept, how directed donations are honored, and — because integrity sometimes requires it — when we say no."
      sections={[
        {
          heading: "What we accept",
          paragraphs: [
            "Monetary donations by card, PayPal, and bank transfer, one-time or recurring, from individuals and organizations. In-kind donations (food, clothing, equipment, professional services) are welcomed by prior arrangement — write to us first so we can confirm the donation matches a real program need.",
          ],
        },
        {
          heading: "Directed donations",
          paragraphs: [
            "You may direct a donation to any program — education, teacher formation, events, the mutual aid fund, retreats, or regional exchange — and restricted-fund accounting keeps it there. If a directed program becomes impossible to deliver, we will contact you to redirect or refund your donation rather than silently repurposing it.",
          ],
        },
        {
          heading: "When we decline",
          paragraphs: [
            "We decline donations that come with conditions incompatible with our mission or values, donations we believe derive from unlawful activity, and donations whose acceptance would compromise our independence, the dignity of the people we serve, or our standing as a religious non-profit. Declining is rare — but the option protects everything else this organization stands for.",
          ],
        },
        {
          heading: "Anonymity and recognition",
          paragraphs: [
            "Donors may give anonymously, and anonymity is honored in our public ledger and reporting. We do not sell naming rights, and recognition of major supporters happens only with their explicit consent.",
          ],
        },
      ]}
    />
  );
}
