'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import RippleButton from "@/components/RippleButton";

/* ------------------ Motion Variants ------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.18,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const loaderVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/* ------------------ Component ------------------ */

export default function ToursList({ filteredTours, isLoading = false }) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle background wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* ================= LOADER ================= */}
        {isLoading && (
          <div className="text-center py-24 flex flex-col items-center justify-center">
            <motion.div
              className="w-20 h-20 border-8 border-t-primary-500 border-l-primary-500 border-b-transparent border-r-transparent rounded-full shadow-lg"
              variants={loaderVariants}
              animate="animate"
            />
            <p className="mt-6 text-lg font-medium text-text-secondary animate-pulse">
              Loading exclusive tours...
            </p>
          </div>
        )}

        {/* ================= NO RESULTS ================= */}
        {!isLoading && filteredTours.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-3xl font-semibold mb-4">No tours found</h3>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Try adjusting your search or selecting a different category.
            </p>
          </div>
        )}

        {/* ================= TOURS GRID ================= */}
        {!isLoading && filteredTours.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            {filteredTours.map((tour, index) => (
              <motion.div
                key={tour.slug}
                custom={index}
                variants={cardVariants}
                className="group"
              >
                <div
                  className={`
                    glass-card-strong flex flex-col h-full
                    rounded-2xl overflow-hidden border border-white/10
                    transition-all duration-500
                    ${tour.featured
                      ? "ring-2 ring-accent-500/50 shadow-2xl shadow-accent-900/20"
                      : "shadow-xl shadow-black/10"
                    }
                    hover:shadow-2xl hover:shadow-black/20
                    hover:-translate-y-2
                  `}
                >
                  {/* ================= IMAGE ================= */}
                  <div className="relative h-64 md:h-72 overflow-hidden shrink-0">
                    <Link href={`/tours/${tour.slug}`} className="block w-full h-full">
                      <img
                        src={tour.imageSrc}
                        alt={tour.imageAlt || tour.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-5 left-5 z-20 flex flex-col gap-2.5">
                      {tour.badge && (
                        <span className="px-4 py-1.5 bg-accent-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-md">
                          {tour.badge}
                        </span>
                      )}
                      {tour.featured && (
                        <span className="px-4 py-1.5 bg-primary-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-md">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute top-5 right-5 z-20">
                      <div className="bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
                        <span className="text-white font-bold text-xl tracking-tight">
                          {tour.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ================= CONTENT ================= */}
                  <div className="flex flex-col flex-grow p-7">
                    <h3 className="text-2xl font-heading font-bold mb-4 text-text leading-tight">
                      <Link href={`/tours/${tour.slug}`} className="hover:text-accent-500 transition-colors">
                        {tour.title}
                      </Link>
                    </h3>

                    <p className="text-text-secondary mb-8 text-[15px] leading-relaxed flex-grow">
                      {tour.description}
                    </p>

                    {/* Footer - Duration + Price + Full-Width RippleButton */}
                    <div className="mt-auto pt-6 border-t border-white/10 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-text-secondary text-sm font-medium">
                          <span className="text-sm md:text-md font-extrabold">Duration:</span> {tour.duration}
                        </div>
                        
                      {/* Full-Width RippleButton */}
                      <RippleButton
                        text="View Details"
                        href={`/tours/${tour.slug}`}
                       
                      />
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}