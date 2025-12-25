// components/packages/PackagesFilters.jsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function PackagesFilters({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
      }
    );
  }, { scope: containerRef });

  const categories = [
    { id: 'all', label: 'All Packages' },
    { id: 'desert', label: 'Desert Adventures' },
    { id: 'city', label: 'City Tours' },
    { id: 'cruise', label: 'Yacht Cruises' },
    { id: 'daytrip', label: 'Day Trips' },
    { id: 'multi-day', label: 'Multi-Day Experiences' },
  ];

  return (
    <div ref={containerRef} className="py-12 lg:py-16 bg-[var(--color-surface)]/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center justify-between">
          {/* Search Input */}
          <div className="w-full md:w-96 lg:w-[420px]">
            <input
              type="text"
              placeholder="Search packages (safari, yacht, burj, desert...)"
              className="w-full px-6 py-4 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 text-white placeholder:text-white/50 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30 outline-none transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 shadow-sm ${
                  activeCategory === cat.id
                    ? 'bg-accent-500 text-white shadow-accent-500/30'
                    : 'bg-white dark:bg-black/20 text-white/80  '
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}