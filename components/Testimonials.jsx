"use client";

import { useState, useEffect, useRef } from "react";
import SectionHeading from "@/components/SectionHeading";
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Ahmed Al Noor",
    role: "Business Traveler",
    text: "Royal Travelers delivered an exceptional experience. Everything was seamless, luxurious, and thoughtfully curated.",
    color: "bg-accent-500",
    bgImage: "/images/packages/1.jpg",
  },
  {
    name: "Sophia Williams",
    role: "Luxury Explorer",
    text: "From airport pickup to desert nights, every detail reflected class and professionalism. Highly recommended.",
    color: "bg-primary-500",
    bgImage: "/images/packages/2.jpg",
  },
  {
    name: "Daniel Foster",
    role: "Family Vacation",
    text: "The team made our Dubai trip unforgettable. Perfect balance of comfort, adventure, and elegance.",
    color: "bg-accent-500",
    bgImage: "/images/packages/3.jpg",
  },
  
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);

  // Autoplay
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [active]);

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index) => {
    setActive(index);
  };

  // Only show active + immediate neighbors
  const getVisibleIndices = () => {
    const indices = [];
    const len = testimonials.length;
    indices.push(active);
    indices.push((active - 1 + len) % len);
    indices.push((active + 1) % len);
    return [...new Set(indices)];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-transparent via-[color:var(--color-surface)]/50 to-transparent">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="mb-20 text-center">
          <SectionHeading
            label="Testimonials"
            title="Client Feedback & Testimonial"
            description="Real stories from travelers who trusted us with their most memorable journeys."
            align="center"
          />
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-[90%] h-[480px]">
            {testimonials.map((item, index) => {
              if (!visibleIndices.includes(index)) return null;

              const isActive = index === active;

              return (
                <div
                  key={index}
                  className={`
                    absolute inset-0 transition-all duration-500 ease-out
                    ${isActive ? "opacity-100 scale-100 z-20" : "opacity-60 scale-95 z-10"}
                  `}
                >
                  <div
                    className={`
                      relative overflow-hidden glass-card-strong rounded-[36px] p-10
                      w-full h-full flex flex-col justify-between
                      shadow-2xl border border-white/20 backdrop-blur-xl
                      ${isActive 
                        ? "ring-4 ring-primary-500/40 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.5)]" 
                        : "shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)]"
                      }
                    `}
                    style={{
                      backgroundImage: `url(${item.bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 rounded-[36px]" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Quote Icon Top Left */}
                      <div className={`
                        absolute -top-6 -left-6 h-14 w-14 rounded-full
                        flex items-center justify-center text-white text-2xl
                        ${item.color} shadow-2xl backdrop-blur-md
                      `}>
                        <FaQuoteLeft />
                      </div>

                      <div className="mt-8">
                        <h4 className="text-2xl font-bold text-white drop-shadow-lg">
                          {item.name}
                        </h4>
                        <p className="text-sm text-white/80 mb-5 drop-shadow">
                          {item.role}
                        </p>

                        <div className="flex gap-1 mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className="text-accent-500 text-lg drop-shadow-md"
                            />
                          ))}
                        </div>

                        <p className="text-base leading-relaxed text-white/90 italic drop-shadow-md">
                          "{item.text}"
                        </p>
                      </div>

                      {/* Large decorative quote */}
                      <div className="absolute bottom-8 right-8 text-white/10 text-9xl -z-10 pointer-events-none">
                        <FaQuoteLeft className="rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 md:left-[-60px] top-1/2 -translate-y-1/2 z-30
                w-14 h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/20
                flex items-center justify-center text-white text-2xl
                hover:bg-black/50 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 md:right-[-60px] top-1/2 -translate-y-1/2 z-30
                w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20
                flex items-center justify-center text-white text-2xl
                hover:bg-primary-600 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-16 flex justify-center gap-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                h-3 rounded-full transition-all duration-500 backdrop-blur-md
                ${active === index
                  ? "w-12 bg-white shadow-lg shadow-white/50"
                  : "w-3 bg-white/20 hover:bg-white/50"
                }
              `}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}