"use client";
import Image from "next/image";
import Link from "next/link";
import TourSidebar from "@/components/tours/TourSidebar";
import TourInfoSection from "@/components/tours/TourInfoSection";
import TourAvailabilityModal from "@/components/tours/TourAvailabilityModal";
import { useState } from "react";

export default function TourPageContent({ tour, availability, recentTours, slug }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleOpenModal = (selection) => {
    setSelectedSlot(selection);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  const handleContinueBooking = (slotDetails) => {
    // Redirect to booking page with all necessary parameters
    const url = `/booking/${slug}?date=${encodeURIComponent(slotDetails.date)}&slot=${slotDetails.id}&adults=${slotDetails.adults}&children=${slotDetails.children}`;
    window.location.href = url;
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* ================= HERO ================= */}
      <section className="relative h-[65vh] lg:h-[80vh]">
        <Image
          src={
            tour.image
              ? `/images/tours/${tour.image}`
              : "/images/placeholder.jpg"
          }
          alt={tour.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl text-white mb-4">
              {tour.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              {tour.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
          {/* MAIN - Tour Info Section (Server Component) - We'll render it as part of this client component */}
          <div className="lg:col-span-2 space-y-12">
            <TourInfoSection tourId={tour.id} tourDescription={tour.description} />
          </div>

          {/* SIDEBAR (Client Component) */}
          <div>
            <TourSidebar
              tour={tour}
              availability={availability}
              onOpenModal={handleOpenModal}
            />
            <TourAvailabilityModal
              open={modalOpen}
              onClose={handleCloseModal}
              selectedDate={selectedSlot?.date}
              tourSlug={slug}
              adults={selectedSlot?.adults || 1}
              children={selectedSlot?.children || 0}
              onContinue={handleContinueBooking}
            />
          </div>
        </div>
      </section>

      {/* ================= RECENT TOURS ================= */}
      {recentTours.length > 0 && (
        <section className="py-20 bg-[var(--color-surface)]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl mb-12">
              Recommended for you
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentTours.map((item) => (
                <div
                  key={item.slug}
                  className="glass-card overflow-hidden"
                >
                  <div className="relative h-52">
                    <Image
                      src={
                        item.image
                          ? `/images/tours/${item.image}`
                          : "/images/placeholder.jpg"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-3">
                      {item.short_description}
                    </p>

                    <div className="text-md font-extrabold">
                      Price:  
                      <span className="font-bold text-accent-500 text-sm ml-2">
                        AED {item.price}
                      </span>
                    </div>

                    <Link
                      href={`/tours/${item.slug}`}
                      className="btn-outline w-full text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}