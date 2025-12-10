'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const continents = ['Africa', 'Asia', 'Europe', 'Middle East', 'North America', 'Oceania'];

const destinations = {
  Africa: [
    { name: 'Senegal', flag: '/images/senegal-flag.png', tours: '01 tours', departures: '297 departure', guests: '15,777 guest travelled' },
    { name: 'Zimbabwe', flag: '/images/zimbabwe-flag.png', tours: '01 tours', departures: '297 departure', guests: '15,777 guest travelled' },
    { name: 'Ghana', flag: '/images/ghana-flag.png', tours: '01 tours', departures: '191 departure', guests: '11,717 guest travelled' },
    { name: 'Morocco', flag: '/images/morocco-flag.png', tours: '01 tours', departures: '197 departure', guests: '12,277 guest travelled' },
    { name: 'South Africa', flag: '/images/south-africa-flag.png', tours: '01 tours', departures: '417 departure', guests: '9,777 guest travelled' },
    { name: 'Madagascar', flag: '/images/madagascar-flag.png', departures: '497 departure', guests: '11,277 guest travelled' },
    { name: 'Kenya', flag: '/images/kenya-flag.png', tours: '01 tours', departures: '321 departure', guests: '12,774 guest travelled' },
    { name: 'Egypt', flag: '/images/egypt-flag.png', departures: '297 departure', guests: '15,777 guest travelled' },
  ],
  Asia: [
    { name: 'Indonesia', flag: '/images/indonesia-flag-1.png', departures: '410 departure', guests: '15,781 guest travelled' },
    { name: 'Philippines', flag: '/images/philippines-flag.png', departures: '240 departure', guests: '15,786 guest travelled' },
    { name: 'Hanoi, Vietnam', flag: '/images/vietnam-flag.png', departures: '240 departure', guests: '15,786 guest travelled' },
    { name: 'Turkey', flag: '/images/turkey-flag.png', departures: '240 departure', guests: '15,786 guest travelled' },
    { name: 'Singapore', flag: '/images/singapore-flag.png', departures: '240 departure', guests: '15,786 guest travelled' },
    { name: 'Malaysia', flag: '/images/malaysia-flag.png', departures: '110 departure', guests: '11,654 guest travelled' },
    { name: 'Tokyo, Japan', flag: '/images/japan-flag.png', tours: '01 tours', departures: '240 departure', guests: '15,786 guest travelled' },
    { name: 'Thailand', flag: '/images/thailand-flag.png', tours: '01 tours', departures: '240 departure', guests: '15,786 guest travelled' },
  ],
  Europe: [
    { name: 'Greece', flag: '/images/greece-flag.png', departures: '240 departure', guests: '15,786 guest travelled' },
    { name: 'United Kingdom', flag: '/images/uk-flag.png', tours: '01 tours', departures: '440 departure', guests: '19,786 guest travelled' },
    { name: 'Germany', flag: '/images/germany-flag.png', departures: '340 departure', guests: '18,781 guest travelled' },
    { name: 'Portugal', flag: '/images/portugal-flag.png', departures: '240 departure', guests: '15,786 guest travelled' },
    { name: 'Netherlands', flag: '/images/netherland-flag.png', departures: '130 departure', guests: '16,781 guest travelled' },
    { name: 'Romania', flag: '/images/romania-flag.png', departures: '240 departure', guests: '15,786 guest travelled' },
    { name: 'Switzerland', flag: '/images/switzerland-flag.png', tours: '01 tours', departures: '140 departure', guests: '14,786 guest travelled' },
    { name: 'Rome, Italy', flag: '/images/italy-flag.png', departures: '220 departure', guests: '15,176 guest travelled' },
  ],
  'Middle East': [
    { name: 'Jordan', flag: '/images/jordan-flag.png', tours: '01 tours', departures: '513 departure', guests: '4,847 guest travelled' },
    { name: 'Qatar', flag: '/images/qatar-flag.png', tours: '02 tours', departures: '145 departure', guests: '18,847 guest travelled' },
    { name: 'Oman', flag: '/images/oman-flag.png', departures: '345 departure', guests: '18,847 guest travelled' },
    { name: 'Saudi Arabia', flag: '/images/saudi-arabia-flag.png', tours: '02 tours', departures: '325 departure', guests: '18,147 guest travelled' },
    { name: 'Arab Emirates', flag: '/images/uae-flag.png', tours: '01 tours', departures: '145 departure', guests: '18,847 guest travelled' },
  ],
  'North America': [
    { name: 'Mexico', flag: '/images/mexico-flag.png', departures: '554 departure', guests: '2,847 guest travelled' },
    { name: 'Canada', flag: '/images/canada-flag-1.png', tours: '01 tours', departures: '454 departure', guests: '22,847 guest travelled' },
    { name: 'Jamaica', flag: '/images/jamaica-flag.png', tours: '02 tours', departures: '154 departure', guests: '1,847 guest travelled' },
    { name: 'United States', flag: '/images/us-flag.png', tours: '01 tours', departures: '454 departure', guests: '22,847 guest travelled' },
  ],
  Oceania: [
    { name: 'P. New Guinea', flag: '/images/papua-new-guinea-flag.png', departures: '450 departure', guests: '13,717 guest travelled' },
    { name: 'Nauru', flag: '/images/nauru-flag.png', departures: '197 departure', guests: '5,777 guest travelled' },
    { name: 'New Zealand', flag: '/images/new-zealand-flag.png', tours: '01 tours', departures: '297 departure', guests: '15,777 guest travelled' },
    { name: 'Palau', flag: '/images/palau-flag.png', departures: '191 departure', guests: '16,777 guest travelled' },
    { name: 'Australia', flag: '/images/australia-flag-1.png', tours: '01 tours', departures: '297 departure', guests: '15,777 guest travelled' },
  ],
};

export default function FeaturedDestinations() {
  const [activeContinent, setActiveContinent] = useState(continents[0]);

  return (
    <section className="featured-destinations-section py-5">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>Featured Destinations</h2>
        </div>

        {/* Filter Tabs */}
        <div className="destinations-filters mb-4">
          <ul className="nav nav-pills justify-content-center gap-2 flex-wrap" role="tablist">
            {continents.map((continent) => (
              <li key={continent} className="nav-item">
                <button
                  className={`nav-link ${activeContinent === continent ? 'active' : ''}`}
                  onClick={() => setActiveContinent(continent)}
                >
                  {continent}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations Grid */}
        <div className="row g-4">
          {destinations[activeContinent as keyof typeof destinations]?.map((dest, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
              <Card className="border-0 shadow-sm h-100 destination-card">
                <CardContent className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Image
                      src={dest.flag}
                      alt={dest.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <div>
                      <h5 className="mb-0">{dest.name}</h5>
                      {dest.tours && <small className="text-muted">{dest.tours}</small>}
                    </div>
                  </div>
                  <div className="text-muted small">
                    <div>{dest.departures}</div>
                    <div>{dest.guests}</div>
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

