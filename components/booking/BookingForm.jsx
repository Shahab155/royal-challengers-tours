"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BookingForm() {
  const formRef = useRef(null);
  const searchParams = useSearchParams();

  const typeFromUrl = searchParams.get("type");
  const slugFromUrl = searchParams.get("slug");

  const [bookingType, setBookingType] = useState(typeFromUrl || "");
  const [selectedItem, setSelectedItem] = useState("");
  const [packages, setPackages] = useState([]);
  const [tours, setTours] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  const isPrefilled = Boolean(typeFromUrl && slugFromUrl);

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
     console.log("Package:", pkgRes)
        setPackages(Array.isArray(pkgData) ? pkgData : []);
        setTours(Array.isArray(tourData) ? tourData : []);
      } catch (err) {
        console.error("Failed to fetch booking data", err);
      }
    };

    fetchData();
  }, []);

  // Auto select from URL params
  useEffect(() => {
    if (!typeFromUrl || !slugFromUrl) return;
    if (!packages.length && !tours.length) return;

    const list = typeFromUrl === "package" ? packages : tours;
    const match = list.find((item) => item.slug === slugFromUrl);

    if (match) {
      setBookingType(typeFromUrl);
      setSelectedItem(match.title || match.name || "");
    }
  }, [packages, tours, typeFromUrl, slugFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    const fullName = (formData.get("fullName") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();

    // Validation
    if (!fullName) return setFormError("Full name is required");
    if (!email) return setFormError("Email address is required");
    if (!phone) return setFormError("Phone number is required");
    if (!bookingType) return setFormError("Please select booking type");
    if (!selectedItem) return setFormError("Please select a package or tour");

    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      return setFormError("Please enter a valid email address");
    }

    setLoading(true);

    const payload = {
      bookingType,
      itemTitle: selectedItem,
      fullName,
      email,
      phone,
      travelDate: formData.get("travelDate") || null,
      travelers: Number(formData.get("travelers") || 1),
      message: formData.get("message") || null,
    };

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
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <div
          ref={formRef}
          
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Book Your Dubai Experience
            </h2>
            <p className="text-blue-100 opacity-90 max-w-lg mx-auto">
              Tell us your dream trip — we'll make it happen!
            </p>
          </div>

          <div className="p-8 md:p-10">
          
        
            <form  onSubmit={handleSubmit}  
               noValidate
            className="space-y-6">
              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="+971 50 123 4567"
                />
              </div>

              {/* Booking Type */}
              {!isPrefilled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Booking Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={bookingType}
                    onChange={(e) => {
                      setBookingType(e.target.value);
                      setSelectedItem("");
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="">Select Booking Type</option>
                    <option value="package">Package</option>
                    <option value="tour">Tour / Activity</option>
                  </select>
                </div>
              )}

              {/* Selected Item */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {bookingType === "tour" ? "Tour / Activity" : "Package"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  disabled={!bookingType || isPrefilled}
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">
                    Select {bookingType ? bookingType : "item"}
                  </option>
                  {(bookingType === "tour" ? tours : packages).map((item) => (
                    <option key={item.id} value={item.title || item.name}>
                      {item.title || item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date + Travelers */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Travel Date
                  </label>
                  <input
                    name="travelDate"
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Number of Travelers
                  </label>
                  <input
                    name="travelers"
                    type="number"
                    min="1"
                    defaultValue="2"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional Requests / Notes
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Any special requirements, preferences or questions..."
                />
              </div>
              {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-8 text-center font-bold">
                {formError}
              </div>
            )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"}`}
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

                {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 mb-8 text-center font-medium">
                <div className="text-2xl mb-2">🎉 Thank you!</div>
                <p>
                  Your booking request has been sent successfully.
                  <br />
                  Our team will contact you within 24 hours.
                </p>
              </div>
            )}


              <p className="text-center text-sm text-gray-500 mt-4">
                No payment required • We'll contact you within 24 hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}