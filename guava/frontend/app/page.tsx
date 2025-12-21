import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { HotDealsSection } from "@/components/HotDealsSection";

// Lazy load below-fold sections for better performance
const TopLaptopDealsSection = dynamic(() => import("@/components/TopLaptopDealsSection").then(mod => ({ default: mod.TopLaptopDealsSection })), {
  loading: () => <div className="py-8 sm:py-10 md:py-12 bg-white"><div className="section-wrapper"><div className="h-64 animate-pulse bg-gray-100" /></div></div>,
});

const BrandSection = dynamic(() => import("@/components/BrandSection").then(mod => ({ default: mod.BrandSection })), {
  loading: () => <div className="py-12 bg-gray-50"><div className="section-wrapper"><div className="h-96 animate-pulse bg-gray-100" /></div></div>,
});

const PrinterScannerSection = dynamic(() => import("@/components/PrinterScannerSection").then(mod => ({ default: mod.PrinterScannerSection })), {
  loading: () => <div className="py-8 sm:py-10 md:py-12 bg-white"><div className="section-wrapper"><div className="h-64 animate-pulse bg-gray-100" /></div></div>,
});

const AccessoriesSection = dynamic(() => import("@/components/AccessoriesSection").then(mod => ({ default: mod.AccessoriesSection })), {
  loading: () => <div className="py-8 sm:py-10 md:py-12 bg-white"><div className="section-wrapper"><div className="h-64 animate-pulse bg-gray-100" /></div></div>,
});

const PopularBrands = dynamic(() => import("@/components/PopularBrands").then(mod => ({ default: mod.PopularBrands })), {
  loading: () => <div className="py-8 sm:py-10 md:py-12 bg-white"><div className="section-wrapper"><div className="h-48 animate-pulse bg-gray-100" /></div></div>,
});

const AudioSection = dynamic(() => import("@/components/AudioSection").then(mod => ({ default: mod.AudioSection })), {
  loading: () => <div className="py-8 sm:py-10 md:py-12 bg-white"><div className="section-wrapper"><div className="h-64 animate-pulse bg-gray-100" /></div></div>,
});

const PopularCategories = dynamic(() => import("@/components/PopularCategories").then(mod => ({ default: mod.PopularCategories })), {
  loading: () => <div className="py-8 sm:py-10 md:py-12 bg-white"><div className="section-wrapper"><div className="h-48 animate-pulse bg-gray-100" /></div></div>,
});

const ServiceGuarantees = dynamic(() => import("@/components/ServiceGuarantees").then(mod => ({ default: mod.ServiceGuarantees })), {
  loading: () => <div className="py-8 sm:py-10 md:py-12 bg-white"><div className="section-wrapper"><div className="h-32 animate-pulse bg-gray-100" /></div></div>,
});

const Footer = dynamic(() => import("@/components/Footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroBanner />
      <CategoryGrid />
      <FeaturedDeals />
      <HotDealsSection />
      <TopLaptopDealsSection />
      <BrandSection />
      <PrinterScannerSection />
      <AccessoriesSection />
      <PopularBrands />
      <AudioSection />
      <PopularCategories />
      <ServiceGuarantees />
      <Footer />
    </main>
  );
}
