import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Donation & Refund Policy — Emara Academy",
  description:
    "How donations to Emara Academy are handled, recorded, and — when something goes wrong — refunded.",
};

export default function DonationPolicyPage() {
  return (
    <PolicyPage
      title="Donation & Refund Policy"
      arabic="الصدقات"
      intro="How your donation is handled from the moment you give it — and what happens if something goes wrong."
      sections={[
        {
          heading: "How donations are handled",
          paragraphs: [
            "Every donation is recorded under restricted-fund accounting. If you direct your donation to a specific program, it is spent inside that program. Undirected donations go where the need is greatest, and all spending is reported in our public ledger and annual statements.",
          ],
        },
        {
          heading: "Recurring donations",
          paragraphs: [
            "Monthly donations can be paused or cancelled at any time, instantly, by writing to us — no questions, no retention tactics. Cancellation stops all future charges; already-processed months are handled under the refund terms below.",
          ],
        },
        {
          heading: "Refunds",
          paragraphs: [
            "Donations are generally final — that's what lets us commit funds to programs with confidence. But mistakes deserve fixing: if you were charged in error, charged twice, gave the wrong amount, or a recurring donation ran after you cancelled, write to us within 30 days and we will refund it to your original payment method, promptly and without argument.",
            "For any refund request, contact info@emaraacademy.org with the date and amount — please don't open a dispute with your bank first, as that freezes funds for everyone and takes far longer than we do.",
          ],
        },
        {
          heading: "Receipts",
          paragraphs: [
            "Every donation receives an emailed receipt. Documentation for tax purposes depends on your country and our registration status — write to us before giving if this matters to your situation, and we'll tell you honestly what we can and cannot provide.",
          ],
        },
      ]}
    />
  );
}
