"use client";
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef(null);
  const indicatorRef = useRef(null);

  useGSAP(() => {
    // Fade in the hero section
    gsap.from(heroRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
    });

    // Animate scroll indicator bounce
    gsap.to(indicatorRef.current, {
      y: 10,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, {});

  return (
    <section ref={heroRef} className="relative h-screen min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Desktop Video (hidden on mobile) */}
      <video
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero-fallback.jpg"
      >
        <source src="/hero-desktop.mp4" type="video/mp4" />
        {/* Optional: add WebM version if you have one */}
        {/* <source src="/assets/hero-desktop.webm" type="video/webm" /> */}
        Your browser does not support the video tag.
      </video>

      {/* Mobile Video (visible only on mobile) */}
      <video
        className="absolute inset-0 w-full h-full object-cover md:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero-fallback.jpg"
      >
        <source src="/hero-mobile.mp4" type="video/mp4" />
        {/* Optional: add WebM version if you have one */}
        {/* <source src="/assets/hero-mobile.webm" type="video/webm" /> */}
        Your browser does not support the video tag.
      </video>

      {/* Fallback Static Image (for reduced motion or if videos fail) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-fallback.jpg')" }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      {/* Scroll Down Indicator */}
      <div ref={indicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}