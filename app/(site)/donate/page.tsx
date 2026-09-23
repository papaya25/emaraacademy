import type { Metadata } from "next";
import DonateFlow from "@/components/DonateFlow";

export const metadata: Metadata = {
  title: "Make a Donation — Emara Academy",
  description:
    "Support Emara Academy with a one-time or monthly donation — secure, fast, and recorded in our open ledger.",
};

export default function DonatePage() {
  return (
    <main>
      <DonateFlow />
    </main>
  );
}
