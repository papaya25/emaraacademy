"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Rosette from "@/components/Rosette";
import Reveal from "@/components/Reveal";
import DonatePanel from "@/components/DonatePanel";
import DonateCheckout from "@/components/DonateCheckout";

function DonateFlowInner() {
  const t = useTranslations("donate");
  const params = useSearchParams();
  const hasAmount = params.get("amount") !== null;

  if (hasAmount) {
    return (
      <>
        <section className="about-hero checkout-hero">
          <div className="wrap">
            <p className="ar">صدقة جارية</p>
            <Rosette />
            <h1>{t("checkoutTitle")}</h1>
          </div>
        </section>
        <DonateCheckout />
      </>
    );
  }

  return (
    <>
      <section className="about-hero checkout-hero">
        <div className="wrap">
          <p className="ar">صدقة جارية</p>
          <Rosette />
          <h1>{t("title")}</h1>
        </div>
      </section>
      <section className="waqf">
        <div className="wrap narrow">
          <Reveal>
            <p className="ar">إِذَا مَاتَ ابْنُ آدَمَ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ</p>
            <p className="waqf-quote">{t("hadith")}</p>
            <p className="waqf-source">{t("hadithSource")}</p>
          </Reveal>
          <Reveal>
            <DonatePanel />
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default function DonateFlow() {
  return (
    <Suspense fallback={null}>
      <DonateFlowInner />
    </Suspense>
  );
}
