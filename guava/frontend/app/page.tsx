import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { BrandSection } from "@/components/BrandSection";
import { PopularBrands } from "@/components/PopularBrands";
import { AccessoriesSection } from "@/components/AccessoriesSection";
import { AudioSection } from "@/components/AudioSection";
import { PopularCategories } from "@/components/PopularCategories";
import { ServiceGuarantees } from "@/components/ServiceGuarantees";
import { Footer } from "@/components/Footer";
import { PrinterScannerSection } from "@/components/PrinterScannerSection";
import { HotDealsSection } from "@/components/HotDealsSection";
import { TopLaptopDealsSection } from "@/components/TopLaptopDealsSection";
import { laptopDeals, printerDeals } from "@/lib/data/products";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroBanner />
      <CategoryGrid />
      <FeaturedDeals />
      <HotDealsSection />
      <TopLaptopDealsSection products={laptopDeals} />
      <BrandSection />
      <PrinterScannerSection products={printerDeals} />
      <AccessoriesSection />
      <PopularBrands />
      <AudioSection />
      <PopularCategories />
      <ServiceGuarantees />
      <Footer />
    </main>
  );
}
