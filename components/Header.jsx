"use client";
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';

// React Icons Imports
import {
  HiPhone,
  HiMail,
  HiX,
  HiPlusCircle,
  
} from 'react-icons/hi';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineGlobeAlt, HiOutlineEnvelope } from 'react-icons/hi2'; // v2 for outline versions
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [open, setOpen] = useState(false);

  // Refs
  const topBarRef = useRef(null);
  const topBarLeftRef = useRef(null);
  const topBarRightRef = useRef(null);
  const navTextItemsRef = useRef([]);
  const bookButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileNavItemsRef = useRef([]);
  const logoRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(topBarRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });

    gsap.fromTo(topBarLeftRef.current, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.4 });

    gsap.fromTo(topBarRightRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.6 });

    gsap.fromTo(navTextItemsRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.8 });

    if (bookButtonRef.current) {
      gsap.fromTo(bookButtonRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)', delay: 1.2 });
    }

    gsap.fromTo(logoRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.2 });
  }, []);

  useGSAP(() => {
    if (open) {
      gsap.fromTo(mobileMenuRef.current, { x: '100%' }, { x: 0, duration: 0.5, ease: 'power3.out' });

      gsap.fromTo(mobileNavItemsRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.2 });
    } else if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [open]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  return (
    <>
      {/* Top Bar */}
      <div
        ref={topBarRef}
        className="hidden md:flex py-2 text-sm font-bold transition-all duration-300 bg-primary-500 dark:bg-[var(--color-surface)] border-b border-primary-600 dark:border-[var(--color-border)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* LEFT: Contact Info */}
            <div ref={topBarLeftRef} className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:underline transition">
                <HiPhone className="w-5 h-5" />
                <span>+1 (234) 567-890</span>
              </a>
              <a href="mailto:info@royaltravelers.com" className="flex items-center gap-2 hover:underline transition">
                <HiMail className="w-5 h-5" />
                <span>info@royaltravelers.com</span>
              </a>
            </div>

            {/* RIGHT: Offers + Social Icons */}
            <div ref={topBarRightRef} className="flex items-center gap-6">
              <span className="hidden md:block">Exclusive Offers Available</span>
              <div className="flex items-center gap-4">
                <a href="#" aria-label="Facebook" className="hover:opacity-80 transition">
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Instagram" className="hover:opacity-80 transition">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" aria-label="X/Twitter" className="hover:opacity-80 transition">
                  <FaXTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[var(--color-bg)] border-b border-[var(--color-border)] sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 ">
            <Link href="/" className="flex items-center space-x-3 group" ref={logoRef}>
              <Image
                src="/images/logo-light.png"
                alt="Royal Travelers Logo"
                width={150}
                height={60}
                className="group-hover:scale-105 transition"
              />   
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-[var(--color-text)] hover:text-primary-500 font-bold transition-colors"
                ref={(el) => (navTextItemsRef.current[0] = el)}
              >
                Home
              </Link>
              <Link
                href="/packages"
                className="text-[var(--color-text)] hover:text-primary-500 font-bold transition-colors"
                ref={(el) => (navTextItemsRef.current[1] = el)}
              >
                Packages
              </Link>
              <Link
                href="/tours"
                className="text-[var(--color-text)] hover:text-primary-500 font-bold transition-colors"
                ref={(el) => (navTextItemsRef.current[2] = el)}
              >
                Tours
              </Link>
              <Link
                href="/about"
                className="text-[var(--color-text)] hover:text-primary-500 font-bold transition-colors"
                ref={(el) => (navTextItemsRef.current[3] = el)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-[var(--color-text)] hover:text-primary-500 font-bold transition-colors"
                ref={(el) => (navTextItemsRef.current[4] = el)}
              >
                Contact
              </Link>
              <Link href="/booking" className="btn-primary" ref={bookButtonRef}>
                Book Now
              </Link>
            </nav>

            {/* Theme Toggle + Hamburger */}
            <div className="flex items-center space-x-4">
             <ThemeToggle/>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] z-50 lg:hidden shadow-lg">
        <div className="grid grid-cols-5 py-2">
          <Link href="/" className="flex flex-col items-center justify-center py-2 text-[var(--color-text)] hover:text-primary-500 transition">
            <HiOutlineHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/packages" className="flex flex-col items-center justify-center py-2 text-[var(--color-text)] hover:text-primary-500 transition">
            <HiOutlineBriefcase className="w-6 h-6" />
            <span className="text-xs mt-1">Packages</span>
          </Link>
          <Link href="/book" className="flex flex-col items-center justify-center py-2 bg-primary-500 text-white rounded-full -mt-6 shadow-lg">
            <HiPlusCircle className="w-8 h-8" />
            <span className="text-xs font-bold mt-1">Book</span>
          </Link>
          <Link href="/tours" className="flex flex-col items-center justify-center py-2 text-[var(--color-text)] hover:text-primary-500 transition">
            <HiOutlineGlobeAlt className="w-6 h-6" />
            <span className="text-xs mt-1">Tours</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center justify-center py-2 text-[var(--color-text)] hover:text-primary-500 transition">
            <HiOutlineEnvelope className="w-6 h-6" />
            <span className="text-xs mt-1">Contact</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)}></div>
          <div ref={mobileMenuRef} className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-[var(--color-bg)] shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <span className="text-2xl font-bold text-primary-500 font-heading">Royal Travelers</span>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-[var(--color-surface)]">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-6 space-y-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block text-xl text-[var(--color-text)] hover:text-primary-500 transition-colors"
                ref={(el) => (mobileNavItemsRef.current[0] = el)}
              >
                Home
              </Link>
              <Link
                href="/packages"
                onClick={() => setOpen(false)}
                className="block text-xl text-[var(--color-text)] hover:text-primary-500 transition-colors"
                ref={(el) => (mobileNavItemsRef.current[1] = el)}
              >
                Packages
              </Link>
              <Link
                href="/tours"
                onClick={() => setOpen(false)}
                className="block text-xl text-[var(--color-text)] hover:text-primary-500 transition-colors"
                ref={(el) => (mobileNavItemsRef.current[2] = el)}
              >
                Tours
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="block text-xl text-[var(--color-text)] hover:text-primary-500 transition-colors"
                ref={(el) => (mobileNavItemsRef.current[3] = el)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block text-xl text-[var(--color-text)] hover:text-primary-500 transition-colors"
                ref={(el) => (mobileNavItemsRef.current[4] = el)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}