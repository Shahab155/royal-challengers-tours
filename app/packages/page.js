// app/packages/page.jsx
'use client';

import { useState } from 'react';
import PackagesHero from '@/components/packages/PackagesHero';
import PackagesFilters from '@/components/packages/PackagesFilters';
import PackagesList from '@/components/packages/PackagesList';

// ← Make sure this array is HERE and not empty
const allPackages = [
  {
      title: 'Evening Desert Safari',
      description: 'Dune bashing, camel ride, sandboarding, BBQ dinner & entertainment under the stars.',
      slug: 'evening-desert-safari',
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

export default function PackagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPackages = allPackages.filter((pkg) => {
    const matchesCategory = activeCategory === 'all' || pkg.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <PackagesHero />
      <PackagesFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <PackagesList filteredPackages={filteredPackages} />
    </main>
  );
}