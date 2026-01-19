// app/(site)/booking/[slug]/page.js
import BookingHero from '@/components/booking/BookingHero';
import TourBookingForm from '@/components/booking/TourBookingForm';
import { Suspense } from 'react';

export default async function TourBookingPage({ params, searchParams }) {
  const { slug } = await params;
  const { date, slot, adults, children } = await searchParams;

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <BookingHero />
      <Suspense fallback={
        <div className="py-32 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking form...</p>
        </div>
      }>
        <TourBookingForm 
          tourSlug={slug} 
          bookingDetails={{ date, slot, adults: parseInt(adults) || 1, children: parseInt(children) || 0 }} 
        />
      </Suspense>
    </main>
  );
}