import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const offers = [
  {
    id: 1,
    image: '/images/visa-package-img1.webp',
    title: 'Bali Indonesia',
    price: '$299.00',
    duration: '04 Days',
  },
  {
    id: 2,
    image: '/images/visa-package-img3.webp',
    title: 'Travel Around The World',
    badge: '30% OFF',
    cta: 'View All Tour',
  },
  {
    id: 3,
    image: '/images/visa-package-img2.webp',
    title: 'Himachal Pradesh',
    price: '$299.00/pp',
    duration: '04 Days, 03 Nights',
  },
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

        <div className="row g-4 justify-content-center">
          {offers.map((offer) => (
            <div key={offer.id} className="col-lg-4 col-md-6">
              <Card className="border-0 shadow-sm h-100 discount-card">
                <div className="position-relative discount-img">
                  <Image src={offer.image} alt={offer.title} fill className="object-cover" />
                  {offer.badge && <span className="discount-badge">{offer.badge}</span>}
                </div>
                <CardContent className="p-4">
                  <h5 className="mb-2">{offer.title}</h5>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      {offer.price && <div className="h5 mb-0 text-primary">{offer.price}</div>}
                      {offer.duration && <small className="text-muted">{offer.duration}</small>}
                    </div>
                    {offer.cta && (
                      <a href="#" className="link-btn">
                        {offer.cta} <i className="bi bi-arrow-up-right"></i>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="tab-dots text-center mt-4">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
}

