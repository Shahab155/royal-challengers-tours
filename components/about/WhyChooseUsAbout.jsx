'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "24/7 Support",
    description: "Round-the-clock assistance via phone, WhatsApp, or email — before, during, and after your journey."
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Safe & Secure",
    description: "Fully licensed vehicles, insured activities, and experienced drivers for complete peace of mind."
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Best Value",
    description: "Competitive pricing with no hidden fees — direct booking ensures maximum value."
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Expert Guides",
    description: "Certified local guides deliver authentic, informative, and memorable experiences."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="
      py-20 lg:py-28 
      relative overflow-hidden 
      transition-all duration-700
      dark:bg-blue-600 
      bg-blue-50
    ">
      {/* Subtle overlay for depth - adapts to theme */}
      <div className="
        absolute inset-0 pointer-events-none 
        dark:bg-gradient-to-b dark:from-blue-700/20 dark:to-blue-900/40
        bg-primary-500 to-transparent
      " />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="
            text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight
            dark:text-white text-blue-900
          ">
            The Royal Challengers Difference
          </h2>
          <p className="
            text-lg md:text-xl max-w-3xl mx-auto leading-relaxed
            dark:text-blue-100 text-blue-700
          ">
            We go beyond ordinary tours — delivering personalized, safe, and exceptional Dubai experiences every time.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: "easeOut"
              }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="
                rounded-2xl h-full
                backdrop-blur-xl shadow-2xl
                border transition-all duration-500
                dark:bg-white/10 dark:border-white/30
                bg-white/70 border-blue-200/50
                group-hover:shadow-3xl
                group-hover:dark:shadow-blue-400/30 group-hover:shadow-blue-300/40
                group-hover:dark:border-white/50 group-hover:border-blue-300/70
              ">
                <div className="flex flex-col items-center text-center p-6 lg:p-8">
                  <motion.div
                    className="
                      mb-6
                      dark:text-blue-300 text-blue-600
                    "
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="
                    text-xl font-semibold font-heading mb-4
                    dark:text-white text-blue-900
                  ">
                    {feature.title}
                  </h3>
                  <p className="
                    text-base leading-relaxed
                    dark:text-blue-50 text-blue-800/80
                  ">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16 lg:mt-20"
        >
          <Link href={"/tours"}>
          <button className=" cursor-pointer
            px-10 py-4 text-lg font-semibold shadow-lg transition-all duration-300
            dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-600
            border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white
            bg-transparent border-2 rounded-lg
          ">
            Discover Our Tours
          </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}