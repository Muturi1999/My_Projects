'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '@/data/faqData';

interface FAQSectionProps {
  faqs?: FAQ[];
  title?: string;
  description?: string;
}

const defaultFAQs = [
  {
    id: 1,
    question: 'What Services Does Your Travel Agency Provide?',
    answer: 'A travel agency typically provides a wide range of services to ensure a smooth and enjoyable travel experience. As like- Hotel booking, Flight Booking, Visa & Customized Travel Pakcge etc.',
  },
  {
    id: 2,
    question: 'Do You Offer Customized Travel Packages?',
    answer: 'Absolutely! We offer fully customized travel packages based on your interests, budget, and schedule. Whether you\'re planning a solo adventure, a family vacation, a romantic getaway, or a group tour, our team will tailor every detail to create a personalized travel experience just for you.',
  },
  {
    id: 3,
    question: 'How do I book a tour or vacation package?',
    answer: 'Booking a tour or vacation package is easy! Simply browse our website to explore destinations and packages. Once you\'ve found the perfect option, click "Book Now" and follow the steps to complete your reservation. If you need help, our travel experts are just a call or message away to assist you with the booking process.',
  },
  {
    id: 4,
    question: 'Do You Provide Visa Assistance?',
    answer: 'Yes, we do! Our team offers complete visa assistance services to help you navigate the application process smoothly. From providing guidance on required documents to scheduling appointments and submitting applications, we\'re here to support you every step of the way.',
  },
  {
    id: 5,
    question: 'Do you provide travel insurance options?',
    answer: 'Yes, we do! We offer travel insurance options to ensure peace of mind during your trip. Our insurance plans cover trip cancellations, medical emergencies, lost luggage, and more. You can choose to add travel insurance during the booking process or contact our team for personalized assistance.',
  },
];

export default function FAQSection({ 
  faqs = defaultFAQs,
  title = 'General Questions',
  description = 'We\'re committed to offering more than just products—we provide exceptional experiences.'
}: FAQSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section py-5">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>{title}</h2>
          <p className="text-muted">{description}</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq) => (
                <div key={faq.id} className="accordion-item border mb-3 rounded">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${openId === faq.id ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleFAQ(faq.id)}
                      aria-expanded={openId === faq.id}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  {openId === faq.id && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
