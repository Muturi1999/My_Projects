import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const inspirations = [
  {
    id: 1,
    image: '/images/visa-package-img1.webp',
    location: 'Rome, Italy',
    title: 'Explore Culture, Art, & Timeless Landmarks.',
    date: '12 Sep, 2025',
    description: 'Escape to the World\'s Most Breathtaking Islands and immerse yourself in paradise.',
  },
  {
    id: 2,
    image: '/images/visa-package-img2.webp',
    location: 'Rome, Italy',
    title: 'Tropical Escapes & Beach Getaways.',
    date: '12 Sep, 2025',
    description: 'Escape to the World\'s Most Breathtaking Islands and immerse yourself in paradise.',
  },
  {
    id: 3,
    image: '/images/visa-package-img3.webp',
    location: 'Rome, Italy',
    title: 'Crystal-Clear Waters & White Sands.',
    date: '12 Sep, 2025',
    description: 'Escape to the World\'s Most Breathtaking Islands and immerse yourself in paradise.',
  },
  {
    id: 4,
    image: '/images/visa-package-img4.webp',
    location: 'Brazil',
    title: 'Hiking, Trekking & Thrill-Seeking.',
    date: '12 Sep, 2025',
    description: 'Discover the best mountain getaways for nature lovers, where breathtaking landscapes.',
  },
  {
    id: 5,
    image: '/images/visa-package-img5.webp',
    location: 'Canada',
    title: 'The Best Mountain Getaways for Nature Lovers.',
    date: '12 Sep, 2025',
    description: 'Discover the best mountain getaways for nature lovers, where breathtaking landscapes.',
  },
];

export default function TravelInspirations() {
  return (
    <section className="travel-inspirations-section py-5">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>Travel Inspirations</h2>
          <p className="text-muted">
            A curated list of inspiration the most tour & travel based on different destinations.
          </p>
        </div>
        <div className="row g-4">
          {inspirations.map((inspiration) => (
            <div key={inspiration.id} className="col-lg-4 col-md-6">
              <Card className="border-0 shadow-sm h-100">
                <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                  <Image
                    src={inspiration.image}
                    alt={inspiration.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-muted small mb-2">{inspiration.location}</p>
                  <h4 className="mb-2">{inspiration.title}</h4>
                  <p className="text-muted small mb-3">{inspiration.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">{inspiration.date}</span>
                    <Link href="#" className="text-primary text-decoration-none">
                      Read More →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Button variant="outline" size="lg">
            View All Inspiration
          </Button>
        </div>
      </div>
    </section>
  );
}

