"use client";
import { useState } from "react";
import TourSidebar from "@/components/tours/TourSidebar";
import TourAvailabilityModal from "@/components/tours/TourAvailabilityModal";

export default function TourSidebarWrapper({ tour, availability, slug }) {
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
    <>
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
    </>
  );
}