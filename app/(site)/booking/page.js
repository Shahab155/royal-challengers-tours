// app/booking/page.jsx
import BookingHero from '@/components/booking/BookingHero';
import BookingForm from '@/components/booking/BookingForm';
import { Suspense } from 'react';

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <BookingHero />
      <Suspense fallback={
        <div className="py-32 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking form...</p>
        </div>
      }>
        <BookingForm />
      </Suspense>
    
    </main>
  );
}