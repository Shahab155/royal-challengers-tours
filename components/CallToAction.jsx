// components/CallToAction.jsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      contentRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    tl.fromTo(
      buttonRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.3)' },
      '-=0.6'
    );

    // Subtle background gradient animation
    gsap.to(sectionRef.current, {
      backgroundPosition: '100% 100%',
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0822C0 0%, #071cad 50%, #040d60 100%)',
        backgroundSize: '200% 200%',
      }}
    >
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div ref={contentRef}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 tracking-tight">
            Your Dubai Luxury Adventure
            <br className="hidden sm:block" />
           Awaits You
          </h2>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-10 lg:mb-12 leading-relaxed">
            Let our expert team craft your perfect journey — from private desert evenings under the stars 
            to sunset yacht cruises and iconic Burj Khalifa experiences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            ref={buttonRef}
            href="/booking"
            className="group relative rounded-2xl inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white bg-accent-500 hover:bg-accent-600 overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-accent-500/40 transform hover:-translate-y-1.5"
          >
            <span className="relative z-10">Start Planning Your Journey</span>
            <span className="absolute inset-0 bg-white/15 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center px-10 py-5 text-lg font-semibold text-white border-2 border-white/40 hover:border-white/70 rounded-2xl transition-all duration-300 hover:bg-white/10"
          >
            Talk to an Expert →
          </Link>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-accent-400 text-xl">★</span> 5.0 on TripAdvisor
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-400 text-xl">✓</span> 100% Secure Booking
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-400 text-xl">24/7</span> Personal Support
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl opacity-40" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl opacity-30" />
    </section>
  );
}