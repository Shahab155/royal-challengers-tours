// components/SectionHeading.jsx
"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  label = "",                    // Optional small uppercase accent text
  title,                         // Main big title (required)
  description = "",              // Optional subtitle/description
  align = "center",              // "center" | "left"
  className = "",                // Additional custom classes
  gradient = true,               // Whether to use gradient on title
  animate = true,                // Enable entrance animation
}) {
  const alignmentClasses = {
    center: "text-center mx-auto",
    left: "text-left",
  };

  const descAlignmentClasses = {
    center: "text-center mx-auto",
    left: "text-left",
  };

  return (
    <div className={`max-w-4xl ${alignmentClasses[align]} ${className}`}>
      {label && (
        <motion.p
          initial={animate ? { opacity: 0, y: 20 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-accent-500 font-semibold tracking-widest uppercase mb-4 text-sm md:text-base"
        >
          {label}
        </motion.p>
      )}

      <motion.h2
        initial={animate ? { opacity: 0, y: 25 } : false}
        whileInView={animate ? { opacity: 1, y: 0 } : false}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: label ? 0.1 : 0 }}
        className={`
          text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-tight
          ${gradient 
            ? "bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent" 
            : "text-text"}
        `}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={animate ? { opacity: 0, y: 25 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`
            mt-5 text-lg md:text-xl text-text-secondary leading-relaxed
            max-w-3xl ${descAlignmentClasses[align]}
          `}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}