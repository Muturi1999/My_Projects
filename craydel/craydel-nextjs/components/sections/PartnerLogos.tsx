import Image from 'next/image';

const partners = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  logo: `/images/partner-logo-${i + 1}.svg`,
  name: `Partner ${i + 1}`,
}));

export default function PartnerLogos() {
  return (
    <section className="partner-logos-section py-5 bg-light">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h5 className="text-muted mb-0">Those Company You Can Easily Trust!</h5>
        </div>
        <div className="row g-4 align-items-center">
          {partners.map((partner) => (
            <div key={partner.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
              <div className="partner-logo-wrapper d-flex align-items-center justify-content-center p-3">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="img-fluid opacity-50"
                  style={{ filter: 'grayscale(100%)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

