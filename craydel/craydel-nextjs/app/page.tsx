import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import ServiceHighlights from '@/components/sections/ServiceHighlights';
import PopularPackages from '@/components/sections/PopularPackages';
import DiscountsOffers from '@/components/sections/DiscountsOffers';
import FeaturedDestinations from '@/components/sections/FeaturedDestinations';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <ServiceHighlights />
      <PopularPackages />
      <DiscountsOffers />
      <FeaturedDestinations />
      <Footer />
    </>
  );
}
