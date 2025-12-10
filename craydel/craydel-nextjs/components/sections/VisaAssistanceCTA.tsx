import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function VisaAssistanceCTA() {
  return (
    <section className="visa-assistance-cta-section py-5 bg-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h6 className="text-primary mb-3 small fw-semibold">Need Visa Assitance?</h6>
            <h3 className="mb-3 fw-bold">To Get Visa Assistance,</h3>
            <h3 className="mb-4 fw-bold">Join Schedule a Meeting.</h3>
            <Button size="lg" className="btn-primary px-4 py-3">
              Schedule a Consultation
              <ArrowRight className="ms-2 h-5 w-5" />
            </Button>
          </div>
          <div className="col-lg-6">
            <div className="position-relative" style={{ height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
              <Image
                src="/images/home8-contact-img.webp"
                alt="Visa Assistance"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
