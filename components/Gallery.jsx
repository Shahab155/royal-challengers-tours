"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const galleryItems = [
  {
    category: "desert",
    src: "/images/gallery/1.jpg",
    alt: "Thrilling dune bashing in Dubai desert",
    title: "Dune Bashing Adventure",
    aspect: "portrait",
  },
  {
    category: "desert",
    src: "/images/gallery/2.jpg",
    alt: "Luxury desert camp under starry sky",
    title: "Starry Night Camp",
    aspect: "landscape",
  },
  {
    category: "city",
    src: "/images/gallery/3.jpg",
    alt: "Iconic Burj Khalifa at blue hour",
    title: "Burj Khalifa Blue Hour",
    aspect: "portrait",
  },
  {
    category: "city",
    src: "/images/gallery/4.jpg",
    alt: "Dubai skyline golden sunset",
    title: "Golden Sunset Skyline",
    aspect: "landscape",
  },
  {
    category: "cruise",
    src: "/images/gallery/5.jpg",
    alt: "Luxury yacht in Dubai Marina",
    title: "Marina Yacht Experience",
    aspect: "landscape",
  },
  {
    category: "cruise",
    src: "/images/gallery/6.jpg",
    alt: "Sunset cruise with Dubai skyline",
    title: "Sunset Luxury Cruise",
    aspect: "portrait",
  },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredItems = galleryItems.filter(
    (item) => activeFilter === "all" || item.category === activeFilter
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      y: 20,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-5 md:px-8 lg:px-12 relative z-10">
        <SectionHeading
          label="Visual Journey"
          title="Iconic Dubai Moments"
          description="Explore breathtaking captures from desert adventures, dazzling cityscapes, and luxurious sea experiences"
          align="center"
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-12 mb-16">
          {[
            { id: "all", label: "All Moments" },
            { id: "desert", label: "Desert" },
            { id: "city", label: "City Vibes" },
            { id: "cruise", label: "Luxury Cruises" },
          ].map(({ id, label }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(id)}
              className={`
                btn-outline px-8 py-3.5 text-base md:text-lg font-medium
                ${activeFilter === id 
                  ? "!bg-accent-500 !text-white !border-transparent shadow-lg shadow-accent-900/30" 
                  : ""}
              `}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Masonry Gallery with AnimatePresence */}
        <motion.div
          layout // Helps with subtle repositioning
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.article
                key={`${item.src}-${item.title}`} // Unique key is crucial!
                layout // Animate position changes as much as possible
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer mb-6"
              >
                <div
                  className={`
                    relative overflow-hidden rounded-2xl shadow-xl shadow-black/20
                    transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/30
                    ${item.aspect === "portrait" ? "aspect-[4/5.2]" : "aspect-[4/3]"}
                  `}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                   
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Title glass plate */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                    <div className="bg-black/45 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 inline-block">
                      <h3 className="text-xl md:text-2xl font-heading font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}