import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowUpRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Apply Online',
    description: 'The first step is to assess the client\'s needs based on the type of visa (Tourist, Business, Student, etc.).',
  },
  {
    number: '02',
    title: 'Get an Appointment',
    description: 'The first step is to assess the client\'s needs based on the type of visa (Tourist, Business, Student, etc.).',
  },
  {
    number: '03',
    title: 'Submit Documents',
    description: 'The first step is to assess the client\'s needs based on the type of visa (Tourist, Business, Student, etc.).',
  },
  {
    number: '04',
    title: 'Receive Visa',
    description: 'The first step is to assess the client\'s needs based on the type of visa (Tourist, Business, Student, etc.).',
  },
];

export default function WorkingProcess() {
  return (
    <section className="working-process-section py-5 bg-dark text-white">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2 className="text-white mb-3">Working Process</h2>
          <p className="text-white-50">
            A curated list of the most popular travel packages based on different destinations.
          </p>
        </div>
        <div className="row g-4 position-relative">
          {/* Connecting Line */}
          <div className="position-absolute top-0 start-0 w-100 d-none d-lg-block" style={{ top: '60px', height: '2px', background: 'rgba(255,255,255,0.2)', zIndex: 0 }}>
            <div className="container">
              <div className="row">
                <div className="col-3"></div>
                <div className="col-3"></div>
                <div className="col-3"></div>
                <div className="col-3"></div>
              </div>
            </div>
          </div>
          
          {steps.map((step, index) => (
            <div key={index} className="col-lg-3 col-md-6 position-relative">
              <Card className="border-0 bg-transparent text-white h-100 position-relative" style={{ zIndex: 1 }}>
                <CardContent className="p-4 text-center">
                  <div className="step-number-wrapper mb-4">
                    <div className="step-number-circle bg-white text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto" 
                         style={{ width: '80px', height: '80px', fontSize: '28px' }}>
                      {step.number}
                    </div>
                  </div>
                  <h4 className="mb-3 text-white">{step.title}</h4>
                  <p className="text-white-50 mb-0">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* CTA Section for Step 02 */}
        <div className="row mt-5 pt-4">
          <div className="col-lg-8 mx-auto">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 p-4 bg-dark bg-opacity-50 rounded">
              <div className="d-flex align-items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-white-50 small d-block">E-Message</span>
                  <a href="mailto:info@example.com" className="text-white text-decoration-none">
                    info@example.com
                  </a>
                </div>
              </div>
              <span className="text-white-50">OR</span>
              <Button variant="outline" className="btn-outline-light">
                Apply Online
                <ArrowUpRight className="ms-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
