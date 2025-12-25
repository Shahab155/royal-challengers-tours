'use client';
import { useState } from 'react';
import ToursHero from '@/components/tours/ToursHero';
import ToursFilters from '@/components/tours/ToursFilters';
import ToursList from '@/components/tours/ToursList';

// Sample tours data (expand with your real content)
const allTours = [
  {
    title: 'Burj Khalifa At The Top',
    slug: 'burj-khalifa-at-the-top',
    category: 'landmark',
    description: 'Skip-the-line access to levels 124 & 125 with panoramic views of Dubai.',
    duration: '1.5–2 hours',
    price: 'From AED 169',
    imageSrc: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0f/53/cf/7b.jpg',
    imageAlt: 'Burj Khalifa observation deck panoramic view',
  },
  {
    title: 'Sunset Yacht Cruise',
    slug: 'sunset-yacht-cruise',
    category: 'yacht',
    description: 'Private/shared luxury yacht cruise with dinner and views of Palm & Burj Al Arab.',
    duration: '2–3 hours',
    price: 'From AED 299',
    imageSrc: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/6f/71/83.jpg',
    imageAlt: 'Luxury yacht cruise Dubai Marina sunset',
  },
  {
    title: 'Desert Sunrise Experience',
    slug: 'desert-sunrise-experience',
    category: 'desert',
    description: 'Early morning camel ride, falcon show, breakfast in the desert.',
    duration: '4–5 hours',
    price: 'From AED 199',
    imageSrc: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/84/33/04.jpg',
    imageAlt: 'Dubai desert sunrise camel ride',
  },
  // Add more tours here...
];

export default function ToursPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTours = allTours.filter((tour) => {
    const matchesCategory = activeCategory === 'all' || tour.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <ToursHero />
      <ToursFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <ToursList filteredTours={filteredTours} />
    </main>
  );
}