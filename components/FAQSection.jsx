"use client";

import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { FaPlus, FaMinus, FaRegCommentDots } from "react-icons/fa";
import Link from "next/link";

const faqs = [
  {
    question: "The expense windows adapted sir. Wrong widen drawn.",
    answer:
      "Offending belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her.",
  },
  {
    question: "Six curiosity day assurance bed necessary?",
    answer:
      "Curiosity continual belonging offending so explained it exquisite. Do remember to follow up with clarity.",
  },
  {
    question: "Produce say the ten moments parties?",
    answer:
      "Ten moments produce parties in elegance. We ensure every experience is thoughtfully managed.",
  },
  {
    question: "Simple innate summer fat appear basket his desire joy?",
    answer:
      "Luxury is about balance. We curate journeys that align with your personal desires.",
  },
  {
    question: "Outward clothes promise at gravity do excited?",
    answer:
      "Our premium partners ensure consistent quality and reliable service across all destinations.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--color-surface)] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 items-start">
        {/* LEFT: FAQ LIST */}
        <div className="lg:col-span-2">
          <SectionHeading
            label="FAQ"
            title="Frequently Asked Questions"
            align="left"
          />

          <div className="mt-10 space-y-5">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl border border-white/10"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="text-lg font-semibold">
                      {item.question}
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent-500/40 text-accent-500">
                      {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
                    </span>
                  </button>

                  {/* Answer */}
                  <div
                    className={`
                      px-6 overflow-hidden transition-all duration-500 ease-in-out
                      ${isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}
                    `}
                  >
                    <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: CTA CARD */}
        <div className="glass-card-strong rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-xl glass-card flex items-center justify-center border border-accent-500/40">
              <FaRegCommentDots size={22} className="text-accent-500" />
            </div>
            <h3 className="text-2xl font-semibold">
              Do you have more questions?
            </h3>
          </div>

          <p className="text-[color:var(--color-text-secondary)] leading-relaxed mb-8">
            End-to-end travel planning and luxury experiences in one solution.
            Our experts are always ready to assist you.
          </p>
          <Link href="/contact">
          <button className="btn-outline w-full py-4 rounded-xl text-base">
            Contact Us Directly
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
