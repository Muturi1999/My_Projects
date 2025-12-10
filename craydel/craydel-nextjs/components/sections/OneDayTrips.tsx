import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const trips = [
  {
    id: 1,
    image: '/images/visa-package-img1.webp',
    type: 'Solo Tour',
    title: 'Culture & Cuisine Discovery',
    location: 'Saudi Arabia',
    duration: '02/Hours',
    price: '$65.00',
    featured: false,
  },
  {
    id: 2,
    image: '/images/visa-package-img2.webp',
    type: 'Family Tour',
    title: 'Art, Music & Heritage Tour',
    location: 'Arab Emirates',
    duration: '03/Hours',
    price: '$69.00',
    featured: false,
  },
  {
    id: 3,
    image: '/images/visa-package-img3.webp',
    type: 'Adventure Tour',
    title: 'Eco-Friendly City Ride',
    location: 'Tokyo, Japan',
    duration: '05/Hours',
    price: '$120.00',
    featured: true,
  },
  {
    id: 4,
    image: '/images/visa-package-img4.webp',
    type: 'Solo Tour',
    title: 'Mystic Mountains Retreat',
    location: 'Paris, France',
    duration: '01/Hours',
    price: '$65.00',
    featured: false,
  },
  {
    id: 5,
    image: '/images/visa-package-img5.webp',
    type: 'Group Tour',
    title: 'Historic Landmarks Journey',
    location: 'United States',
    duration: '03/Hours',
    price: '$70.00',
    featured: false,
    sale: true,
  },
  {
    id: 6,
    image: '/images/visa-package-img6.webp',
    type: 'Family Tour',
    title: 'Old Town Discovery Walk',
    location: 'Qatar',
    duration: '02/Hours',
    price: '$69.00',
    featured: false,
  },
];

export default function OneDayTrips() {
  return (
    <section className="one-day-trips-section py-5 bg-light">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>One Day Trips</h2>
          <p className="text-muted">
            A curated list of the most popular travel packages based on different destinations.
          </p>
        </div>
        <div className="row g-4">
          {trips.map((trip) => (
            <div key={trip.id} className="col-lg-4 col-md-6">
              <Card className={`border-0 shadow-sm h-100 position-relative ${trip.featured ? 'featured' : ''} ${trip.sale ? 'sale' : ''}`}>
                {trip.sale && (
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2">Sale on!</span>
                )}
                {trip.featured && (
                  <span className="badge bg-primary position-absolute top-0 start-0 m-2">Featured</span>
                )}
                <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-secondary">{trip.type}</span>
                    <span className="text-muted small">{trip.duration}</span>
                  </div>
                  <h5 className="mb-2">{trip.title}</h5>
                  <p className="text-muted small mb-3">{trip.location}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted small d-block">per person</span>
                      <span className="h5 mb-0 text-primary">{trip.price}</span>
                    </div>
                    <Button variant="default" size="sm">
                      Book Now
                    </Button>
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

