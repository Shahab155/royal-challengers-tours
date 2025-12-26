// app/booking/page.jsx
import BookingHero from '@/components/booking/BookingHero';
import BookingForm from '@/components/booking/BookingForm';

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <BookingHero />
      <BookingForm />
    </main>
  );
}