import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const offers = [
  { id: 1, image: '/images/visa-package-img1.webp', title: 'Special Offer 1' },
  { id: 2, image: '/images/visa-package-img2.webp', title: 'Special Offer 2' },
  { id: 3, image: '/images/visa-package-img3.webp', title: 'Special Offer 3' },
  { id: 4, image: '/images/visa-package-img4.webp', title: 'Special Offer 4' },
  { id: 5, image: '/images/visa-package-img5.webp', title: 'Special Offer 5' },
];

export default function DiscountsOffers() {
  return (
    <section className="discounts-offers-section py-5">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>Discounts & Offers</h2>
          <p className="text-muted">
            A curated list of the most popular travel packages based on different destinations.
          </p>
        </div>
        <div className="row g-4">
          {offers.map((offer) => (
            <div key={offer.id} className="col-lg-2 col-md-4 col-sm-6">
              <Card className="border-0 shadow-sm h-100">
                <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

