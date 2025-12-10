import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle2, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: CheckCircle2,
    title: "High Visa Approval Rate & it's 99%.",
    description: 'Fast & Hassle-Free Visa Processing – 99% Approval Rate.',
  },
  {
    icon: Clock,
    title: 'Fast & Reliable Visa Processing.',
    description: 'Get your visa processed and approved within just 48 hours.',
  },
  {
    icon: Shield,
    title: '100% Secure & Confidential.',
    description: 'We ensure data privacy and strict confidentiality in all applications.',
  },
];

export default function WhyChooseSection() {
  return (
    <div className="why-choose-visa-section">
      <div className="container">
        <div className="section-title">
          <span>100% Trusted Agency!</span>
          <h2>Why Choose Our Visa Agency?</h2>
        </div>

        <div className="row">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="col-md-4 mb-4">
                <Card className="custom-icon border-0 shadow-lg h-100">
                  <CardHeader>
                    <div className="elementor-icon-box-icon">
                      <span className="elementor-icon">
                        <Icon className="h-12 w-12 text-primary" />
                      </span>
                    </div>
                    <h3 className="elementor-icon-box-title">
                      <span>{feature.title}</span>
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="elementor-icon-box-description">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
