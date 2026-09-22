import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import MobileDonateBar from "@/components/MobileDonateBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      {children}
      <Footer />
      <MobileDonateBar />
    </>
  );
}
