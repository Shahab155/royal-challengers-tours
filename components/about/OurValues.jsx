'use client';

import { motion } from 'framer-motion';
import SectionHeading from "@/components/SectionHeading"; // Adjust path as needed

const values = [
  {
    number: "01",
    title: "Uncompromising Luxury",
    description: "We partner only with the finest 5-star properties, premium operators, and exclusive experiences to ensure every detail meets the highest standards of elegance and comfort.",
    icon: "✦"
  },
  {
    number: "02",
    title: "Authentic Dubai Experiences",
    description: "Beyond the tourist trail — we offer genuine cultural encounters, private desert dinners, behind-the-scenes access, and insider moments that reveal the real soul of Dubai.",
    icon: "🌙"
  },
  {
    number: "03",
    title: "Personalized Perfection",
    description: "No cookie-cutter tours. Every journey is crafted specifically for you — your interests, your pace, your dreams. We listen, we adapt, we exceed expectations.",
    icon: "♛"
  },
  {
    number: "04",
    title: "Absolute Trust & Transparency",
    description: "Clear pricing, no hidden fees, 24/7 support, and complete peace of mind. Your satisfaction and safety are our highest priorities from first contact to final farewell.",
    icon: "🤝"
  }
];

export default function OurValues() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reusable SectionHeading with animation and gradient */}
        <SectionHeading
          label="What Drives Us"
          title="Our Core Values"
          description="The principles that guide every Royal Challengers Travelers experience"
          align="center"
          gradient={true}
          animate={true}
          className="mb-12 lg:mb-16"
        />

        {/* Values Grid with Framer Motion stagger animation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: "easeOut"
              }}
              whileHover={{ y: -8 }}
              className="card p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-5xl font-bold text-accent-500/30 group-hover:text-accent-500/50 transition-colors">
                  {value.number}
                </span>
                <span className="text-4xl md:text-5xl text-accent-500 opacity-80 group-hover:opacity-100 transition-opacity">
                  {value.icon}
                </span>
              </div>
              
              <h3 className="text-2xl font-semibold font-heading mb-4 text-accent-500">
                {value.title}
              </h3>
              
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing statement with subtle fade-in */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-lg italic text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            "We don't just organize trips. We create memories that last a lifetime."
          </p>
        </motion.div>
      </div>
    </section>
  );
}