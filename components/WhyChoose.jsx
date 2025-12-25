'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "24/7 Support",
    desc: "Our team is available around the clock via phone, WhatsApp, or email – before, during, and after your tour.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    )
  },
  {
    title: "Safe Travel",
    desc: "Licensed vehicles, insured activities, experienced drivers, and strict safety protocols ensure your peace of mind.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    )
  },
  {
    title: "Best Prices",
    desc: "Direct booking with no hidden fees – we guarantee competitive rates and excellent value for every tour.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    )
  },
  {
    title: "Experienced Guides",
    desc: "Our certified local experts ensure informative, safe, and personalized tours full of authentic insights.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    )
  }
];

export default function WhyChooseUs() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useGSAP(() => {
    // 1. Header Animation (Fade Up)
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
      }
    );

    // 2. Cards Stagger Animation
    const cards = gsap.utils.toArray('.glass-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: 'top 80%',
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative py-20 overflow-hidden flex items-center justify-center min-h-screen"
    >
      
      {/* === BACKGROUND LAYERS === */}
      
      {/* 1. Full Screen Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/20584984/pexels-photo-20584984/free-photo-of-toyota-land-cruiser-on-desert.jpeg"
          alt="Luxury Desert Safari Land Cruiser"
          fill
          className="object-cover object-center w-full h-full"
          priority
        />
      </div>

      {/* 2. Dark Overlay (Crucial for text readability) */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* 3. Gradient Accent (Subtle shine from top left) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900/30 to-transparent z-10 pointer-events-none"></div>


      {/* === CONTENT === */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight">
            The Royal Challengers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">
              Difference
            </span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            We don't just offer tours; we craft experiences. From the moment you book until you return home, we are your trusted partner in adventure.
          </p>
        </div>

        {/* Feature Cards Grid (Glassmorphism) */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card group relative p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-6">
                
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 flex-shrink-0 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}