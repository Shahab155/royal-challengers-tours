'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function ToursList({ filteredTours }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      gsap.utils.toArray('.tour-card'),
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%' },
      }
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-bg)]">
      <div ref={containerRef} className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredTours.map((tour) => (
              <div
                key={tour.slug}
                className="tour-card group relative overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.imageSrc}
                    alt={tour.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-2xl font-semibold font-heading text-[var(--color-text)] mb-3 group-hover:text-primary-500 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-6 flex-1 leading-relaxed">
                    {tour.description}
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">{tour.duration}</span>
                    <span className="text-2xl font-bold text-accent-500">{tour.price}</span>
                  </div>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="btn-primary w-full py-4 text-center text-lg font-semibold mt-auto rounded-xl inline-block"
                  >
                    Book This Tour
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-3xl font-semibold text-[var(--color-text)] mb-4">No tours found</h3>
            <p className="text-lg text-[var(--color-text-secondary)]">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </section>
  );
}