"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RippleButton from "@/components/RippleButton";
import Link from "next/link";
import Image from "next/image";

/* ================= ANIMATION ================= */
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

export default function FeaturedPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH RECENT PACKAGES ================= */
  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("/api/packages", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch packages");

        const data = await res.json();

        if (Array.isArray(data)) {
          // Sort descending (latest first)
          const sorted = [...data].sort(
            (a, b) =>
              new Date(b.created_at || b.id) -
              new Date(a.created_at || a.id)
          );

          setPackages(sorted.slice(0, 3)); // show only recent 3
        }
      } catch (err) {
        console.error("Failed to load featured packages", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  if (loading || packages.length === 0) return null;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-5 md:px-8 lg:px-12 relative z-10">
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-accent-500 font-semibold tracking-wider uppercase mb-4"
          >
            Exclusive Collections
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-5 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"
          >
            Featured Travel Packages
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed"
          >
            Discover our most luxurious and popular Dubai experiences, carefully curated for unforgettable memories
          </motion.p>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.slug}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              className="group"
            >
              <div
                className={`
                  glass-card-strong flex flex-col h-full
                  rounded-2xl overflow-hidden border border-white/10
                  transition-all duration-500
                  ${pkg.featured
                    ? "ring-2 ring-accent-500/50 shadow-2xl shadow-accent-900/20"
                    : "shadow-xl shadow-black/10"}
                  hover:shadow-2xl hover:shadow-black/20
                  hover:-translate-y-2
                `}
              >
                {/* Image */}
                <div className="relative h-64 md:h-72 overflow-hidden shrink-0">
                  <Image
                    src={
                      pkg.image
                        ? `/images/packages/${pkg.image}`
                        : "/images/placeholder.jpg"
                    }
                    alt={pkg.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Badges */}
                  <div className="absolute top-5 left-5 z-20 flex flex-col gap-2.5">
                    {pkg.badge && (
                      <span className="px-4 py-1.5 bg-accent-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-md">
                        {pkg.badge}
                      </span>
                    )}
                    {pkg.featured && (
                      <span className="px-4 py-1.5 bg-primary-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-md">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="absolute top-5 right-5 z-20">
                    <div className="bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
                      <span className="text-white font-bold text-xl tracking-tight">
                        AED {pkg.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-7">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-text leading-tight">
                    {pkg.title}
                  </h3>

                  <p className="text-text-secondary mb-8 text-[15px] leading-relaxed flex-grow">
                    {pkg.short_description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                    <div className="text-text-secondary text-sm font-medium">
                      {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
                    </div>

                    <RippleButton
                      text="View Details"
                      href={`/packages/${pkg.slug}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        <Link href="/packages">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 md:mt-20"
          >
          <button className="btn-outline">Explore All Packages </button>
        </motion.div>
          </Link>
      </div>
    </section>
  );
}
