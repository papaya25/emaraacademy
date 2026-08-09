import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Emara Academy",
  description:
    "What Emara Academy collects, why, and how it's protected — in plain language.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      arabic="الخصوصية"
      intro="What we collect, why we collect it, and how we protect it — in plain language, because privacy policies should be readable."
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "When you write to us, we keep your name, email, and message so we can reply. When you subscribe to the newsletter, we keep your email address. When you donate, our payment processors (Stripe and PayPal) handle your payment details — we never see or store card numbers — and we keep the donation record: amount, date, and the name or 'anonymous' you chose.",
            "We do not collect anything else, and we do not buy, sell, or trade personal information — ever.",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "To answer your messages, send the newsletter you asked for, issue donation receipts, and publish honest aggregate reporting (never individual details without your consent).",
            "For new Muslims who join our programs, discretion is a religious duty for us, not just a legal one: your participation, questions, and any help you receive from the mutual aid fund are treated as confidential.",
          ],
        },
        {
          heading: "Who else touches your data",
          paragraphs: [
            "Our website runs on Vercel; our database is hosted by Supabase; payments are processed by Stripe and PayPal; newsletter emails are sent through Resend. Each processes only what it needs to provide its service, under its own security and privacy commitments.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "Ask us any time what we hold about you, ask us to correct it, or ask us to delete it — including unsubscribing from the newsletter, which every email lets you do in one click. Write to info@emaraacademy.org and it will be done.",
          ],
        },
      ]}
    />
  );
}
