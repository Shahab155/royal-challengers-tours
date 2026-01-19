"use client";

import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FaCalendarAlt, FaUsers, FaPlus, FaMinus } from "react-icons/fa";
import { z } from "zod";

export default function TourSidebar({ tour, availability, onOpenModal }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
  const [error, setError] = useState("");

  /* ----------------------------------------------------
     DATE HANDLING
  ---------------------------------------------------- */

  const dateString = selectedDate ? selectedDate.toLocaleDateString("en-CA") : "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rangeStart = availability?.range?.start_date
    ? new Date(availability.range.start_date)
    : null;

  const rangeEnd = availability?.range?.end_date
    ? new Date(availability.range.end_date)
    : null;

  const minDate = rangeStart && today > rangeStart ? today : rangeStart;
  const maxDate = rangeEnd;

  const hasAvailabilityRange = Boolean(minDate && maxDate);

  /* ----------------------------------------------------
     TRAVELERS
  ---------------------------------------------------- */

  const incrementTraveler = (type) =>
    setTravelers((prev) => ({ ...prev, [type]: prev[type] + 1 }));

  const decrementTraveler = (type) =>
    setTravelers((prev) => ({
      ...prev,
      [type]: type === "adults" ? Math.max(1, prev[type] - 1) : Math.max(0, prev[type] - 1),
    }));

  /* ----------------------------------------------------
     ZOD SCHEMA
  ---------------------------------------------------- */

  const availabilitySchema = z.object({
    date: z.date({ required_error: "Please select a travel date" }),
  });

  const handleCheckAvailability = () => {
    setError("");
    try {
      availabilitySchema.parse({ date: selectedDate });

      onOpenModal({
        date: dateString,
        adults: travelers.adults,
        children: travelers.children,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  /* ----------------------------------------------------
     DISPLAY HELPERS
  ---------------------------------------------------- */

  const formatDisplayDate = (date) => {
    if (!date) return "Select a date";
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const CustomInput = forwardRef(({ onClick }, ref) => (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      className="
        w-full px-4 py-3.5 rounded-lg
        bg-[var(--color-surface)] border border-[var(--color-border)]
        text-left text-[var(--color-text)]
        transition-all flex items-center justify-between
        hover:border-accent-500
        focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30
        shadow-sm
      "
    >
      <span className={selectedDate ? "font-medium" : "text-[var(--color-text-secondary)]"}>
        {formatDisplayDate(selectedDate)}
      </span>
      <FaCalendarAlt className="text-accent-500" />
    </button>
  ));

  CustomInput.displayName = "CustomDateInput";

  /* ----------------------------------------------------
     RENDER
  ---------------------------------------------------- */

  return (
    <div className="glass-card p-6 md:p-8 sticky top-10 space-y-7 rounded-2xl shadow-xl">
      {/* Header Info */}
      <div className="space-y-4 pb-5 border-b border-[var(--color-border)]">
        
      
        <div className="flex justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">Category</span>
          <span className="font-semibold">{tour.category_name || "—"}</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-center">
        <p className="text-sm text-[var(--color-text-secondary)] mb-1">From</p>
        <div className="text-4xl md:text-5xl font-bold text-accent-500">
          AED {tour.price?.toLocaleString() || "—"}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">per person</p>
      </div>

      {/* Travelers */}
      <div className="space-y-5">
        <TravelerRow label="Adults" subtitle="Ages 13+" value={travelers.adults} onMinus={() => decrementTraveler("adults")} onPlus={() => incrementTraveler("adults")} minDisabled={travelers.adults <= 1} />
        <TravelerRow label="Children" subtitle="Ages 2–12" value={travelers.children} onMinus={() => decrementTraveler("children")} onPlus={() => incrementTraveler("children")} minDisabled={travelers.children <= 0} />
      </div>

      {/* Date Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <FaCalendarAlt className="text-accent-500" />
          Select Date
        </label>

        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          minDate={minDate}
          maxDate={maxDate}
          customInput={<CustomInput />}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          showPopperArrow={false}
          popperClassName="glass-card shadow-2xl border border-[var(--color-border)]"
          calendarClassName="border-none"
          shouldCloseOnSelect
        />

        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>

      {/* Availability Range */}
      {hasAvailabilityRange && (
        <div className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface)]/60 p-3 rounded-lg border border-[var(--color-border)]">
          Available from{" "}
          <strong>
            {minDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </strong>{" "}
          to{" "}
          <strong>
            {maxDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </strong>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleCheckAvailability}
        className="btn-primary w-full py-4 flex items-center justify-center gap-2"
      >
        <FaUsers size={18} /> Check Availability
      </button>
    </div>
  );
}

/* ----------------------------------------------------
   TRAVELER ROW COMPONENT
---------------------------------------------------- */
function TravelerRow({ label, subtitle, value, onMinus, onPlus, minDisabled }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2 bg-[var(--color-surface)] rounded-full px-2 py-1.5 border border-[var(--color-border)]">
        <button
          onClick={onMinus}
          disabled={minDisabled}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] disabled:opacity-40"
        >
          <FaMinus size={14} />
        </button>

        <span className="w-10 text-center font-medium text-lg">{value}</span>

        <button
          onClick={onPlus}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
        >
          <FaPlus size={14} />
        </button>
      </div>
    </div>
  );
}
