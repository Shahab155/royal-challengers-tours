"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { z } from "zod";

gsap.registerPlugin(ScrollTrigger);

const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Phone number is too short"),
  bookingType: z.string().min(1, "Please select a booking type"),
  itemTitle: z.string().min(1, "Please select a package or tour"),
  travelers: z.coerce.number().min(1, "At least 1 traveler required"),
  travelDate: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

export default function BookingForm() {
  const formRef = useRef(null);
  const searchParams = useSearchParams();

  const typeFromUrl = searchParams.get("type");
  const slugFromUrl = searchParams.get("slug");

  const isPrefilled = Boolean(typeFromUrl && slugFromUrl);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDate: "",
    travelers: "2",
    message: "",
  });

  const [bookingType, setBookingType] = useState(isPrefilled ? typeFromUrl || "" : "");
  const [selectedItem, setSelectedItem] = useState("");
  const [packages, setPackages] = useState([]);
  const [tours, setTours] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation
  useGSAP(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 80%" },
      }
    );
  }, []);

  // Fetch packages & tours
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, tourRes] = await Promise.all([
          fetch("/api/admin/packages"),
          fetch("/api/admin/tours"),
        ]);

        const [pkgData, tourData] = await Promise.all([
          pkgRes.json(),
          tourRes.json(),
        ]);

        setPackages(Array.isArray(pkgData) ? pkgData : []);
        setTours(Array.isArray(tourData) ? tourData : []);
      } catch (err) {
        console.error("Failed to fetch booking data", err);
      }
    };

    fetchData();
  }, []);

  // Auto-select from URL only if prefilled
  useEffect(() => {
    if (!isPrefilled || !typeFromUrl || !slugFromUrl) return;
    if (!packages.length && !tours.length) return;

    const list = typeFromUrl === "package" ? packages : tours;
    const match = list.find((item) => item.slug === slugFromUrl);

    if (match) {
      setBookingType(typeFromUrl);
      setSelectedItem(match.title || match.name || "");
    }
  }, [packages, tours, isPrefilled, typeFromUrl, slugFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const payload = {
      bookingType,
      itemTitle: selectedItem,
      ...formData,
      travelers: Number(formData.travelers) || 1,
    };

    const result = bookingSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
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
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit booking");
      }

      setSuccess(true);

      if (!isPrefilled) {
        setBookingType("");
        setSelectedItem("");
      }

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        travelDate: "",
        travelers: "2",
        message: "",
      });
      setErrors({});

    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <div
          ref={formRef}
          className="bg-[var(--color-bg)] rounded-2xl shadow-xl overflow-hidden border border-[var(--color-border)]"
        >
          {/* Header - Gradient remains strong in both themes */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-10 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Book Your Dubai Experience
            </h2>
            <p className="opacity-90 max-w-lg mx-auto text-white/90">
              Tell us your dream trip — we'll make it happen!
            </p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.fullName ? "border-red-500" : "border-[var(--color-border)]"
                    } bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-[var(--color-border)]"
                    } bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.phone ? "border-red-500" : "border-[var(--color-border)]"
                  } bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                  placeholder="+971 50 123 4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Booking Type */}
              {!isPrefilled && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Booking Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookingType}
                    onChange={(e) => {
                      setBookingType(e.target.value);
                      setSelectedItem("");
                      setErrors((prev) => ({ ...prev, bookingType: undefined, itemTitle: undefined }));
                    }}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.bookingType ? "border-red-500" : "border-[var(--color-border)]"
                    } bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                  >
                    <option value="">Select Booking Type</option>
                    <option value="package">Package</option>
                    <option value="tour">Tour / Activity</option>
                  </select>
                  {errors.bookingType && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bookingType}</p>
                  )}
                </div>
              )}

              {/* Selected Item */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  {bookingType === "tour" ? "Tour / Activity" : "Package"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={!bookingType || isPrefilled}
                  value={selectedItem}
                  onChange={(e) => {
                    setSelectedItem(e.target.value);
                    setErrors((prev) => ({ ...prev, itemTitle: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.itemTitle ? "border-red-500" : "border-[var(--color-border)]"
                  } bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-60`}
                >
                  <option value="">
                    Select {bookingType || "item"}
                  </option>
                  {(bookingType === "tour" ? tours : packages).map((item) => (
                    <option key={item.id} value={item.title || item.name}>
                      {item.title || item.name}
                    </option>
                  ))}
                </select>
                {errors.itemTitle && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.itemTitle}</p>
                )}
              </div>

              {/* Date + Travelers */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Preferred Travel Date
                  </label>
                  <input
                    name="travelDate"
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => updateField("travelDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Number of Travelers
                  </label>
                  <input
                    name="travelers"
                    type="number"
                    min="1"
                    value={formData.travelers}
                    onChange={(e) => updateField("travelers", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.travelers ? "border-red-500" : "border-[var(--color-border)]"
                    } bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                  />
                  {errors.travelers && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.travelers}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Additional Requests / Notes
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
                  placeholder="Any special requirements, preferences or questions..."
                />
              </div>

              {/* General submit error */}
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-5 text-center font-bold">
                  {errors.submit}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                  ${loading 
                    ? "bg-gray-500 dark:bg-gray-600 cursor-not-allowed" 
                    : "bg-primary-500 hover:bg-primary-600 shadow-md hover:shadow-lg"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Submitting...
                  </span>
                ) : (
                  "Submit Booking Request"
                )}
              </button>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-xl p-6 text-center font-medium">
                  <div className="text-2xl mb-2">🎉 Thank you!</div>
                  <p>
                    Your booking request has been sent successfully.
                    <br />
                    Our team will contact you within 24 hours.
                  </p>
                </div>
              )}

              <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
                No payment required • We'll contact you within 24 hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}