"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import RippleButton from "./RippleButton";
import SectionHeading from "@/components/SectionHeading";

export default function AboutSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Theme-aware background wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--color-surface)] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (USING SectionHeading) */}
        <div className="mb-16">
          <SectionHeading
            label="About Us"
            title="Welcome to Royal Travelers"
            description="Your trusted partner for unforgettable luxury adventures, family getaways, and eco-friendly journeys across the globe."
            align="center"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Floating Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative animate-float-slow"
          >
            <Image
              src="/images/about/1.png"
              alt="Royal Travelers Team"
              width={800}
              height={600}
              className="rounded-3xl shadow-2xl"
            />

            {/* Glass Overlay */}
            <div className="absolute inset-0 glass-card-strong rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="relative rounded-full p-8 bg-accent-500/20 backdrop-blur-sm border border-accent-400/30">
                    <p className="text-6xl font-bold text-white">15+</p>
                  </div>
                </div>
                <p className="mt-6 text-2xl font-semibold text-white">
                  Years of Excellence
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Glass Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Card 1 */}
            <div className="glass-card-strong p-8 rounded-3xl">
              <h3 className="text-3xl mb-4">
                Discover the World with Confidence
              </h3>
              <p className="text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
                At Royal Travelers, we craft personalized travel experiences that blend
                luxury, adventure, and sustainability. Every journey is seamless,
                refined, and tailored just for you.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-3xl mb-4">
                Why Thousands Trust Us
              </h3>
              <ul className="space-y-4 text-[color:var(--color-text-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="text-accent-500">✨</span>
                  <span>Handpicked luxury & eco-friendly partners worldwide</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-500">✓</span>
                  <span>24/7 support from real travel experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-500">♡</span>
                  <span>Flexible booking with best-price guarantee</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <RippleButton text="Learn More About Us" href="/about" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
