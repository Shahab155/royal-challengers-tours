'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

export default function AboutHero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.6,
        ease: 'power3.out',
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
              <Image
                src="/images/hero-section.png"
                alt="Iconic Dubai skyline at golden hour"
                width={800}
                height={500}
                className="w-full h-full object-cover brightness-[0.65]"
              />
            </div>

      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 text-center text-white px-6 max-w-5xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
          Royal Challengers <br />
           <span className="text-accent-500">Travelers</span>
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-light max-w-4xl mx-auto">
          Crafting Unforgettable Luxury Journeys in Dubai
        </p>
      </div>
    </section>
  );
}