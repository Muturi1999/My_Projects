import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import DiscountsOffers from '@/components/sections/DiscountsOffers';
import FeaturedDestinations from '@/components/sections/FeaturedDestinations';
import CustomizeTravelSection from '@/components/sections/CustomizeTravelSection';
import PartnerLogos from '@/components/sections/PartnerLogos';
import OneDayTrips from '@/components/sections/OneDayTrips';
import TravelInspirations from '@/components/sections/TravelInspirations';
import Testimonials from '@/components/sections/Testimonials';
import FAQSection from '@/components/sections/FAQSection';
import StatsSection from '@/components/sections/StatsSection';
import ContactCTA from '@/components/sections/ContactCTA';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <DiscountsOffers />
      <FeaturedDestinations />
      <CustomizeTravelSection />
      <PartnerLogos />
      <OneDayTrips />
      <TravelInspirations />
      <Testimonials />
      <FAQSection />
      <StatsSection />
      <ContactCTA />
      <Footer />
    </>
  );
}
