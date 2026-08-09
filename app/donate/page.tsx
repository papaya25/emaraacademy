import type { Metadata } from "next";
import { Suspense } from "react";
import Rosette from "@/components/Rosette";
import DonateCheckout from "@/components/DonateCheckout";

export const metadata: Metadata = {
  title: "Complete Your Donation — Emara Academy",
  description:
    "Finish your donation to Emara Academy — secure, fast, and recorded in our open ledger.",
};

export default function DonatePage() {
  return (
    <main>
      <section className="about-hero checkout-hero">
        <div className="wrap">
          <p className="ar">صدقة جارية</p>
          <Rosette />
          <h1>Complete Your Donation</h1>
        </div>
      </section>
      <Suspense fallback={null}>
        <DonateCheckout />
      </Suspense>
    </main>
  );
}
