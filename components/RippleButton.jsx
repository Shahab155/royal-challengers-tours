// components/RippleButton.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function RippleButton({ text, href, mobile = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }} // Subtle hover grow
      className={mobile ? "block w-full" : "inline-block"}
    >
      <Link
        href={href}
        className={`
          relative overflow-hidden inline-flex items-center justify-center
          bg-gradient-to-r 
          from-primary-600 via-primary-500 to-accent-500/70
          text-white font-bold px-4 md:px-6 lg:px-7 py-3 md:py-4 rounded-full
          shadow-lg hover:shadow-2xl transition-all duration-500
          group ${mobile ? "w-full text-center" : ""}
        `}
      >
        {/* Premium Shine Sweep Effect */}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 translate-x-[-300%] group-hover:translate-x-[300%] transition-transform duration-1200" />
        </span>

        {/* Button Text */}
        <span className="relative z-10">{text}</span>
      </Link>
    </motion.div>
  );
}