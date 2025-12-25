'use client';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function BookingForm() {
  const formRef = useRef(null);
  const [selectedPackage, setSelectedPackage] = useState('');

  useGSAP(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 80%' },
      }
    );
  }, { scope: formRef });

  const packages = [
    "Evening Desert Safari",
    "Overnight Desert Safari",
    "Marina Yacht Cruise",
    "Dubai City Highlights",
    "Abu Dhabi Explorer",
    "4-Day Ultimate Dubai",
    "Custom / Tailored Experience",
  ];

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 text-[var(--color-text)]">
            Secure Your Dubai Adventure
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Fill in your details — our team will contact you within hours to confirm and personalize your booking.
          </p>
        </div>

        {/* Form Card */}
        <div
          ref={formRef}
          className="card bg-[var(--color-surface)] backdrop-blur-md shadow-xl"
        >
          <form className="space-y-7">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  className="w-full px-6 py-4 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all duration-300 hover:border-accent-500/70"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-6 py-4 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all duration-300 hover:border-accent-500/70"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Contact + Package */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                  Phone Number (with country code) *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full px-6 py-4 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all duration-300 hover:border-accent-500/70"
                  placeholder="+971 50 123 4567"
                />
              </div>

              <div>
                <label htmlFor="package" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                  Interested Package *
                </label>
                <select
                  id="package"
                  required
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text)] focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all duration-300 hover:border-accent-500/70 appearance-none [&>option]:bg-[var(--color-surface)] [&>option]:text-[var(--color-text)]"
                >
                  <option value="" disabled className="text-[var(--color-text-secondary)]">
                    Select your preferred package
                  </option>
                  {packages.map((pkg) => (
                    <option key={pkg} value={pkg}>
                      {pkg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="travelDate" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                  Preferred Travel Date
                </label>
                <input
                  type="date"
                  id="travelDate"
                  className="w-full px-6 py-4 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text)] focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all duration-300 hover:border-accent-500/70 [color-scheme:dark]"
                />
              </div>

              <div>
                <label htmlFor="travelers" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                  Number of Travelers
                </label>
                <input
                  type="number"
                  id="travelers"
                  min="1"
                  defaultValue="2"
                  className="w-full px-6 py-4 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text)] focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all duration-300 hover:border-accent-500/70"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                Additional Requests or Questions
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-6 py-4 rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all duration-300 hover:border-accent-500/70 resize-none"
                placeholder="Tell us more about your group, special requests, dietary preferences, etc..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full py-6 text-xl font-bold mt-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Submit Booking Request
            </button>

            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
              You will receive confirmation within 24 hours. All bookings are 100% secure.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}