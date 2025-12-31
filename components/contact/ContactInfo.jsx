'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading"; // Adjust path as needed

const contacts = [
  {
    icon: '📍',
    title: 'Our Office',
    content: 'Downtown Dubai, Sheikh Mohammed Bin Rashid Blvd, Dubai, UAE',
    link: 'https://maps.google.com/?q=Downtown+Dubai',
  },
  {
    icon: '📞',
    title: 'Call Us',
    content: '+971 50 123 4567\n+971 4 123 4567',
    link: 'tel:+971501234567',
  },
  {
    icon: '✉️',
    title: 'Email Us',
    content: 'info@royalchallengers.com',
    link: 'mailto:info@royalchallengers.com',
  },
  {
    icon: '💬',
    title: 'WhatsApp',
    content: 'Message us instantly',
    link: 'https://wa.me/971501234567?text=Hi%20Royal%20Challengers%2C%20I%27m%20interested%20in...',
  },
];

export default function ContactInfo() {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Reusable SectionHeading */}
        <SectionHeading
          label="Get in Touch"
          title="Ways to Reach Us"
          description="We're here to help you plan the perfect luxury experience in Dubai"
          align="center"
          gradient={true}
          animate={true}
          className="mb-12 lg:mb-16"
        />

        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {contacts.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group border-2 border-gray-300 rounded-2xl"
            >
              <Link
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="
                  block h-full rounded-2xl
                  bg-white/10 backdrop-blur-xl
                  border border-white/20
                  p-8 text-center
                  transition-all duration-500
                  hover:border-accent-500/50
                  hover:shadow-2xl hover:shadow-accent-500/10
                  hover:bg-white/15
                "
              >
                {/* Icon */}
                <motion.div
                  className="text-5xl md:text-6xl mb-6 inline-block "
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="bg-gradient-to-br from-accent-500 to-primary-500 bg-clip-text text-transparent">
                    {item.icon}
                  </span>
                </motion.div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-heading font-semibold mb-4">
                  {item.title}
                </h3>

                {/* Content */}
                <p className=" text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}