"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { FiClock, FiUser } from "react-icons/fi";

export default function TourAvailabilityModal({
  open,
  onClose,
  selectedDate,
  tourSlug,
  adults = 1,
  children = 0,
}) {
  const router = useRouter();

  /* ================= STATE ================= */
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [price, setPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH AVAILABILITY ================= */
  useEffect(() => {
    if (!open || !tourSlug || !selectedDate) return;

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setSelectedSlot(null);
        setError("");

        const res = await fetch(
          `/api/tours/${tourSlug}/availability?date=${selectedDate}&adults=${adults}&children=${children}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        setSlots(data.slots || []);
        setPrice(data.price || null);
        setOriginalPrice(data.original_price || null);
        setDuration(data.duration || null);
      } catch (err) {
        console.error("Availability fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [open, tourSlug, selectedDate, adults, children]);

  /* ================= CALCULATE REFUND TIME ================= */
  const refundTime = useMemo(() => {
    if (!slots.length || !selectedDate) return null;

    const firstSlot = slots[0];
    const rawTime =
      firstSlot.start_time || firstSlot.time_slot;

    if (!rawTime) return null;

    // Normalize "08:00:00" or "08:00 AM"
    const clean = rawTime.replace(/ AM| PM/i, "");
    const [hours, minutes] = clean.split(":").map(Number);

    const date = new Date(selectedDate);
    date.setHours(hours);
    date.setMinutes(minutes - 30);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [slots, selectedDate]);

  /* ================= EARLY EXIT ================= */
  if (!open) return null;

  /* ================= BOOK ================= */
  const handleBooking = () => {
    if (!selectedSlot) {
      setError("Please select a time slot to proceed.");
      return;
    }

    router.push(
      `/booking/${tourSlug}?date=${selectedDate}&slot=${selectedSlot.id}&adults=${adults}&children=${children}`
    );
  };

  /* ================= HANDLE SLOT SELECTION ================= */
  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setError("");
  };

  /* ================= FORMAT DATE ================= */
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* ================= RENDER ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-[var(--color-bg)] rounded-2xl w-full max-w-2xl border border-[var(--color-border)] overflow-hidden shadow-2xl transform transition-all duration-300 ease-in-out scale-100">

        {/* ================= HEADER ================= */}
        <div className="p-6 border-b border-[var(--color-border)] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <FaTimes />
          </button>

          <h2 className="text-xl font-semibold">
            Tour Availability
          </h2>

          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <FiClock className="text-[var(--color-text-secondary)]" />
              <span>
                {duration ? `${duration} mins` : "—"} duration
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FiUser className="text-[var(--color-text-secondary)]" />
              <span>
                {adults} Adult{adults > 1 ? "s" : ""}
                {children > 0 &&
                  ` • ${children} Child${children > 1 ? "ren" : ""}`}
              </span>
            </div>
          </div>
        </div>

        {/* ================= TIME SLOTS ================= */}
        <div className="p-6">
          <p className="font-semibold mb-1">
            Select a starting time
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {formattedDate}
          </p>

          {loading ? (
            <div className="py-10 text-center text-sm flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <span className="ml-2">Loading slots…</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="py-10 text-center text-lg text-red-700  font-bold bg-red-100 rounded-lg p-4">
              No slots available for this date. Please select another date.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSelectSlot(slot)}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold border transition-all duration-200
                    ${
                      selectedSlot?.id === slot.id
                        ? "bg-primary-500 text-white border-primary-500 shadow-md"
                        : "border-[var(--color-border)] hover:border-primary-500 hover:shadow-sm"
                    }`}
                >
                  {slot.time_slot || slot.start_time}
                </button>
              ))}
            </div>
          )}

        

          {/* ================= REFUND POLICY ================= */}
          {refundTime && (
            <div className="flex items-center gap-2 mt-6 text-sm text-green-600">
              <span className="font-semibold">✓</span>
              <span>
                Cancel before <strong>{refundTime}</strong>{" "}
                for a full refund
              </span>
            </div>
          )}
        </div>
          {error && (
            <p className="text-red-500 text-md text-center font-semibold mt-4">{error}</p>
          )}

        {/* ================= FOOTER ================= */}
        <div className="bg-[var(--color-surface)] p-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {price && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-600">
                  AED {price}
                </span>

                {originalPrice && (
                  <>
                    <span className="line-through text-sm text-[var(--color-text-secondary)]">
                      AED {originalPrice}
                    </span>
                    <span className="text-sm text-red-600">
                      -
                      {Math.round(
                        ((originalPrice - price) /
                          originalPrice) *
                          100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
            )}

            <p className="text-sm text-[var(--color-text-secondary)]">
              {adults} Adult{adults > 1 ? "s" : ""}
              {children > 0 &&
                ` • ${children} Child${children > 1 ? "ren" : ""}`}{" "}
              • All taxes included
            </p>
          </div>

          <button
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBooking}
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}