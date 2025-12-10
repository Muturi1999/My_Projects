import { Button } from '@/components/ui/button';
import { Search, Heart, Settings, Smile } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: Heart,
    title: 'Make Your Favourite Package',
    description: 'Create personalized travel experiences tailored to your preferences.',
  },
  {
    icon: Settings,
    title: 'Easily Customize Tours',
    description: 'Modify itineraries, add activities, and adjust schedules with ease.',
  },
  {
    icon: Smile,
    title: 'Enjoy Your Trip',
    description: 'Relax and enjoy your perfectly customized travel experience.',
  },
];

export default function CustomizeTravelSection() {
  return (
    <section className="customize-travel-section py-5 position-relative" style={{
      backgroundImage: 'url(/images/customize-travel-bg.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="position-absolute inset-0 bg-dark bg-opacity-60" style={{ zIndex: 1 }} />
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="text-white mb-3">Customize Your Travel Package!</h2>
            <div className="search-form-card bg-white rounded-4 p-4 shadow-lg mb-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Your Location</label>
                <select className="form-select">
                  <option>Saudi Arabia</option>
                  <option>United States</option>
                  <option>Arab Emirates</option>
                  <option>Tokyo, Japan</option>
                  <option>Paris, France</option>
                  <option>Qatar</option>
                  <option>New Zealand</option>
                  <option>Canada</option>
                  <option>Switzerland</option>
                  <option>Jordan</option>
                  <option>Jamaica</option>
                  <option>Kenya</option>
                  <option>Australia</option>
                  <option>Ghana</option>
                  <option>Senegal</option>
                  <option>Zimbabwe</option>
                  <option>Thailand</option>
                  <option>Morocco</option>
                  <option>South Africa</option>
                  <option>United Kingdom</option>
                </select>
              </div>
              <Button className="w-100 btn-primary btn-lg">
                <Search className="me-2" />
                Search Now
              </Button>
            </div>
            <div className="row g-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="col-md-4">
                    <div className="text-center text-white">
                      <div className="mb-2">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h6 className="mb-1">{feature.title}</h6>
                      <p className="small mb-0 text-white-50">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="text-center">
              <h4 className="text-white mb-4">Meet Our Local Tour Guider!</h4>
              <Button variant="outline" className="btn-outline-light">
                Contact Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

