// components/packages/PackagesHero.jsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function PackagesHero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.3, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-[55vh] md:h-[65vh] lg:h-[70vh] flex items-center justify-center text-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1548685913-fe6678babe8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=90"
          alt="Dubai skyline at golden hour"
          className="w-full h-full object-cover brightness-[0.65]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

      <div className="relative z-10 max-w-5xl px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 tracking-tight drop-shadow-lg">
          Explore All Our <span className="text-accent-500">Luxury Packages</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light">
          From thrilling desert adventures to elegant yacht cruises and iconic city experiences — find your perfect Dubai journey
        </p>
      </div>
    </section>
  );
}