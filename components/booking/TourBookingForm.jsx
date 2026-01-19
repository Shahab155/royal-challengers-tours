"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { z } from "zod";
import { FaUser, FaEnvelope, FaPhone, FaCreditCard, FaMoneyBillWave, FaUniversity, FaExclamationCircle, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { FaTicketAlt, FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";
gsap.registerPlugin(ScrollTrigger);

/* ================= VALIDATION ================= */
const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Phone number is too short"),
  bookingType: z.string().min(1),
  itemTitle: z.string().min(1),
  travelers: z.coerce.number().min(1),
  travelDate: z.string().optional().nullable(),
  paymentMethod: z.enum(["cash", "card", "bank_transfer"], {
    errorMap: () => ({ message: "Please select a payment method" }),
  }),
});

export default function TourBookingForm({ tourSlug, bookingDetails }) {
  const formRef = useRef(null);
  const containerRef = useRef(null);

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDate: bookingDetails.date || "",
    travelers:
      (bookingDetails.adults || 1) +
      (bookingDetails.children || 0),
    paymentMethod: "cash",
  });

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  /* ================= FETCH TOUR ================= */
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/tours/${tourSlug}`);
        if (res.ok) {
          const data = await res.json();
          setTour(data);
        }
      } catch (err) {
        console.error("Failed to fetch tour details", err);
      }
    };

    if (tourSlug) fetchTour();
  }, [tourSlug]);

  /* ================= ANIMATION ================= */
  useGSAP(
    () => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
          },
        }
      );

      // Staggered animation for form fields
      gsap.from(".form-field", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: containerRef }
  );

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const payload = {
      bookingType: "tour",
      itemTitle: tour?.title || "",
      itemId: tour?.id,
      tourSlug,
      slotId: bookingDetails.slot,
      date: bookingDetails.date,
      adults: bookingDetails.adults,
      children: bookingDetails.children,
      ...formData,
      travelers: Number(formData.travelers) || 1,
    };

    const validation = bookingSchema.safeParse(payload);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          payment_method: formData.paymentMethod,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit booking");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        travelDate: bookingDetails.date || "",
        travelers:
          (bookingDetails.adults || 1) +
          (bookingDetails.children || 0),
        paymentMethod: "cash",
      });
    } catch (err) {
      setErrors({
        submit:
          err.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  /* ================= LOADER ================= */
  if (!tour) {
    return (
      <div className="py-32 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">
          Loading tour details...
        </p>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-5">
        <div
          ref={formRef}
          className="bg-[var(--color-bg)] rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">
              Book Your Dubai Experience
            </h2>
            <p className="opacity-90">
              Complete your booking for {tour.title}
            </p>
          </div>

          <div ref={containerRef} className="p-8 space-y-8">
            {/* SUMMARY */}
          <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm form-field">
  <h3 className="text-lg font-bold mb-6 text-[var(--color-text)]">
    Booking Summary
  </h3>

  <div className="space-y-5">
    {/* Tour Name */}
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <FaTicketAlt className="text-xl" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-[var(--color-text-secondary)]">Tour Name</p>
        <p className="font-medium text-[var(--color-text)] leading-tight">
          {tour.title}
        </p>
      </div>
    </div>

    {/* Date */}
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <FaCalendarAlt className="text-xl" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-[var(--color-text-secondary)]">Date</p>
        <p className="font-medium text-[var(--color-text)] leading-tight">
          {bookingDetails.date
            ? new Date(bookingDetails.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not selected"}
        </p>
      </div>
    </div>

    {/* Time Slot */}
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <FaClock className="text-xl" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-[var(--color-text-secondary)]">Time Slot</p>
        <p className="font-medium text-[var(--color-text)] leading-tight">
          {bookingDetails.slot || "Not selected"}
        </p>
      </div>
    </div>

    {/* Travelers */}
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <FaUsers className="text-xl" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-[var(--color-text-secondary)]">Travelers</p>
        <p className="font-medium text-[var(--color-text)] leading-tight">
          {bookingDetails.adults} Adult{bookingDetails.adults !== 1 ? "s" : ""}
          {bookingDetails.children > 0 &&
            `, ${bookingDetails.children} Child${bookingDetails.children !== 1 ? "ren" : ""}`}
        </p>
      </div>
    </div>
  </div>
</div>

            {/* FORM */}
           <form onSubmit={handleSubmit} className="space-y-6">
  {/* NAME */}
  <div className="form-field relative">
    <label htmlFor="fullName" className="text-sm font-medium mb-2 block text-[var(--color-text)]">Full Name</label>
    <div className="relative">
      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
      <input
        id="fullName"
        className="input w-full pl-10 py-3 border border-[var(--color-border)] rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 shadow-sm"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={(e) => updateField("fullName", e.target.value)}
      />
    </div>
    {errors.fullName && (
      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
        <FaExclamationCircle /> {errors.fullName}
      </p>
    )}
  </div>

  {/* EMAIL */}
  <div className="form-field relative">
    <label htmlFor="email" className="text-sm font-medium mb-2 block text-[var(--color-text)]">Email</label>
    <div className="relative">
      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
      <input
        id="email"
        className="input w-full pl-10 py-3 border border-[var(--color-border)] rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 shadow-sm"
        placeholder="Enter your email"
        type="email"
        value={formData.email}
        onChange={(e) => updateField("email", e.target.value)}
      />
    </div>
    {errors.email && (
      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
        <FaExclamationCircle /> {errors.email}
      </p>
    )}
  </div>

  {/* PHONE */}
  <div className="form-field relative">
    <label htmlFor="phone" className="text-sm font-medium mb-2 block text-[var(--color-text)]">Phone Number</label>
    <div className="relative">
      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
      <input
        id="phone"
        className="input w-full pl-10 py-3 border border-[var(--color-border)] rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 shadow-sm"
        placeholder="Enter your phone number"
        type="tel"
        value={formData.phone}
        onChange={(e) => updateField("phone", e.target.value)}
      />
    </div>
    {errors.phone && (
      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
        <FaExclamationCircle /> {errors.phone}
      </p>
    )}
  </div>

  {/* PAYMENT METHOD */}
  <div className="form-field">
    <p className="text-sm font-medium mb-3 text-[var(--color-text)]">
      Payment Method <span className="text-red-500">*</span>
    </p>
    <div className="grid grid-cols-3 gap-4">
      {[
        { value: "cash", label: "Cash", icon: FaMoneyBillWave },
        { value: "card", label: "Card", icon: FaCreditCard },
        { value: "bank_transfer", label: "Bank Transfer", icon: FaUniversity },
      ].map((method) => (
        <label
          key={method.value}
          className={`flex flex-col items-center gap-2 p-4 border rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 ${
            formData.paymentMethod === method.value
              ? "border-primary-500 bg-primary-50 shadow-md"
              : "border-[var(--color-border)] hover:border-primary-500"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method.value}
            checked={formData.paymentMethod === method.value}
            onChange={(e) => updateField("paymentMethod", e.target.value)}
            className="hidden"
          />
          <method.icon size={24} className="text-primary-500" />
          <span className="text-sm font-medium text-[var(--color-text)]">{method.label}</span>
        </label>
      ))}
    </div>
    {errors.paymentMethod && (
      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
        <FaExclamationCircle /> {errors.paymentMethod}
      </p>
    )}
  </div>

  {/* SUBMIT ERROR */}
  {errors.submit && (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center font-medium form-field flex items-center justify-center gap-2">
      <FaExclamationTriangle /> {errors.submit}
    </div>
  )}

  {/* SUBMIT */}
  <button
    type="submit"
    disabled={loading}
    className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed form-field flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        <FaSpinner className="animate-spin" />
        Processing Booking...
      </>
    ) : (
      "Complete Booking"
    )}
  </button>

  {success && (
    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-center font-semibold form-field flex items-center justify-center gap-2">
      <FaCheckCircle /> 🎉 Booking Confirmed!
    </div>
  )}

  <p className="text-center text-sm text-[var(--color-text-secondary)] form-field italic">
    No payment required • We will contact you within 24 hours
  </p>
</form>
          </div>
        </div>
      </div>
    </section>
  );
}