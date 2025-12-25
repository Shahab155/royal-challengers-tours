// components/home/FAQSection.jsx
'use client';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function FAQSection() {
  const containerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useGSAP(() => {
    // Entrance animation for FAQ items
    gsap.fromTo(
      containerRef.current.querySelectorAll('.faq-item'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { scope: containerRef });

  const faqs = [
    {
      question: "Is booking with Royal Challengers Travelers safe?",
      answer: "Yes, 100%. We are a fully licensed and insured Dubai travel agency with over 7 years of experience serving international clients. All payments are processed securely, and you receive instant confirmation plus 24/7 support throughout your trip.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex), secure bank transfers, and cash on arrival for local clients. All international transactions are protected with SSL encryption.",
    },
    {
      question: "What is your cancellation and refund policy?",
      answer: "Free cancellation up to 48 hours before most tours/packages (full refund). Cancellations within 24–48 hours may incur a small fee depending on the experience. Rescheduling is usually free if done 48 hours in advance. Full policy is included in your booking confirmation.",
    },
    {
      question: "Do you offer private or customized tours?",
      answer: "Absolutely! We specialize in private, luxury, and fully customized experiences — from exclusive desert dinners to private yacht charters. Simply mention your preferences in the booking form or contact us directly.",
    },
    {
      question: "Do you provide hotel/airport transfers?",
      answer: "Yes, luxury airport transfers and hotel pick-up/drop-off are included in most packages and available as an add-on for tours. We use premium vehicles with professional, English-speaking drivers.",
    },
    {
      question: "What happens if weather affects my desert tour?",
      answer: "Your safety is our priority. If weather conditions (e.g., heavy rain or sandstorm) make the desert unsafe, we will either reschedule at no extra cost or offer a comparable city-based alternative experience. In rare cases, a full refund is provided.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-bg)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-[var(--color-text)] mb-5">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Quick answers to the most common questions from our international travelers
          </p>
        </div>

        {/* FAQ Accordion */}
        <div ref={containerRef} className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item card  overflow-hidden transition-all duration-500 ${
                openIndex === index
                  ? 'shadow-xl border border-primary-500'
                  : 'hover:shadow-lg border-[var(--color-border)]'
              }`}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none group"
              >
                <span className="text-lg md:text-xl font-medium text-[var(--color-text)] group-hover:text-primary-500 transition-colors">
                  {faq.question}
                </span>

                {/* Plus/Minus Icon with rotation */}
                <span
                  className={`text-2xl font-bold text-primary-500 transition-transform duration-500 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>

              {/* Answer Content */}
              <div
                className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
                }`}
              >
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final Call to Action */}
        <div className="text-center mt-12 lg:mt-16">
          <p className="text-lg text-[var(--color-text-secondary)] mb-6">
            Still have questions? We’re here to help.
          </p>
          <a
            href="/contact"
            className="btn-outline inline-flex px-10 py-5 text-lg font-semibold"
          >
            Contact Us Now
          </a>
        </div>
      </div>
    </section>
  );
}