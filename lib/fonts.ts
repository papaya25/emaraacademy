import { Amiri, Lora } from "next/font/google";

/** Site fonts, shared by the public site's and the admin's root layouts. */
export const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["latin", "arabic"],
  variable: "--font-amiri",
  display: "swap",
});

export const lora = Lora({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const fontClasses = `${amiri.variable} ${lora.variable}`;
