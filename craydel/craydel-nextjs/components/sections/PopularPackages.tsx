 'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type PackageTag = 'Family Tour' | 'Adventure Tour' | 'Group Tour';

type Package = {
  id: number;
  title: string;
  location: string;
  duration: string;
  price: string;
  originalPrice?: string;
  type: PackageTag;
  badges?: ('Sale on!' | 'Featured')[];
  image: string;
};

const packages: Package[] = [
  {
    id: 1,
    title: 'Old Town Discovery Walk',
    location: 'Qatar',
    duration: '02/Hours',
    price: '$69.00',
    type: 'Family Tour',
    image: '/images/visa-package-img1.webp',
  },
  {
    id: 2,
    title: 'Kiwi Adventures Await',
    location: 'New Zealand , Canada',
    duration: '5 Days/4 Nights',
    price: '$449.00',
    originalPrice: '$780.00',
    type: 'Adventure Tour',
    badges: ['Sale on!'],
    image: '/images/visa-package-img2.webp',
  },
  {
    id: 3,
    title: 'Loire Valley & Central France',
    location: 'Saudi Arabia',
    duration: '5 Days/4 Nights',
    price: '$488.00',
    type: 'Group Tour',
    badges: ['Featured'],
    image: '/images/visa-package-img3.webp',
  },
  {
    id: 4,
    title: 'Cycling The Loire',
    location: 'Ghana',
    duration: '2 Days/1 Nights',
    price: '$699.00',
    type: 'Group Tour',
    badges: ['Sale on!'],
    image: '/images/visa-package-img4.webp',
  },
  {
    id: 5,
    title: 'The French Alps Adventure',
    location: 'Australia , Jamaica',
    duration: '8 Days/7 Nights',
    price: '$580.00',
    type: 'Adventure Tour',
    badges: ['Featured'],
    image: '/images/visa-package-img5.webp',
  },
  {
    id: 6,
    title: 'Egypt & Nile Cruise Adventure',
    location: 'Morocco , South Africa',
    duration: '5 Days/6 Nights',
    price: '$499.00',
    originalPrice: '$599.00',
    type: 'Group Tour',
    badges: ['Sale on!', 'Featured'],
    image: '/images/visa-package-img6.webp',
  },
];

export default function PopularPackages() {
  const slides = useMemo(() => {
    const chunked: Package[][] = [];
    for (let i = 0; i < packages.length; i += 3) {
      chunked.push(packages.slice(i, i + 3));
    }
    return chunked;
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    if (index < 0) {
      setCurrentSlide(slides.length - 1);
    } else if (index >= slides.length) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(index);
    }
  };

  return (
    <section className="popular-packages-section py-5">
      <div className="container">
        <div className="section-title text-center mb-4">
          <h2>Popular Travel Packages</h2>
          <p className="text-muted">
            A curated list of the most popular travel packages based on different destinations.
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`dot-btn ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="slider-controls d-none d-md-flex gap-2">
            <button className="control-btn" onClick={() => goToSlide(currentSlide - 1)}>
              <ArrowLeft size={18} />
            </button>
            <button className="control-btn" onClick={() => goToSlide(currentSlide + 1)}>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="row g-4">
          {slides[currentSlide]?.map((pkg) => (
            <div key={pkg.id} className="col-lg-4 col-md-6">
              <Card className="border-0 shadow-sm package-card h-100">
                <div className="package-img position-relative">
                  <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
                  <div className="package-tags">
                    <span className="badge badge-soft-yellow">{pkg.type}</span>
                    {pkg.badges?.map((badge) => (
                      <span key={badge} className={`badge badge-soft-${badge === 'Sale on!' ? 'red' : 'blue'}`}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <i className="bi bi-geo-alt text-primary"></i>
                    <span>{pkg.location}</span>
                    <span className="dot-separator" />
                    <span>{pkg.duration}</span>
                  </div>
                  <h5 className="mb-3">{pkg.title}</h5>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span className="text-muted small d-block">per person</span>
                      <div className="d-flex align-items-center gap-2">
                        {pkg.originalPrice && <del className="text-muted">{pkg.originalPrice}</del>}
                        <span className="h5 mb-0 text-primary">{pkg.price}</span>
                      </div>
                    </div>
                    <Button size="sm" className="book-btn">
                      Book Now <i className="bi bi-arrow-up-right ms-2"></i>
                    </Button>
                  </div>
                  <div className="d-flex align-items-center gap-3 text-muted small package-meta">
                    <span>
                      <i className="bi bi-compass me-1"></i> Experience
                    </span>
                    <span>
                      <i className="bi bi-check-circle me-1"></i> Inclusion
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

