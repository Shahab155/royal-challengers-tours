'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const footerRef = useRef(null);
  const columnRefs = useRef([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useGSAP(() => {
    // Main footer fade-in
    gsap.from(footerRef.current, {
      opacity: 0,
      y: 60,
      duration: 1.1,
      ease: 'power3.out',
    });

    // Columns stagger
    gsap.from(columnRefs.current.filter(Boolean), {
      opacity: 0,
      y: 35,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power3.out',
      delay: 0.4,
    });
  }, { scope: footerRef });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <footer
      ref={footerRef}
      className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Column 1: Brand & Social */}
          <div ref={(el) => (columnRefs.current[0] = el)} className="space-y-6">
            <Link href="/" className="inline-block group">
              <Image
                src="/images/logo-light.png" // Use your actual light/dark logos
                alt="Royal Challengers Tours"
                width={220}
                height={100}
                className="transition-transform group-hover:scale-105"
                priority
              />
              {/* <Image
                src="/images/logo-dark.png"
                alt="Royal Challengers Tours"
                width={220}
                height={100}
                className="transition-transform group-hover:scale-105 hidden dark:block"
                priority
              /> */}
            </Link>

            <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-sm text-base">
              Crafting unforgettable luxury journeys across Dubai and beyond. Your trusted partner in extraordinary travel.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-5">
              {['Facebook', 'Instagram', 'Twitter/X', 'WhatsApp'].map((platform, i) => (
                <Link
                  key={platform}
                  href="#"
                  aria-label={platform}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-500)] transition-colors duration-300 transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    {/* Replace with actual SVG paths for each platform */}
                    <path d="M..." /> {/* Use proper icons */}
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div ref={(el) => (columnRefs.current[1] = el)}>
            <h3 className="text-xl font-semibold font-heading text-[var(--color-text)] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { href: '/', label: 'Home' },
                { href: '/destinations', label: 'Destinations' },
                { href: '/tours', label: 'Tours & Packages' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-500)] transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div ref={(el) => (columnRefs.current[2] = el)}>
            <h3 className="text-xl font-semibold font-heading text-[var(--color-text)] mb-6">
              Contact Us
            </h3>
            <ul className="space-y-5 text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-4">
                <svg className="w-5 h-5 text-[var(--color-accent-500)] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Office 305, Downtown Dubai<br />Sheikh Mohammed Bin Rashid Blvd, UAE</span>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-5 h-5 text-[var(--color-accent-500)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+971501234567" className="hover:text-[var(--color-accent-500)] transition">
                  +971 50 123 4567
                </a>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-5 h-5 text-[var(--color-accent-500)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@royalchallengerstours.com" className="hover:text-[var(--color-accent-500)] transition">
                  info@royalchallengerstours.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter - Premium look */}
          <div ref={(el) => (columnRefs.current[3] = el)}>
            <h3 className="text-xl font-semibold font-heading text-[var(--color-text)] mb-6">
              Stay in Touch
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6 text-base">
              Get exclusive offers, travel tips, and updates straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full px-5 py-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent-500)] focus:ring-2 focus:ring-[var(--color-accent-500)]/30 outline-none transition-all duration-300"
                />
                <label
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[var(--color-accent-500)] peer-focus:font-medium peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base"
                >
                  Your email address
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className={`mt-5 w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                  status === 'loading'
                    ? 'bg-gray-500 cursor-wait'
                    : 'btn-primary hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
              </button>

              {status === 'success' && (
                <p className="mt-4 text-center text-sm text-green-500 font-medium animate-fade-in">
                  Thank you! You're now subscribed.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-4 text-center text-sm text-red-500 font-medium">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-10 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-secondary)]">
          <p>
            © {new Date().getFullYear()} Royal Challengers Tours. All rights reserved.
          </p>
          <div className="mt-3 flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-[var(--color-accent-500)] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[var(--color-accent-500)] transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}