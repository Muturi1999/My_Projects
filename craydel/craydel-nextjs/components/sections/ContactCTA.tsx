import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactCTA() {
  return (
    <section className="contact-cta-section py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h3 className="mb-3">To More Inquiry</h3>
            <p className="text-muted mb-4">Don't hesitate Call to GoFly.</p>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <small className="text-muted d-block">WhatsApp</small>
                    <strong>+91 345 533 865</strong>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <small className="text-muted d-block">Mail Us</small>
                    <strong>support@gofly.com</strong>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <small className="text-muted d-block">Call Us</small>
                    <strong>+91 456 453 345</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

