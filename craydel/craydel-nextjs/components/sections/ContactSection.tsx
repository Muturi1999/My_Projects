import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactSection() {
  return (
    <div
      className="home8-contact-section"
      style={{
        backgroundImage: 'url(/images/home8-contact-bg.webp)',
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="text-white">
              <h2 className="text-white mb-4">
                Get in Touch With Us
              </h2>
              <p className="text-white mb-4 opacity-75">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-4">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-20" style={{ width: '48px', height: '48px' }}>
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-white-50 small mb-1">Phone</p>
                    <p className="text-white fw-semibold mb-0">+91 345 533 865</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-4">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-20" style={{ width: '48px', height: '48px' }}>
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-white-50 small mb-1">Email</p>
                    <p className="text-white fw-semibold mb-0">support@gofly.com</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-4">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-20" style={{ width: '48px', height: '48px' }}>
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-white-50 small mb-1">Address</p>
                    <p className="text-white fw-semibold mb-0">123 Travel Street, City, Country</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <Card className="bg-white bg-opacity-95">
              <CardContent className="p-4 p-md-5">
                <h3 className="mb-4">Send us a message</h3>
                <form className="d-flex flex-column gap-3">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    className="w-100"
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    className="w-100"
                  />
                  <Input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-100"
                  />
                  <textarea
                    placeholder="Your Message"
                    className="form-control"
                    rows={5}
                    style={{ minHeight: '120px' }}
                  />
                  <Button type="submit" className="w-100">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
