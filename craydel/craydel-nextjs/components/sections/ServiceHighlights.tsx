'use client';

const highlights = [
  {
    icon: 'bi-award',
    title: 'Local Guidance',
    description: 'Travel agencies have experienced professionals guidance.',
  },
  {
    icon: 'bi-percent',
    title: 'Deals & Discounts',
    description: 'Agencies have special discounts on flights, hotels, & packages.',
    cta: 'Flat 30% Discounts All Packages',
  },
  {
    icon: 'bi-wallet2',
    title: 'Saves Money',
    description: 'Avoids hidden fees & tourist traps, Multi-destination & budget-friendly options.',
  },
];

export default function ServiceHighlights() {
  return (
    <section className="service-highlight-section py-5">
      <div className="container">
        <div className="highlight-card">
          <h3 className="text-center mb-4">We&apos;re Providing Best Service Ever!</h3>
          <div className="row g-4 align-items-center">
            {highlights.map((item) => (
              <div key={item.title} className="col-lg-4 col-md-6">
                <div className="highlight-item">
                  <div className="icon-circle">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <h5 className="mb-2">{item.title}</h5>
                    <p className="mb-3">{item.description}</p>
                    {item.cta && (
                      <a href="#" className="link-btn">
                        {item.cta} <i className="bi bi-arrow-up-right"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

