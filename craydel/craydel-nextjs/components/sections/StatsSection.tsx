import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { number: '26', label: 'Tour Completed', suffix: '+' },
  { number: '12', label: 'Travel Experience', suffix: '+' },
  { number: '20', label: 'Happy Traveler', suffix: '+' },
  { number: '98', label: 'Retention Rate', suffix: '%' },
];

export default function StatsSection() {
  return (
    <section className="stats-section py-5" style={{ background: 'linear-gradient(135deg, #1781FE 0%, #0EA9D0 100%)' }}>
      <div className="container">
        <div className="row g-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <Card className="border-0 bg-transparent text-center text-white">
                <CardContent className="p-4">
                  <h2 className="display-4 fw-bold mb-2">
                    {stat.number}
                    <span className="fs-3">{stat.suffix}</span>
                  </h2>
                  <p className="mb-0 fs-5">{stat.label}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

