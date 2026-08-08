import type { Metadata } from "next";
import { Amiri, Lora } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["latin", "arabic"],
  variable: "--font-amiri",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emara Academy — Building Communities That Keep New Muslims",
  description:
    "Emara Academy is a school and a family for new Muslims across Latin America — structured learning, real mentorship, and a community that holds you through your first years of faith. Based in Playa del Carmen, Mexico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${amiri.variable} ${lora.variable}`}>
        <TopBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
