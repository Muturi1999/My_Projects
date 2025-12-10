import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Robert Kcarery',
    role: 'GoFly Traveler',
    rating: 4,
    text: 'The tour was well-organized, and we enjoyed every bit of it. However, I wish we had more free time to explore on our own. Overall, a great experience!',
    image: '/images/visa-package-img1.webp',
  },
  {
    id: 2,
    name: 'Selina Henry',
    role: 'GoFly Traveler',
    rating: 4,
    text: 'The tour was well-organized, and we enjoyed every bit of it. However, I wish we had more free time to explore on our own. Overall, a great experience!',
    image: '/images/visa-package-img2.webp',
  },
  {
    id: 3,
    name: 'James Bonde',
    role: 'GoFly Traveler',
    rating: 4,
    text: 'The tour was well-organized, and we enjoyed every bit of it. However, I wish we had more free time to explore on our own. Overall, a great experience!',
    image: '/images/visa-package-img3.webp',
  },
  {
    id: 4,
    name: 'James Bonde',
    role: 'GoFly Traveler',
    rating: 4,
    text: 'The tour was well-organized, and we enjoyed every bit of it. However, I wish we had more free time to explore on our own. Overall, a great experience!',
    image: '/images/visa-package-img4.webp',
  },
  {
    id: 5,
    name: 'James Bonde',
    role: 'GoFly Traveler',
    rating: 4,
    text: 'The tour was well-organized, and we enjoyed every bit of it. However, I wish we had more free time to explore on our own. Overall, a great experience!',
    image: '/images/visa-package-img5.webp',
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section py-5 bg-light">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>Hear It from Travelers</h2>
          <p className="text-muted">
            We go beyond just booking trips—we create unforgettable travel experiences that match your dreams!
          </p>
        </div>
        <div className="row g-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="col-lg-4 col-md-6">
              <Card className="border-0 shadow-sm h-100">
                <CardContent className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="position-relative" style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h6 className="mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                  <div className="d-flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-muted mb-0">{testimonial.text}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <div className="d-flex align-items-center justify-content-center gap-3">
            <Image src="/images/logo.svg" alt="Logo" width={50} height={50} />
            <div className="d-flex align-items-center gap-2">
              <span className="h4 mb-0 fw-bold">4.5</span>
              <div className="d-flex gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 text-gray-300" />
              </div>
            </div>
            <div>
              <Image src="/images/rating-image.svg" alt="Rating" width={30} height={30} />
            </div>
            <span className="fw-semibold">Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}

