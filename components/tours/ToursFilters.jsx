'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function ToursFilters({
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
    { id: 'all', label: 'All Tours' },
    { id: 'landmark', label: 'Iconic Landmarks' },
    { id: 'desert', label: 'Desert Experiences' },
    { id: 'yacht', label: 'Yacht & Cruises' },
    { id: 'city', label: 'City Adventures' },
    { id: 'cultural', label: 'Cultural & Day Trips' },
  ];

  return (
    <div ref={containerRef} className="py-12 lg:py-16 bg-[var(--color-surface)]/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center justify-between">
          {/* Search */}
          <input
            type="text"
            placeholder="Search tours (Burj Khalifa, yacht, desert...)"
            className="w-full md:w-96 px-6 py-4 rounded-full border-[var(--color-border)] bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-primary-500/20'
                } border border-[var(--color-border)]`}
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