// components/contact/ContactHero.jsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ContactHero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1548685913-fe6678babe8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=90"
          alt="Dubai skyline at night with Burj Khalifa lights"
          className="w-full h-full object-cover brightness-[0.55]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      <div className="relative z-10 max-w-5xl px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 tracking-tight">
          Get in Touch with 
          <br />
          <span className="text-accent-500">Royal Challengers</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
          We're here to craft your perfect Dubai luxury journey — let's start planning today
        </p>
      </div>
    </section>
  );
}