'use client';

import { motion } from 'framer-motion';
import SectionHeading from "@/components/SectionHeading"; // ← Adjust path if needed

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const teamMembers = [
  {
    name: "Ahmed Al Maktoum",
    role: "Founder & Lead Curator",
    bio: "15+ years crafting unforgettable Dubai experiences, blending local heritage with world-class luxury.",
    image: "/images/about/member1.png",
  },
  {
    name: "Layla Hassan",
    role: "Head of Luxury Operations",
    bio: "Detail-obsessed perfectionist ensuring every private yacht, desert camp, and VIP transfer is flawless.",
    image: "/images/about/member2.png",
  },
  {
    name: "James Carter",
    role: "International Client Director",
    bio: "Global traveler turned Dubai expert, helping guests from 40+ countries discover the city's true magic.",
    image: "/images/about/member3.png",
  },
  // Add more team members here if needed
];

export default function MeetOurTeam() {
  return (
    <section className="py-20 lg:py-28 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          label="Our People"
          title="Meet the Hearts Behind Royal Challengers"
          description="Passionate experts who live and breathe Dubai — dedicated to turning your dreams into extraordinary reality"
          align="center"
          gradient={true}
          animate={true}
          className="mb-16 lg:mb-20"
        />

        {/* Desktop & Tablet: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.9,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              whileHover={{ y: -12 }}
              className="group flex flex-col items-center text-center"
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: Swiper Slider */}
        <div className="block md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={32}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {teamMembers.map((member, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex justify-center px-4"
                >
                  <div className="max-w-sm w-full">
                    <TeamCard member={member} />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Closing Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16 lg:mt-20 text-center"
        >
          <p className="text-xl italic text-[var(--color-text-secondary)] max-w-4xl mx-auto">
            "We don't just plan trips. We create stories you'll tell for generations."
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Reusable Team Card Component
function TeamCard({ member }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar with hover effects */}
      <div className="relative mb-8">
        <motion.div
          className="w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-transparent group-hover:border-accent-500/30 transition-all duration-500 shadow-xl group-hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={member.image}
            alt={`${member.name} - ${member.role}`}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            whileHover={{ scale: 1.12, rotate: 2 }}
            // transition={{ duration: 0.6 }}
          />
        </motion.div>

        {/* Subtle glow overlay on hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-r from-accent-500/20 to-primary-500/20 blur-xl pointer-events-none" />
      </div>

      {/* Name & Role */}
      <h3 className="text-2xl md:text-3xl font-semibold font-heading mb-2 text-accent-500">
        {member.name}
      </h3>
      <p className="text-lg font-medium text-primary-500 mb-4 tracking-wide">
        {member.role}
      </p>
      <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-sm">
        {member.bio}
      </p>
    </div>
  );
}