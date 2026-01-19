import Image from "next/image";
import Link from "next/link";
import TourInfoSection from "@/components/tours/TourInfoSection";
import TourPageContent from './TourPageContent';

/* ================= FETCH SINGLE TOUR ================= */
async function getTour(slug) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/tours/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

/* ================= FETCH AVAILABILITY ================= */
async function getAvailability(slug) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/tours/${slug}/availability`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

/* ================= FETCH RECENT TOURS ================= */
async function getRecentTours(currentSlug) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/tours`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();

  return Array.isArray(data)
    ? data.filter((t) => t.slug !== currentSlug).slice(0, 3)
    : [];
}

/* ================= PAGE ================= */
export default async function TourDetailPage({ params }) {
  const { slug } = await params;

  const tour = await getTour(slug);
  const availability = await getAvailability(slug);
  const recentTours = await getRecentTours(slug);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[var(--color-text-secondary)]">
          Tour not found
        </p>
      </div>
    );
  }

  return (
    <TourPageContent
      tour={tour}
      availability={availability}
      recentTours={recentTours}
      slug={slug}
    />
  );
}