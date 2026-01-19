"use client";

import { useState, useEffect } from "react";
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

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Tours", href: "/tours" },
    { name: "Packages", href: "/packages" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path) => pathname === path;

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <>
      {/* ==================== DESKTOP & TABLET NAVBAR ==================== */}
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
        <div className="mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Left */}
            <Link href="/" className="flex-shrink-0 relative">
              <div className="relative h-32 w-auto">
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

            {/* Centered Navigation */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-12">
              {navItems.map((item) => (
                <motion.div key={item.name} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item.href}
                    className={`relative font-extrabold text-lg transition-colors
                      text-gray-900 dark:text-white
                      hover:text-primary-500
                      ${isActive(item.href) ? "after:absolute after:bottom-[-10px] after:left-0 after:w-full after:h-1.5 after:bg-accent-500 after:rounded-full" : ""}
                    `}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Theme Toggle - Right */}
            <div className="flex items-center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ThemeToggle />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

    
      {/* ==================== MOBILE TOP BAR – ONLY LOGO ==================== */}
<div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className={`px-4 py-3 transition-all duration-500 flex justify-center items-center
      ${scrolled  
        ? "bg-white/95 dark:bg-gray-900/95 shadow-lg"
        : "bg-transparent backdrop-blur-md"
      }`}
  >
    <Link href="/" className="flex-shrink-0 relative">
      <div className="relative h-20 w-auto"> {/* slightly smaller than before for better balance */}
        <Image
          src="/images/logo-light.png"
          alt="Royal Travelers"
          width={180}
          height={100}
          className={`h-full w-auto object-contain transition-opacity duration-500 drop-shadow-md
            ${scrolled || !isDark ? "opacity-100" : "opacity-0"}
          `}
          priority
        />
        <Image
          src="/images/logo-dark.png"
          alt="Royal Travelers"
          width={180}
          height={100}
          className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-500 drop-shadow-md
            ${!scrolled && isDark ? "opacity-100" : "opacity-0"}
          `}
          priority
        />
      </div>
    </Link>
  </motion.div>
</div>

{/* ==================== MOBILE BOTTOM NAV – 5 ITEMS ==================== */}
<div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe-area-inset-bottom">
  <div className="bg-white/92 dark:bg-gray-900/92 backdrop-blur-xl shadow-2xl border-t border-white/20 dark:border-black/20">
    <div className="flex items-center justify-between px-3 py-2">
      
      {/* Contact */}
      <Link 
        href="/contact" 
        className={`flex flex-col items-center gap-1 flex-1 transition-colors
          ${isActive("/contact") ? "text-accent-500" : "text-gray-600 dark:text-gray-500"}`}
      >
        <FaPhoneAlt className="w-6 h-6" />
        <span className="text-[10px] font-medium">Contact</span>
      </Link>

      {/* About */}
      <Link 
        href="/about" 
        className={`flex flex-col items-center gap-1 flex-1 transition-colors
          ${isActive("/about") ? "text-accent-500" : "text-gray-600 dark:text-gray-500"}`}
      >
        <FaSuitcaseRolling className="w-6 h-6" /> {/* you can change icon if you want */}
        <span className="text-[10px] font-medium">About</span>
      </Link>

      {/* Home - Big Round Button */}
      <Link 
        href="/" 
        className={`flex flex-col items-center justify-center w-16 h-16 -mt-8 rounded-full shadow-2xl transition-all duration-200
          ${isActive("/") ? "bg-accent-500 text-white" : "bg-primary-500 text-white"}`}
      >
        <FaHome className="w-8 h-8" />
      </Link>

      {/* Tours */}
      <Link 
        href="/tours" 
        className={`flex flex-col items-center gap-1 flex-1 transition-colors
          ${isActive("/tours") ? "text-accent-500" : "text-gray-600 dark:text-gray-500"}`}
      >
        <FaMapMarkedAlt className="w-6 h-6" />
        <span className="text-[10px] font-medium">Tours</span>
      </Link>

      {/* Menu Button (opens slide menu) */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className={`flex flex-col items-center gap-1 flex-1 transition-colors
          ${mobileMenuOpen ? "text-accent-500" : "text-gray-600 dark:text-gray-500"}`}
      >
        <FaBars className="w-6 h-6" />
        <span className="text-[10px] font-medium">Menu</span>

      </button>

    </div>
  </div>
</div>

      {/* Mobile Slide-In Menu – Book button also removed */}
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
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-5 py-4 rounded-xl text-lg font-semibold transition ${
                        isActive(item.href)
                          ? "bg-accent-500 text-white"
                          : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="rounded-md bg-accent-500 flex justify-center py-2 w-full mx-auto">
                  <ThemeToggle/>
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