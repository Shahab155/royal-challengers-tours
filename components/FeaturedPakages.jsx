'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';           // ← Add this import
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Reusable Package Card (using Link instead of <a>)
function PackageCard({ title, description, duration, price, imageSrc, imageAlt, link }) {
  return (
    <div className="package-card group relative overflow-hidden rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
      {/* Image wrapper with zoom effect */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhQJ/wlseKgAAAABJRU5ErkJggg=="
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-2xl font-semibold font-heading text-white mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-base text-white/80 mb-6 flex-1 leading-relaxed">
          {description}
        </p>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-white/70">{duration}</span>
          <span className="text-2xl font-bold text-[var(--color-accent-500)]">
            {price}
          </span>
        </div>

        {/* Changed from <a> to Next.js <Link> */}
        <Link
          href={link}
          className="btn-primary w-full py-4 text-center text-lg font-semibold mt-auto rounded-xl inline-block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedPackages() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const moreRef = useRef(null);

  useGSAP(() => {
    // Title
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      }
    );

    // Cards stagger
    gsap.fromTo(
      gsap.utils.toArray('.package-card'),
      { opacity: 0, y: 70, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      }
    );

    // More button
    gsap.fromTo(
      moreRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: moreRef.current,
          start: 'top 90%',
        },
      }
    );
  }, { scope: containerRef });

  const packages = [
    {
      title: 'Evening Desert Safari',
      description: 'Dune bashing, camel ride, sandboarding, BBQ dinner & entertainment under the stars.',
      duration: '6–7 hours',
      price: 'AED 250',
      imageSrc: 'https://www.dsktravelsdubai.com/wp-content/uploads/2024/12/desert-safari.jpg',
      imageAlt: 'Luxury Evening Desert Safari Dubai at sunset',
      link: '/packages/evening-desert-safari',
    },
    {
      title: 'Overnight Desert Safari',
      description: 'Evening activities + luxury glamping, stargazing, sunrise breakfast.',
      duration: 'Overnight',
      price: 'AED 799',
      imageSrc: 'https://dubaidesertsafarie.com/wp-content/uploads/2024/11/20200326-tent.webp',
      imageAlt: 'Luxury overnight desert camping tent Dubai',
      link: '/packages/overnight-desert-safari',
    },
    {
      title: 'Dubai City Highlights',
      description: 'Burj Khalifa, Dubai Mall, Palm Jumeirah, Old Dubai & modern skyline.',
      duration: 'Full Day',
      price: 'AED 350',
      imageSrc: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0b/97/98/7a.jpg',
      imageAlt: 'Dubai city tour with Burj Khalifa and modern skyline',
      link: '/packages/dubai-city-highlights',
    },
    {
      title: 'Marina Yacht Cruise',
      description: 'Sunset cruise past Palm Jumeirah, Burj Al Arab & Atlantis with dinner.',
      duration: '3–4 hours',
      price: 'AED 600',
      imageSrc: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/6f/71/83.jpg',
      imageAlt: 'Luxury yacht cruise Dubai Marina sunset',
      link: '/packages/marina-yacht-cruise',
    },
    {
      title: 'Abu Dhabi Explorer',
      description: 'Sheikh Zayed Grand Mosque, Louvre Abu Dhabi & cultural highlights.',
      duration: 'Full Day',
      price: 'AED 450',
      imageSrc: 'https://visitabudhabi.ae/-/media/project/vad/what-to-see/national-attractions/sheikh-zayed-grand-mosque/new-rebrand-images/article-images/ad_dct_phoenix_30_grand-mosque_chinese_family_7975-copy-2-edit-2.jpg',
      imageAlt: 'Sheikh Zayed Grand Mosque Abu Dhabi day trip',
      link: '/packages/abu-dhabi-explorer',
    },
    {
      title: '4-Day Ultimate Dubai',
      description: 'Best of city, desert safari, yacht cruise & more in one unforgettable package.',
      duration: '4 Days',
      price: 'AED 2,999',
      imageSrc: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0b/87/cc/bc.jpg',
      imageAlt: 'Multi-day luxury Dubai tour collage',
      link: '/packages/4-day-ultimate-dubai',
    },
  ];

  return (
    <section
      ref={containerRef}
      id="packages"
      className="py-20 lg:py-28 bg-gradient-to-br from-[var(--color-primary-900)] via-[var(--color-primary-700)] to-[var(--color-accent-900)]/30"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 tracking-tight">
            Most Popular Dubai Packages
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Handpicked adventures that showcase the very best of Dubai — from thrilling deserts to iconic cityscapes.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {packages.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </div>

        <div ref={moreRef} className="text-center mt-16 lg:mt-20">
          <Link
            href="/packages" // ← You can change to your all-packages page route
            className="btn-outline text-lg px-12 py-5 font-semibold rounded-xl border-2 dark:border-[var(--color-accent-500)] dark:text-[var(--color-accent-500)] hover:bg-[var(--color-accent-500)] hover:text-white transition-all duration-300 text-white border-white inline-block"
          >
            Explore All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}