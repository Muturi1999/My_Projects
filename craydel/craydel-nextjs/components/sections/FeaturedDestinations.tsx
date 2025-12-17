'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

type Destination = {
  name: string;
  image: string;
  region: string;
};

const continents = ['Africa', 'Asia', 'Europe', 'Middle East', 'North America', 'Oceania'];

const destinations: Record<(typeof continents)[number], Destination[]> = {
  Africa: [
    { name: 'Morocco', image: '/images/visa-package-img3.webp', region: 'Africa' },
    { name: 'South Africa', image: '/images/visa-package-img5.webp', region: 'Africa' },
    { name: 'Madagascar', image: '/images/visa-package-img6.webp', region: 'Africa' },
    { name: 'Kenya', image: '/images/visa-package-img2.webp', region: 'Africa' },
  ],
  Asia: [
    { name: 'Bali, Indonesia', image: '/images/visa-package-img1.webp', region: 'Asia' },
    { name: 'Hanoi, Vietnam', image: '/images/visa-package-img4.webp', region: 'Asia' },
    { name: 'Thailand', image: '/images/visa-package-img7.webp', region: 'Asia' },
    { name: 'Singapore', image: '/images/visa-package-img8.webp', region: 'Asia' },
  ],
  Europe: [
    { name: 'Rome, Italy', image: '/images/visa-package-img3.webp', region: 'Europe' },
    { name: 'Switzerland', image: '/images/visa-package-img5.webp', region: 'Europe' },
    { name: 'Portugal', image: '/images/visa-package-img4.webp', region: 'Europe' },
    { name: 'Greece', image: '/images/visa-package-img6.webp', region: 'Europe' },
  ],
  'Middle East': [
    { name: 'Qatar', image: '/images/visa-package-img1.webp', region: 'Middle East' },
    { name: 'Saudi Arabia', image: '/images/visa-package-img2.webp', region: 'Middle East' },
    { name: 'Oman', image: '/images/visa-package-img4.webp', region: 'Middle East' },
    { name: 'Arab Emirates', image: '/images/visa-package-img6.webp', region: 'Middle East' },
  ],
  'North America': [
    { name: 'Mexico', image: '/images/visa-package-img2.webp', region: 'North America' },
    { name: 'Canada', image: '/images/visa-package-img5.webp', region: 'North America' },
    { name: 'Jamaica', image: '/images/visa-package-img6.webp', region: 'North America' },
    { name: 'United States', image: '/images/visa-package-img1.webp', region: 'North America' },
  ],
  Oceania: [
    { name: 'New Zealand', image: '/images/visa-package-img2.webp', region: 'Oceania' },
    { name: 'Australia', image: '/images/visa-package-img5.webp', region: 'Oceania' },
    { name: 'Palau', image: '/images/visa-package-img8.webp', region: 'Oceania' },
    { name: 'P. New Guinea', image: '/images/visa-package-img4.webp', region: 'Oceania' },
  ],
};

export default function FeaturedDestinations() {
  const [activeContinent, setActiveContinent] = useState<(typeof continents)[number]>(continents[0]);

  const slides = useMemo(() => {
    const activeList = destinations[activeContinent] || [];
    return [activeList.slice(0, 4), activeList.slice(4, 8)].filter((group) => group.length);
  }, [activeContinent]);

  const [activeSlide, setActiveSlide] = useState(0);

  const handleTabChange = (continent: (typeof continents)[number]) => {
    setActiveContinent(continent);
    setActiveSlide(0);
  };

  return (
    <section className="featured-destinations-section py-5">
      <div className="container">
        <div className="section-title text-center mb-4">
          <h2>Featured Destinations</h2>
        </div>

        <div className="destinations-filters mb-4">
          <ul className="nav nav-pills justify-content-center gap-2 flex-wrap" role="tablist">
            {continents.map((continent) => (
              <li key={continent} className="nav-item">
                <button
                  className={`nav-link ${activeContinent === continent ? 'active' : ''}`}
                  onClick={() => handleTabChange(continent)}
                >
                  {continent}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="row g-4">
          {slides[activeSlide]?.map((destination) => (
            <div key={destination.name} className="col-lg-3 col-md-6">
              <Card className="destination-card-lg border-0 shadow-sm h-100">
                <div className="destination-img-wrapper position-relative">
                  <Image src={destination.image} alt={destination.name} fill className="object-cover" />
                </div>
                <div className="destination-meta text-center p-3">
                  <span className="text-muted small d-block">{destination.region}</span>
                  <h5 className="mb-0">{destination.name}</h5>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="slider-dots text-center mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot-btn ${activeSlide === index ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to destination slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

