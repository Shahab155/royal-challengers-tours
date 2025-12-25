// components/packages/PackagesList.jsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function PackagesList({ filteredPackages }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      gsap.utils.toArray('.package-card'),
      { opacity: 0, y: 60, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%' },
      }
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-bg)]">
      <div ref={containerRef} className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.slug}
                className=" group relative overflow-hidden rounded-2xl  dark:bg-black/20 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.imageSrc}
                    alt={pkg.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-2xl font-semibold font-heading text-white mb-3 tracking-tight group-hover:text-accent-400 transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-base text-white/80 mb-6 flex-1 leading-relaxed">
                    {pkg.description}
                  </p>
                  <div className="flex justify-between items-center mb-6 text-white/90">
                    <span className="text-sm font-medium">{pkg.duration}</span>
                    <span className="text-2xl font-bold text-accent-500">{pkg.price}</span>
                  </div>
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="btn-primary w-full py-4 text-center text-lg font-semibold mt-auto rounded-xl inline-block transform group-hover:scale-105 transition-transform"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-3xl font-semibold text-white/80 mb-4">No packages found</h3>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Try adjusting your search or filter selection
            </p>
          </div>
        )}
      </div>
    </section>
  );
}