'use client';

import { useRef, useEffect, useState } from 'react';
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
  const [categories, setCategories] = useState([]);

  /* ================= GSAP ================= */
  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      }
    );
  }, { scope: containerRef });

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    fetch('/api/categories/packages')
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  return (
    <div ref={containerRef} className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Outer glass container */}
        <div className="glass-card rounded-3xl px-6 py-6 md:px-10 md:py-8 border border-[var(--color-border)]">

          <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center justify-between">

            {/* ================= SEARCH ================= */}
            <div className="w-full md:w-96 lg:w-[420px]">
              <input
                type="text"
                placeholder="Search experiences"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full px-6 py-4 rounded-2xl
                  bg-white/70 dark:bg-black/30
                  border border-[var(--color-border)]
                  text-[var(--color-text)]
                  placeholder:text-[var(--color-text-secondary)]
                  outline-none transition-all
                  focus:border-primary-500
                  focus:ring-2 focus:ring-primary-500/20
                "
              />
            </div>

            {/* ================= FILTER GROUP ================= */}
            
            
            <div
              className="
                flex flex-wrap justify-center gap-3 md:gap-4
                px-4 py-3 rounded-2xl
                border border-[var(--color-border)]
                bg-white/60 dark:bg-black/20
                backdrop-blur-md
              "
            >
              <FilterPill
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                label="All Packages"
              />
                 
              {categories.map((cat) => (
                <FilterPill
                  key={cat.id}
                  active={activeCategory === cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  label={cat.name}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FILTER PILL ================= */

function FilterPill({ active, label, onClick }) {
  return (
    <>
    
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-full
        text-sm md:text-base font-medium
        transition-all duration-300
        border
        ${
          active
            ? `
              bg-gradient-to-r from-primary-500 to-accent-500
              text-white
              border-transparent
              shadow-md shadow-primary-500/25
            `
            : `
              bg-white/80 dark:bg-transparent
              text-[var(--color-text)]
              border-[var(--color-border)]
              hover:bg-white dark:hover:bg-white/10
            `
        }
      `}
      >
      {label}
    </button>
      </>
  );
}
