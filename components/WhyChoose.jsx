"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import {
  LuShieldCheck,
  LuClock,
  LuBuilding2,
  LuTruck,
  LuDollarSign,
  LuPhoneCall,
} from "react-icons/lu";

const features = [
  {
    title: "Fast Processing",
    desc: "Seamless booking and confirmations with minimal wait time.",
    icon: LuClock,
  },
  {
    title: "Trusted Company",
    desc: "A brand trusted by thousands of travelers worldwide.",
    icon: LuBuilding2,
  },
  {
    title: "Front Interview",
    desc: "Personal consultation before every curated experience.",
    icon: LuShieldCheck,
  },
  {
    title: "In-time Delivery",
    desc: "Punctual pickups, schedules, and itinerary execution.",
    icon: LuTruck,
  },
  {
    title: "Reasonable Price",
    desc: "Transparent pricing with luxury value guaranteed.",
    icon: LuDollarSign,
  },
  {
    title: "24/7 Support",
    desc: "Dedicated assistance anytime, anywhere you travel.",
    icon: LuPhoneCall,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle background wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--color-surface)] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/whyChoose.png"
              alt="Why Choose Royal Travelers"
              width={600}
              height={750}
              className="object-cover w-full h-full"
              priority
            />

            {/* Subtle glass overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          </div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <div>
          <SectionHeading
            label="Why Choose Us"
            title="Reason for Choosing Us"
            description="We combine precision, trust, and luxury to deliver travel experiences that exceed expectations."
            align="left"
          />

          {/* FEATURES GRID */}
          <div className="mt-12 grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex gap-5 items-start group" // Added 'group' for hover targeting
                >
                  {/* Animated Icon Box */}
                  <motion.div
                    className="
                      flex-shrink-0
                      h-14 w-14 rounded-xl
                      bg-white/10 backdrop-blur-md
                      flex items-center justify-center
                      border border-accent-500/30
                      transition-all duration-300
                      group-hover:shadow-lg group-hover:shadow-accent-500/20
                      group-hover:border-accent-500/60
                    "
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Icon className="h-6 w-6 text-accent-500" />
                    </motion.div>
                  </motion.div>

                  {/* Text */}
                  <div>
                    <h4 className="text-lg font-bold mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}