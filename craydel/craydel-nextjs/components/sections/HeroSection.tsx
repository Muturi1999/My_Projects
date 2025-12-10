'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

type TabType = 'tours' | 'hotels' | 'visa' | 'experience';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<TabType>('tours');

  return (
    <section className="hero-section position-relative" style={{
      backgroundImage: 'url(/images/home1-location-search-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '150px 0 100px',
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="hero-content text-center text-white mb-5">
              <h1 className="display-4 fw-bold mb-3">All-in-one Travel Booking.</h1>
              <p className="lead mb-4">
                Highlights convenience and simplicity, Best for agencies with online & mobile-friendly services.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="search-tabs mb-4">
              <ul className="nav nav-pills justify-content-center gap-2" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'tours' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tours')}
                  >
                    Tours
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'hotels' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hotels')}
                  >
                    Hotels
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'visa' ? 'active' : ''}`}
                    onClick={() => setActiveTab('visa')}
                  >
                    Visa
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`}
                    onClick={() => setActiveTab('experience')}
                  >
                    Experience
                  </button>
                </li>
              </ul>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Tours Tab */}
              {activeTab === 'tours' && (
                <div className="search-form-card bg-white rounded-4 p-4 shadow-lg">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Destination</label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Saudi Arabia</option>
                        <option>United States</option>
                        <option>Arab Emirates</option>
                        <option>Tokyo, Japan</option>
                        <option>Paris, France</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Tour Types</label>
                      <select className="form-select">
                        <option>Adventure Tour</option>
                        <option>Family Tour</option>
                        <option>Group Tour</option>
                        <option>Solo Tour</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <Button className="w-100 btn-primary btn-lg">
                        <Search className="me-2" />
                        SEARCH
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hotels Tab */}
              {activeTab === 'hotels' && (
                <div className="search-form-card bg-white rounded-4 p-4 shadow-lg">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Where to?</label>
                      <select className="form-select">
                        <option>Destination</option>
                        <option>Dhaka, Bangladesh</option>
                        <option>Himachal Pradesh, India</option>
                        <option>Jakarta, Indonesia</option>
                        <option>Lisbon, Portugal</option>
                        <option>Marina Bay, Singapore</option>
                        <option>Bangkok, Thailand</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">1 Adults, 0 Child</label>
                      <select className="form-select">
                        <option>1 Room</option>
                        <option>2 Rooms</option>
                        <option>3 Rooms</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <Button className="w-100 btn-primary btn-lg">
                        <Search className="me-2" />
                        SEARCH
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Visa Tab */}
              {activeTab === 'visa' && (
                <div className="search-form-card bg-white rounded-4 p-4 shadow-lg">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Country</label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Australia</option>
                        <option>Canada</option>
                        <option>India</option>
                        <option>Indonesia</option>
                        <option>Qatar</option>
                        <option>Thailand</option>
                        <option>United States</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Visa Category</label>
                      <select className="form-select">
                        <option>Business Visa</option>
                        <option>Medical Visa</option>
                        <option>Student Visa</option>
                        <option>Travel Visa</option>
                        <option>Work Visa</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Citizenship</label>
                      <select className="form-select">
                        <option>American</option>
                        <option>Australian</option>
                        <option>Brazilian</option>
                        <option>Canadian</option>
                        <option>Chinese</option>
                        <option>Indian</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Current Location</label>
                      <select className="form-select">
                        <option>Australia</option>
                        <option>Bangladesh</option>
                        <option>Brazil</option>
                        <option>Canada</option>
                        <option>India</option>
                        <option>Japan</option>
                        <option>United Kingdom</option>
                        <option>United States</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <Button className="w-100 btn-primary btn-lg">
                        <Search className="me-2" />
                        SEARCH
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <div className="search-form-card bg-white rounded-4 p-4 shadow-lg">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Destination</label>
                      <select className="form-select">
                        <option>Select</option>
                        <option>Morocco</option>
                        <option>Paris, France</option>
                        <option>Philippines</option>
                        <option>Singapore</option>
                        <option>Canada</option>
                        <option>Jordan</option>
                        <option>Australia</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Activity Category</label>
                      <select className="form-select">
                        <option>Bungee Jumping</option>
                        <option>Hiking & Trekking</option>
                        <option>Paragliding</option>
                        <option>Rock Climbing</option>
                        <option>Skydiving</option>
                        <option>Zip-lining</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <Button className="w-100 btn-primary btn-lg">
                        <Search className="me-2" />
                        SEARCH
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

