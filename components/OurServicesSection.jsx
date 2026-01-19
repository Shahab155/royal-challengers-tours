"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function OurServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [index, setIndex] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(0.5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const viewportRef = useRef(null);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let view = 1;
      if (width >= 1024) view = 4;
      else if (width >= 640) view = 2;
      setSlidesPerView(view);
      if (viewportRef.current) {
        setSlideWidth(viewportRef.current.offsetWidth / view);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIndex(slidesPerView);
  }, [slidesPerView]);

  if (loading) {
    return (
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="h-12 w-64 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800 rounded-xl animate-pulse mx-auto mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:from-slate-800/40 dark:to-slate-700/30 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!services?.length) return null;

  const numSlides = services.length;
  const extendedSlides = [
    ...services.slice(-slidesPerView),
    ...services,
    ...services.slice(0, slidesPerView),
  ];
  const currentX = `-${index * (100 / slidesPerView)}%`;
  const leftConstraint = -(extendedSlides.length - slidesPerView) * slideWidth;

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionDuration(0.5);
    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionDuration(0.5);
    setIndex((prev) => prev - 1);
  };

  const handleAnimationComplete = () => {
    if (index >= numSlides + slidesPerView) {
      setTransitionDuration(0);
      setIndex(index - numSlides);
    } else if (index < slidesPerView) {
      setTransitionDuration(0);
      setIndex(index + numSlides);
    }
    setIsAnimating(false);
  };

  const handleDragEnd = (_, { offset, velocity }) => {
    const threshold = slideWidth * 0.3;
    if (offset.x < -threshold && velocity.x <= 0) {
      handleNext();
    } else if (offset.x > threshold && velocity.x >= 0) {
      handlePrev();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") handleNext();
    else if (e.key === "ArrowLeft") handlePrev();
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Optional subtle background blobs */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none">
        <div className="absolute -left-40 top-20 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-accent-500/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
        {/* Section Heading - matched style */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-accent-500 font-semibold tracking-wider uppercase mb-4"
          >
            Our Expertise
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-5 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"
          >
            Premium Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-color-text-secondary leading-relaxed"
          >
            Discover our carefully crafted services designed to deliver exceptional quality and lasting value
          </motion.p>
        </div>

        {/* Services Slider */}
        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 font-extrabold top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 p-3 md:p-4 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md text-primary-500 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            aria-label="Previous service"
          >
            <FiChevronLeft className="w-5 h-5 md:w-8 md:h-8 " />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 font-extrabold top-1/2 -translate-y-1/2 translate-x-1/2 z-10 p-3 md:p-4 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md text-primary-500 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            aria-label="Next service"
          >
            <FiChevronRight className="w-5 h-5 md:w-8 md:h-8 " />
          </button>

          <div
            ref={viewportRef}
            className="overflow-hidden"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Services carousel"
          >
            <motion.div
              className="flex flex-nowrap"
              drag={isAnimating ? false : "x"}
              dragConstraints={{ right: 0, left: leftConstraint }}
              dragElastic={0.1}
              animate={{ x: currentX }}
              transition={{ duration: transitionDuration, ease: "easeOut" }}
              onAnimationComplete={handleAnimationComplete}
              onDragEnd={handleDragEnd}
            >
              {extendedSlides.map((service, i) => (
                <div
                  key={`${service.id}-${i}`}
                  style={{ width: `${100 / slidesPerView}%` }}
                  className="flex-shrink-0 px-3 md:px-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="group relative block h-full rounded-2xl overflow-hidden"
                    >
                      <div
                        className="
                          relative 
                          aspect-[4/5] 
                          rounded-2xl 
                          overflow-hidden 
                          bg-gradient-to-t from-black/70 via-black/40 to-transparent/0
                          transition-all duration-500
                          group-hover:scale-[1.03]
                        "
                        style={{
                          backgroundImage: service.image
                            ? `url(/images/categories/${service.image})`
                            : `linear-gradient(135deg, #1e3a8a 0%, #99732f 100%)`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent/10 group-hover:from-black/85 transition-all duration-500" />

                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                          <h3 className="
                            text-2xl md:text-3xl 
                            font-bold text-white 
                            mb-4 
                            drop-shadow-lg 
                            transition-all duration-400
                            group-hover:mb-6
                          ">
                            {service.name}
                          </h3>

                          <div className="
                            max-h-0 overflow-hidden opacity-0 
                            group-hover:max-h-24 group-hover:opacity-100 
                            transition-all duration-500 ease-out
                          ">
                            <div className="
                              flex items-center 
                              text-accent-300 font-medium 
                              text-base tracking-wide
                            ">
                              <span>Explore service</span>
                              <FaLongArrowAltRight className="
                                ml-3 w-5 h-5 
                                transition-transform duration-400 
                                group-hover:translate-x-2
                              "/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}