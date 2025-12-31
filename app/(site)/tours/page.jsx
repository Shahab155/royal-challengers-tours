'use client';

import { useEffect, useState, useMemo } from 'react';
import ToursHero from '@/components/tours/ToursHero';
import ToursFilters from '@/components/tours/ToursFilters';
import ToursList from '@/components/tours/ToursList';

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  /* ================= FETCH TOURS ================= */
  useEffect(() => {
    fetch('/api/tours')
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((tour) => ({
          // Ensure title is always a string
          title: tour.title ?? 'Untitled Tour',

          slug: tour.slug,

          // MUST MATCH filter IDs in ToursFilters
          category: tour.category_slug || 'other',

          // Ensure description is always a string (empty if missing)
          description: tour.short_description ?? '',

          duration: tour.duration_days ? `${tour.duration_days} hours` : 'Duration TBD',

          price: tour.price ? `AED ${tour.price}` : 'Price on request',

          imageSrc: tour.image
            ? `/images/tours/${tour.image}`
            : '/images/placeholder.jpg',

          imageAlt: tour.title ?? 'Tour image',
        }));

        setTours(normalized);
      })
      .catch((err) => {
        console.error('Failed to load tours', err);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'all' || tour.category === activeCategory;

      // Search filter - now safe because title/description are guaranteed strings
      const matchesSearch =
        !searchQuery ||
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [tours, searchQuery, activeCategory]);

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <ToursHero />

      <ToursFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {loading ? (
        <div className="py-24 text-center text-[var(--color-text-secondary)]">
          Loading tours...
        </div>
      ) : (
        <ToursList filteredTours={filteredTours} />
      )}
    </main>
  );
}