"use client";
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const items = [
    // ... your items array (unchanged)
    {
      category: 'desert',
      src: '/images/gallery/1.jpg',
      alt: 'Thrilling dune bashing in Dubai desert',
      title: 'Dune Bashing Thrill',
    },
    {
      category: 'desert',
      src: '/images/gallery/2.jpg',
      alt: 'Luxury overnight desert camping under stars',
      title: 'Starry Night Luxury Camp',
    },
    {
      category: 'city',
      src: '/images/gallery/3.jpg',
      alt: 'Iconic Burj Khalifa and Dubai skyline',
      title: 'Burj Khalifa Views',
    },
    {
      category: 'city',
      src: '/images/gallery/4.jpg',
      alt: 'Dubai city skyline at sunset with Burj Khalifa',
      title: 'Sunset City Skyline',
    },
    {
      category: 'cruise',
      src: '/images/gallery/5.jpg',
      alt: 'Luxury yacht cruise in Dubai Marina',
      title: 'Marina Yacht Experience',
    },
    {
      category: 'cruise',
      src: '/images/gallery/6.jpg',
      alt: 'Sunset luxury yacht tour Dubai',
      title: 'Golden Sunset Cruise',
    },
  ];

  const filteredItems = items.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
  );

  // Proper GSAP animation with scope and layout handling
  useGSAP(
    () => {
      const items = gsap.utils.toArray('.gallery-item');

      // Initial entrance animation (on mount)
      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            amount: 0.6,
            from: "start",
            ease: "power2.out",
          },
          ease: "power3.out",
        }
      );

      // On filter change - animate exiting and entering items smoothly
      if (activeFilter !== 'all') { // Skip on initial load
        // Fade out removed items
        gsap.to(items.filter((el) => !filteredItems.some(item => item.title === el.querySelector('p')?.textContent)), {
          opacity: 0,
          scale: 0.9,
          y: -30,
          duration: 0.4,
          stagger: 0.05,
        });

        // Animate in new/current items
        gsap.fromTo(
          items,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: {
              amount: 0.5,
              from: "start",
            },
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }
    },
    { scope: containerRef, dependencies: [activeFilter] } // Re-run on filter change
  );

  return (
    <section ref={containerRef} className="py-16 lg:py-24 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Iconic Dubai Tour Moments
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-4xl mx-auto">
            Filter by category to explore thrilling desert adventures, glittering city views, or luxurious cruises.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-8 py-3 ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('desert')}
            className={`px-8 py-3 ${activeFilter === 'desert' ? 'btn-primary' : 'btn-outline'}`}
          >
            Desert Adventures
          </button>
          <button
            onClick={() => setActiveFilter('city')}
            className={`px-8 py-3 ${activeFilter === 'city' ? 'btn-primary' : 'btn-outline'}`}
          >
            City Highlights
          </button>
          <button
            onClick={() => setActiveFilter('cruise')}
            className={`px-8 py-3 ${activeFilter === 'cruise' ? 'btn-primary' : 'btn-outline'}`}
          >
            Luxury Cruises
          </button>
        </div>

        {/* Gallery Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item, index) => (
            <div
              key={`${item.category}-${index}`} // Stable key based on content
              className="gallery-item relative overflow-hidden rounded-2xl shadow-lg group"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <p className="font-semibold text-xl text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}