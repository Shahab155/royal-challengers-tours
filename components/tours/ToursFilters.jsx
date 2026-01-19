'use client';

import { useEffect, useState } from 'react';

function FilterPill({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-full
        text-sm md:text-base font-medium
        transition-all duration-200
        border
        ${active
          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-transparent shadow-md shadow-primary-500/30'
          : 'bg-[--color-surface]/70 text-[--color-text] border-[--color-border] hover:bg-[--color-surface]/90 active:bg-[--color-surface]/80'
        }
      `}
    >
      {label}
    </button>
  );
}

export default function ToursFilters({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories/tours')
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load tour categories:', err);
      });
  }, []);

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="
          glass-card 
          rounded-3xl 
          px-6 py-6 md:px-10 md:py-8 
          border border-[--color-border]
        ">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center justify-between">

            {/* Search Input */}
           <div className="w-full md:w-96 lg:w-[420px] relative group">
             <input
    type="text"
    id="tour-search"
    placeholder=" "
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="
      peer
      w-full px-5 py-4 rounded-xl

      bg-[var(--color-surface)]
      border border-[var(--color-border)]
      text-[var(--color-text)]
      placeholder-transparent

      outline-none
      transition-all duration-300

      focus:border-primary-500
      focus:ring-2 focus:ring-primary-500/30
    "
  />

  <label
    htmlFor="tour-search"
    className="
      absolute left-5 top-1/2 -translate-y-1/2
      text-sm text-[var(--color-text-secondary)]

      transition-all duration-300
      pointer-events-none

      peer-focus:top-2
      peer-focus:text-xs
      peer-focus:text-primary-500

      peer-not-placeholder-shown:top-2
      peer-not-placeholder-shown:text-xs
    "
  >
    Search tours (Burj Khalifa, yacht, desert…)
  </label>
  </div>

            {/* Filter Pills Container */}
            <div className="
              flex flex-wrap justify-center gap-3 md:gap-4
              px-5 py-4 rounded-2xl
              border border-[--color-border]
              bg-[--color-surface]/60
              backdrop-blur-md
            ">
              <FilterPill
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                label="All Tours"
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