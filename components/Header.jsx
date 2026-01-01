"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaSuitcaseRolling,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaCalendarCheck,
} from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["Home", "Packages", "Tours", "About", "Contact"];

  const getHref = (item) => (item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`);

  const isActive = (path) => pathname === path;

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <>
      {/* ==================== DESKTOP & TABLET NAVBAR (UNCHANGED - Logo on Left) ==================== */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out hidden lg:block
          ${
            scrolled
              ? "top-0 w-full rounded-none shadow-2xl"
              : "top-8 w-[90%] max-w-7xl rounded-b-3xl shadow-xl"
          }
          ${!scrolled ? "glass-card backdrop-blur-lg border-b border-white/10" : ""}
          ${scrolled ? "bg-white/95 dark:bg-gray-900/95 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-900/80" : ""}
        `}
        aria-label="Main navigation"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20 lg:justify-start">
            {/* Desktop Logo - Left Aligned (Same as Original) */}
            <Link href="/" className="flex-shrink-0 relative">
              <div className="relative h-32 w-auto">
                {/* Light Logo */}
                <Image
                  src="/images/logo-light.png"
                  alt="Royal Travelers"
                  width={150}
                  height={128}
                  className={`h-full w-auto object-contain transition-opacity duration-500
                    ${scrolled || !isDark ? "opacity-100" : "opacity-0"}
                  `}
                  priority
                />
                {/* Dark Logo */}
                <Image
                  src="/images/logo-dark.png"
                  alt="Royal Travelers"
                  width={150}
                  height={128}
                  className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-500
                    ${!scrolled && isDark ? "opacity-100" : "opacity-0"}
                  `}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-10 ml-auto">
              {navItems.map((item) => (
                <motion.div key={item} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={getHref(item)}
                    className={`relative font-extrabold text-lg transition-colors
                      text-gray-900 dark:text-white
                      hover:text-primary-500
                      ${isActive(getHref(item)) ? "after:absolute after:bottom-[-10px] after:left-0 after:w-full after:h-1.5 after:bg-accent-500 after:rounded-full" : ""}
                    `}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}

              <RippleButton text="Book Now" href="/booking" />

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ThemeToggle />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ==================== MOBILE NAVBAR - Centered & Larger Logo ==================== */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`px-4 md:py-3 transition-all duration-500 ${
            scrolled  
              ? "bg-white/95 dark:bg-gray-900/95 shadow-lg"
              : "bg-transparent backdrop-blur-md"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Left: Theme Toggle */}
            <div className="flex items-center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ThemeToggle />
              </motion.div>
            </div>

            {/* Centered Larger Logo */}
            <Link href="/" className="flex-shrink-0 relative">
              <div className="relative h-24  md:h-28 w-auto"> {/* Larger on mobile */}
                {/* Light Logo */}
                <Image
                  src="/images/logo-light.png"
                  alt="Royal Travelers"
                  width={200}
                  height={110}
                  className={`h-full w-auto object-contain transition-opacity duration-500 drop-shadow-md
                    ${scrolled || !isDark ? "opacity-100" : "opacity-0"}
                  `}
                  priority
                />
                {/* Dark Logo */}
                <Image
                  src="/images/logo-dark.png"
                  alt="Royal Travelers"
                  width={200}
                  height={110}
                  className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-500 drop-shadow-md
                    ${!scrolled && isDark ? "opacity-100" : "opacity-0"}
                  `}
                  priority
                />
              </div>
            </Link>

            {/* Right: Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-black/20 transition"
            >
              <FaBars size={24} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe-area-inset-bottom">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-t border-white/20 dark:border-black/20">
          <div className="flex items-end justify-between px-3 py-1">
            <Link href="/contact" className={`flex flex-col items-center gap-1.5 flex-1 min-h-14 justify-center transition-colors ${isActive("/contact") ? "text-accent-500" : "text-gray-600 dark:text-gray-400"}`}>
              <FaPhoneAlt className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium leading-none">Contact</span>
            </Link>

            <Link href="/packages" className={`flex flex-col items-center gap-1.5 flex-1 min-h-14 justify-center transition-colors ${isActive("/packages") ? "text-accent-500" : "text-gray-600 dark:text-gray-400"}`}>
              <FaSuitcaseRolling className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium leading-none">Packages</span>
            </Link>

            <Link href="/" className={`flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all duration-200 ${isActive("/") ? "bg-accent-500 text-white" : "bg-primary-500 text-white"}`}>
              <FaHome className="w-7 h-7 sm:w-8 sm:h-8" />
            </Link>

            <Link href="/tours" className={`flex flex-col items-center gap-1.5 flex-1 min-h-14 justify-center transition-colors ${isActive("/tours") ? "text-accent-500" : "text-gray-600 dark:text-gray-400"}`}>
              <FaMapMarkedAlt className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium leading-none">Tours</span>
            </Link>

            <Link href="/booking" className={`flex flex-col items-center gap-1.5 flex-1 min-h-14 justify-center transition-colors ${isActive("/booking") ? "text-accent-500" : "text-gray-600 dark:text-gray-400"}`}>
              <FaCalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium leading-none">Book</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FaTimes size={28} className="text-gray-900 dark:text-white" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item}
                      href={getHref(item)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-5 py-4 rounded-xl text-lg font-semibold transition ${
                        isActive(getHref(item))
                          ? "bg-accent-500 text-white"
                          : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item}
                    </Link>
                  ))}

                  <div className="pt-6">
                    <RippleButton text="Book Now" href="/booking" mobile />
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Ripple Button (unchanged)
function RippleButton({ text, href, mobile = false }) {
  const buttonRef = useRef(null);

  const createRipple = (event) => {
    const button = buttonRef.current;
    if (!button) return;

    const ripple = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    ripple.classList.add("ripple");

    const existingRipple = button.getElementsByClassName("ripple")[0];
    if (existingRipple) existingRipple.remove();

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={mobile ? "block w-full" : "inline-block"}
    >
      <Link
        href={href}
        ref={buttonRef}
        onClick={createRipple}
        className={`
          relative overflow-hidden inline-flex items-center justify-center
          bg-gradient-to-r from-primary-500 to-accent-500 
          text-white font-bold px-8 py-4 rounded-full 
          shadow-lg hover:shadow-2xl transition-all duration-500
          group ${mobile ? "block w-full text-center text-xl py-5" : ""}
        `}
      >
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 translate-x-[-300%] group-hover:translate-x-[300%] transition-transform duration-1200" />
        </span>
        <span className="relative z-10">{text}</span>
      </Link>
    </motion.div>
  );
}