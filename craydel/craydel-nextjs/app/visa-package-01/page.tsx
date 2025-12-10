import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/sections/Breadcrumb';
import VisaPackageGrid from '@/components/sections/VisaPackageGrid';
import WhyChooseVisaSection from '@/components/sections/WhyChooseVisaSection';
import VisaAssistanceCTA from '@/components/sections/VisaAssistanceCTA';
import WorkingProcess from '@/components/sections/WorkingProcess';
import FAQSection from '@/components/sections/FAQSection';
import ContactCTA from '@/components/sections/ContactCTA';
import Footer from '@/components/layout/Footer';
import { visaPackages } from '@/data/visaPackages';
import { visaPageFAQs } from '@/data/faqData';

export default function VisaPackagePage() {
  return (
    <>
      <Header />
      <Breadcrumb
        title="Visa Package 01"
        backgroundImage="/images/breadcrumb-bg5.webp"
        items={[{ label: 'Visa Package 01' }]}
      />
      <div className="page-wrapper sec-mar">
        <div className="page-content-wrapper">
          <VisaPackageGrid packages={visaPackages} />
          <WhyChooseVisaSection />
          <VisaAssistanceCTA />
          <WorkingProcess />
          <FAQSection 
            faqs={visaPageFAQs}
            title="Questions & Answer"
            description="We're committed to offering more than just products—we provide exceptional experiences."
          />
          <ContactCTA />
        </div>
      </div>
      <Footer />
    </>
  );
}

