'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const footerRef = useRef(null);
  const columnRefs = useRef([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  useGSAP(() => {
    gsap.from(footerRef.current, {
      opacity: 0,
      y: 60,
      duration: 1.1,
      ease: 'power3.out',
    });

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
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer
      ref={footerRef}
      className="
        relative mt-auto
        bg-[var(--color-surface)]
        border-t border-[var(--color-border)]
      "
    >
      {/* Ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/40 to-transparent dark:via-primary-900/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-20">
          
          {/* Brand */}
          <div ref={(el) => (columnRefs.current[0] = el)} className="space-y-6">
            <Link href="/">
              <Image
                src="/images/logo-light.png"
                alt="Royal Challengers Tours"
                width={210}
                height={90}
                priority
              />
            </Link>

            <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
              Crafting unforgettable luxury journeys across Dubai and beyond.
              Your trusted partner in extraordinary travel.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { Icon: FaFacebookF, href: '#' },
                { Icon: FaInstagram, href: '#' },
                { Icon: FaTwitter, href: '#' },
                { Icon: FaWhatsapp, href: '#' },
              ].map(({ Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  className="
                    h-11 w-11 rounded-full
                    flex items-center justify-center
                    bg-white/60 dark:bg-black/20
                    backdrop-blur-md
                    border border-white/30
                    text-primary-500
                    shadow-[0_8px_20px_-6px_rgba(8,34,192,0.45)]
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:text-accent-500
                    hover:shadow-[0_14px_35px_-8px_rgba(8,34,192,0.65)]
                  "
                >
                  <Icon className="text-lg" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div ref={(el) => (columnRefs.current[1] = el)}>
            <h3 className="text-xl font-heading font-semibold text-[var(--color-text)] mb-6">
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
                    className="
                      text-[var(--color-text-secondary)]
                      hover:text-accent-500
                      transition-colors
                    "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div ref={(el) => (columnRefs.current[2] = el)}>
            <h3 className="text-xl font-heading font-semibold text-[var(--color-text)] mb-6">
              Contact Us
            </h3>
            <ul className="space-y-5 text-[var(--color-text-secondary)]">
              <li>
                Office 305, Downtown Dubai<br />
                Sheikh Mohammed Bin Rashid Blvd
              </li>
              <li>
                <a href="tel:+971501234567" className="hover:text-accent-500 transition">
                  +971 50 123 4567
                </a>
              </li>
              <li>
                <a href="mailto:info@royalchallengerstours.com" className="hover:text-accent-500 transition">
                  info@royalchallengerstours.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div ref={(el) => (columnRefs.current[3] = el)}>
            <h3 className="text-xl font-heading font-semibold text-[var(--color-text)] mb-6">
              Stay in Touch
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Exclusive offers, insider tips, and curated journeys.
            </p>

            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="
                  w-full px-5 py-4 rounded-xl
                  bg-white/70 dark:bg-black/20
                  backdrop-blur-md
                  border border-[var(--color-border)]
                  text-[var(--color-text)]
                  focus:border-accent-500
                  outline-none transition
                "
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="
                  mt-5 w-full py-4 rounded-xl
                  font-semibold text-white
                  bg-[linear-gradient(90deg,var(--primary),var(--accent))]
                  shadow-[0_20px_50px_-20px_rgba(8,34,192,0.6)]
                  hover:shadow-[0_30px_70px_-25px_rgba(8,34,192,0.75)]
                  transition-all duration-300
                "
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>

              {status === 'success' && (
                <p className="mt-4 text-center text-sm text-green-500">
                  You’re subscribed 🎉
                </p>
              )}
              {status === 'error' && (
                <p className="mt-4 text-center text-sm text-red-500">
                  Something went wrong.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-secondary)]">
          <p>© {new Date().getFullYear()} Royal Challengers Tours</p>
          <div className="mt-3 flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-accent-500 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent-500 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
