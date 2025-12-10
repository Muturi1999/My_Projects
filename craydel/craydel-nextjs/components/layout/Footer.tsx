import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';

const topDestinations = [
  'Maldives Tour',
  'Bali, Indonesia Tour',
  'Thailand Tour',
  'Philippines Tour',
  'Hawaii, USA Tour',
  'Switzerland Tour',
  'New Zealand Tour',
  'Costa Rica Tour',
  'Peru (Machu Picchu)',
  'Paris, France Tour',
];

const popularSearches = [
  'Adventure',
  'Hiking & Stiking',
  'Holiday Packages',
  'Flights And Hotels',
  'Honeymoon Trip',
  'Bali Vacation Package',
  'Desert Safari',
  'Last-Minute Deals',
  'Summer Vacation',
  'Wildlife Safari',
  'Dubai Luxury Tours',
];

const resources = [
  { label: 'About GoFly', href: '/about' },
  { label: 'Health & Safety Measure', href: '/health-safety' },
  { label: 'Visa Processing', href: '/visa-processing' },
  { label: 'Customize Tour', href: '/customize-tour' },
  { label: 'Travel Inspirations', href: '/travel-inspirations' },
  { label: 'Traveler Reviews', href: '/reviews' },
  { label: 'Terms & Condition', href: '/terms' },
  { label: 'Sitemap', href: '/sitemap' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'X (Twitter)' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="footer-section position-relative">
      {/* Contact Information Bar */}
      <div className="footer-contact-bar bg-dark text-white py-4">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <h6 className="mb-0">To More Inquiry</h6>
                  <small className="text-white-50">Don't hesitate Call to GoFly.</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h6 className="mb-0">WhatsApp</h6>
                  <a href="https://wa.me/91345533865" className="text-white text-decoration-none">
                    +91 345 533 865
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h6 className="mb-0">Mail Us</h6>
                  <a href="mailto:info@example.com" className="text-white text-decoration-none">
                    info@example.com
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h6 className="mb-0">Call Us</h6>
                  <a href="tel:+91456453345" className="text-white text-decoration-none">
                    +91 456 453 345
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div
        className="footer-main position-relative py-5"
        style={{
          backgroundImage: 'url(/images/footer-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="footer-overlay position-absolute inset-0 bg-dark bg-opacity-90" />
        <div className="container position-relative z-2">
          <div className="row g-4 mb-4">
            {/* Left Column - Company Info */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-logo mb-4">
                <Link href="/" className="d-inline-block mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary rounded p-2">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white mb-0">GoFly</h4>
                      <small className="text-white-50">Travel.co</small>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="footer-company-info mb-4">
                <h5 className="text-white mb-2">GoFly Travel Agency</h5>
                <p className="text-white-50 mb-0 small">
                  Skyline Plaza, 5th Floor, 123 Main Street<br />
                  Los Angeles, CA 90001, USA
                </p>
              </div>
              <div className="footer-social mb-4">
                <div className="d-flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        className="text-white text-decoration-none d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-10"
                        style={{ width: '40px', height: '40px' }}
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="footer-app-download">
                <button className="btn btn-light d-flex align-items-center gap-2 px-3 py-2">
                  <Image
                    src="/images/google-play.svg"
                    alt="Google Play"
                    width={24}
                    height={24}
                  />
                  <span className="small">GET IN Google Play</span>
                </button>
              </div>
            </div>

            {/* Middle Column - Top Destination */}
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Top Destination</h5>
              <ul className="list-unstyled footer-links">
                {topDestinations.map((destination, index) => (
                  <li key={index} className="mb-2">
                    <Link
                      href={`/destination/${destination.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-white-50 text-decoration-none small hover-text-white"
                    >
                      {destination}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle-Right Column - Popular Search */}
            <div className="col-lg-3 col-md-6">
              <h5 className="text-white mb-3">Popular Search</h5>
              <ul className="list-unstyled footer-links">
                {popularSearches.map((search, index) => (
                  <li key={index} className="mb-2">
                    <Link
                      href={`/search?q=${encodeURIComponent(search)}`}
                      className="text-white-50 text-decoration-none small hover-text-white"
                    >
                      {search}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Resources */}
            <div className="col-lg-3 col-md-6">
              <h5 className="text-white mb-3">Resources</h5>
              <ul className="list-unstyled footer-links">
                {resources.map((resource, index) => (
                  <li key={index} className="mb-2">
                    <Link
                      href={resource.href}
                      className="text-white-50 text-decoration-none small hover-text-white"
                    >
                      {resource.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom border-top border-white border-opacity-10 pt-4">
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <p className="text-white-50 small mb-0">
                  Copyright 2025 Egens Lab | All Right Reserved.
                </p>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center justify-content-md-end gap-3">
                  <span className="text-white-50 small">Accepted Payment Methods :</span>
                  <div className="d-flex gap-2">
                    <Image
                      src="/images/mastar-card-icon.svg"
                      alt="Mastercard"
                      width={40}
                      height={25}
                      className="opacity-75"
                    />
                    <Image
                      src="/images/visa-icon.svg"
                      alt="Visa"
                      width={40}
                      height={25}
                      className="opacity-75"
                    />
                    <Image
                      src="/images/paypal-icon.svg"
                      alt="PayPal"
                      width={40}
                      height={25}
                      className="opacity-75"
                    />
                    <Image
                      src="/images/gpay-icon.svg"
                      alt="Google Pay"
                      width={40}
                      height={25}
                      className="opacity-75"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
