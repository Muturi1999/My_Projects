'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type TabType = 'tours' | 'hotels' | 'visa' | 'experience';

const tabs: { key: TabType; label: string; icon: string; badge?: string }[] = [
  { key: 'tours', label: 'Tours', icon: 'bi-bus-front', badge: '68 Tours' },
  { key: 'hotels', label: 'Hotels', icon: 'bi-building', badge: '45 Hotels' },
  { key: 'visa', label: 'Visa', icon: 'bi-passport', badge: '12 Countries' },
  { key: 'experience', label: 'Experience', icon: 'bi-compass', badge: '35 Guides' },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<TabType>('tours');

  const formFields = useMemo(() => {
    switch (activeTab) {
      case 'tours':
        return [
          { label: 'Destination', placeholder: 'Select Destination' },
          { label: 'Tour Types', placeholder: 'Tour Types' },
        ];
      case 'hotels':
        return [
          { label: 'Where to?', placeholder: 'Destination' },
          { label: 'Guests & Rooms', placeholder: '1 Adults, 0 Child' },
        ];
      case 'visa':
        return [
          { label: 'Country', placeholder: 'Select Country' },
          { label: 'Visa Category', placeholder: 'Travel Visa' },
        ];
      case 'experience':
        return [
          { label: 'Destination', placeholder: 'Select Destination' },
          { label: 'Activity Category', placeholder: 'Pick activity' },
        ];
      default:
        return [];
    }
  }, [activeTab]);

  return (
    <section className="hero-section hero-section-v2 position-relative overflow-hidden">
      <div className="hero-video-bg">
        <video autoPlay loop muted playsInline poster="/images/home1-location-search-bg.png">
          <source src="/home1-banner-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
      </div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-xl-11">
            <div className="hero-content text-center text-white mb-5">
              <h1 className="hero-title mb-3">All-in-one Travel Booking.</h1>
              <p className="hero-subtitle">
                Highlights convenience and simplicity, Best for agencies with online &amp; mobile-friendly services.
              </p>
            </div>

            <div className="search-tabs mb-3">
              <ul className="nav nav-pills justify-content-center gap-2 flex-wrap" role="tablist">
                {tabs.map((tab) => (
                  <li key={tab.key} className="nav-item">
                    <button
                      className={`nav-link hero-tab ${activeTab === tab.key ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      <span className="tab-icon-wrap">
                        <i className={`bi ${tab.icon}`}></i>
                      </span>
                      <span className="tab-label">{tab.label}</span>
                      {tab.badge && <span className="tab-badge">{tab.badge}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-search-wrapper">
              <div className="search-form-card search-form-card-v2 shadow-lg">
                <div className="row g-3 align-items-end">
                  <div className="col-lg-4">
                    <label className="form-label fw-semibold text-dark">Select</label>
                    <div className="input-icon">
                      <i className="bi bi-geo-alt"></i>
                      <Input placeholder={formFields[0]?.placeholder ?? 'Select Destination'} />
                    </div>
                    <small className="text-muted">Destination</small>
                    <div className="mt-2 small text-muted">
                      Can&apos;t find what you&apos;re looking for?{' '}
                      <a href="#" className="custom-itinerary-link">
                        create your Custom Itinerary
                      </a>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <label className="form-label fw-semibold text-dark">15 December</label>
                    <div className="input-icon">
                      <i className="bi bi-calendar-week"></i>
                      <Input type="date" defaultValue="2025-12-15" />
                    </div>
                    <small className="text-muted">Monday 2025</small>
                  </div>

                  <div className="col-lg-3">
                    <label className="form-label fw-semibold text-dark">{formFields[1]?.label ?? 'Tour Types'}</label>
                    <div className="input-icon">
                      <i className="bi bi-filter-circle"></i>
                      <select className="form-select">
                        <option>Adventure Tour</option>
                        <option>Family Tour</option>
                        <option>Group Tour</option>
                        <option>Solo Tour</option>
                      </select>
                    </div>
                    <small className="text-muted">Tour Types</small>
                  </div>

                  <div className="col-lg-2">
                    <Button className="w-100 hero-search-btn">
                      <Search className="me-2" />
                      Search
                    </Button>
                  </div>
                </div>

                <div className="tab-dots mt-3">
                  <span className="dot active"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

