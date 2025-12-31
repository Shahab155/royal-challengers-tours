"use client";

import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Ambient background wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Glass CTA Container */}
        <div className="
          glass-card-strong
          rounded-[40px]
          px-10 py-20
          md:px-20
          text-center
          shadow-[0_60px_160px_-60px_rgba(0,0,0,0.45)]
        ">
          {/* Heading */}
          <SectionHeading
            label="Ready to Travel"
            title="Craft Your Next Extraordinary Journey"
            description="Bespoke experiences, elite service, and unforgettable destinations — designed exclusively for you."
            align="center"
          />

          {/* CTA Buttons */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/packages"
              className="
                btn-outline
                rounded-full
                px-10 py-4
                text-base
                backdrop-blur-md
              "
            >
              Explore Packages
            </Link>

            <Link
              href="/booking"
              className="
                inline-flex items-center justify-center
                rounded-full px-10 py-4
                font-semibold text-white
                bg-[linear-gradient(90deg,var(--primary),var(--accent))]
                shadow-[0_25px_70px_-25px_rgba(8,34,192,0.6)]
                transition-all duration-500
                hover:shadow-[0_35px_90px_-25px_rgba(153,115,47,0.7)]
                hover:-translate-y-0.5
              "
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
