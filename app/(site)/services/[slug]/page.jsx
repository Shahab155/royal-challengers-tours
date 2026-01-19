"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiClock, FiDollarSign, FiX } from "react-icons/fi";

export default function ServicePage() {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [tours, setTours] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [time, setTime] = useState("");

  const fetchTours = async (filters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.time && { time: filters.time }),
      }).toString();

      const res = await fetch(`/api/services/${slug}?${query}`);
      const data = await res.json();

      setService(data.service);
      setTours(data.tours || []);
      setTimeSlots(data.timeSlots || []);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchTours();
  }, [slug]);

  const handleSearch = () => {
    fetchTours({ minPrice, maxPrice, time });
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setTime("");
    fetchTours();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[--color-bg] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[--color-text-secondary]">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[--color-bg] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[--color-text] mb-3">
            Service not found
          </h2>
          <p className="text-[--color-text-secondary] mb-6">
            The requested service could not be found
          </p>
          <Link
            href="/services"
            className="text-primary hover:text-primary-600 transition-colors"
          >
            ← Back to all services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-bg]">
      {/* Hero / Cover */}
      <div className="relative h-64 md:h-80 lg:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/images/categories/${service.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex items-end pb-12 md:pb-16">
          <div className="max-w-3xl">
            <div
              className="
                inline-block px-4 py-1.5 mb-4 rounded-full 
                bg-white/15 dark:bg-black/25 backdrop-blur-md 
                text-white text-sm font-medium
              "
            >
              {service.category || "Experience"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              {service.name}
            </h1>
            {service.tagline && (
              <p className="mt-4 text-xl text-white/90 max-w-2xl">
                {service.tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Filters */}
        <div className="mb-12">
          <div
            className="
              glass-card 
              rounded-2xl 
              shadow-xl 
              p-6 md:p-8
            "
          >
            <div className="flex flex-col md:flex-row gap-5 md:gap-6 md:items-end">
              <div className="flex-1 min-w-0">
                <label
                  className="
                    block text-md font-bold 
                    text-[--color-text-secondary] mb-1.5 
                    flex items-center gap-2
                  "
                >
                  <FiDollarSign size={16} />
                  Price Range
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="
                      w-full px-4 py-3 rounded-xl 
                      bg-[--color-surface]/60 
                      border border-[--color-border]
                      text-[--color-text]
                      placeholder:text-[--color-text-secondary]
                      focus:border-primary focus:ring-2 focus:ring-primary/30
                      transition-all text-[--color-text]
                    "
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="
                      w-full px-4 py-3 rounded-xl 
                      bg-[--color-surface]/60 
                      border border-[--color-border]
                      text-[--color-text]
                      placeholder:text-[--color-text-secondary]
                      focus:border-primary focus:ring-2 focus:ring-primary/30
                      transition-all
                    "
                  />
                </div>
              </div>

              <div className="min-w-[180px]">
                <label
                  className="
                    block text-md font-bold
                    text-[--color-text-secondary] mb-1.5 
                    flex items-center gap-2
                  "
                >
                  <FiClock size={16} className="text-md font-bold"/>
                  Time Slot
                </label>
              {/* Use this version – best current compromise */}
<select
  value={time}
  onChange={(e) => setTime(e.target.value)}
  className={`
    appearance-none
    w-full px-5 py-3.5 pr-10
    bg-[--color-surface]/80 border border-[--color-border]
    text-[--color-text-secondary]  rounded-xl
    shadow-sm
    focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none
    transition-all
    cursor-pointer
    relative
    after:content-['▼']
    after:absolute after:right-4 after:top-1/2 after:-translate-y-1/2
    after:text-[--color-text-secondary]
    after:pointer-events-none
    after:text-xs
  `}
>
  <option value="" className="bg-[--color-surface] text-[--color-text-secondary] ">
    Any Time
  </option>
  {timeSlots.map((slot) => (
    <option
      key={slot.time_slot}
      value={slot.time_slot}
      className="bg-[--color-surface] text-[--color-text-secondary] "
    >
      {slot.time_slot}
    </option>
  ))}
</select>
              </div>

              <div className="flex gap-3 md:gap-4 mt-4 md:mt-0">
  {/* Search button - use existing .btn-primary class */}
  <button
    onClick={handleSearch}
    className="
      btn-primary
      flex-1 md:flex-none
      px-6 md:px-10
      py-3
      text-base
      shadow-lg hover:shadow-xl
      flex items-center justify-center gap-2
    "
  >
    <FiSearch size={18} />
    Search
  </button>

  {/* Clear button - outline style with theme variables */}
  {(minPrice || maxPrice || time) && (
    <button
      onClick={clearFilters}
      className="
        inline-flex items-center justify-center gap-2
        px-6 md:px-10 py-3
        text-[--color-text]
        bg-[--color-surface]
        hover:bg-[--color-surface]/90
        active:bg-[--color-surface]/80
        border border-[--color-border]
        rounded-xl
        font-medium
        transition-all duration-200
        shadow-sm hover:shadow
      "
    >
      <FiX size={18} />
      Clear
    </button>
  )}
</div>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {tours.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 text-[--color-text-secondary] opacity-40">
              ¯\_(ツ)_/¯
            </div>
            <h3 className="text-xl font-medium text-[--color-text] mb-3">
              No experiences found
            </h3>
            <p className="text-[--color-text-secondary] max-w-md mx-auto">
              Try adjusting your filters or browse all available experiences
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tours.map((tour) => (
              <Link
                key={tour.id}
                href={`/tours/${tour.slug}`}
                className="
                  group
                  glass-card 
                  rounded-2xl overflow-hidden 
                  transition-all duration-300 
                  hover:-translate-y-1 hover:shadow-2xl
                "
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {tour.image ? (
                    <img
                      src={`/images/tours/${tour.image}`}
                      alt={tour.title}
                      className="
                        w-full h-full object-cover 
                        transition-transform duration-700 
                        group-hover:scale-110
                      "
                    />
                  ) : (
                    <div className="
                      w-full h-full 
                      bg-gradient-to-br from-gray-200/50 to-gray-300/50 
                      dark:from-slate-800/50 dark:to-slate-700/50 
                      flex items-center justify-center
                    ">
                      <span className="text-[--color-text-secondary] text-lg font-medium">
                        No image
                      </span>
                    </div>
                  )}
                  <div className="
                    absolute inset-0 
                    bg-gradient-to-t from-black/60 via-transparent to-transparent 
                    opacity-70 group-hover:opacity-85 
                    transition-opacity
                  " />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="
                    text-xl font-bold 
                    text-[--color-text] 
                    line-clamp-2
                  ">
                    {tour.title}
                  </h3>

                  <p className="
                    text-sm 
                    text-[--color-text-secondary] 
                    line-clamp-2 min-h-[3em]
                  ">
                    {tour.short_description || "Experience the best of..."}
                  </p>

                  <div className="
                    flex items-center justify-between pt-3 
                    border-t border-[--color-border]
                  ">
                    <div className="text-2xl font-bold text-primary">
                      ${Number(tour.price).toLocaleString()}
                    </div>
                    <div className="text-sm text-[--color-text-secondary] font-medium">
                      {tour.duration_days
                        ? `${tour.duration_days} day${tour.duration_days > 1 ? "s" : ""}`
                        : "Flexible"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}