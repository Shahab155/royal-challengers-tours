"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

/* ------------------ ZOD SCHEMA ------------------ */
const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  subscribe: z.boolean().optional(),
});

/* ------------------ COMPONENT ------------------ */
export default function ContactSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });

    tl.from(".contact-desc", { opacity: 0, y: 30, duration: 0.8 })
      .from(".form-field", { opacity: 0, y: 30, stagger: 0.15, duration: 0.8 }, "-=0.6")
      .from(".map-card", { opacity: 0, x: 50, duration: 1, ease: "power3.out" }, "-=0.8");
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { subscribe: true },
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    reset();
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-bg">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* ================= LEFT: CONTACT FORM ================= */}
        <div className="flex items-center justify-center px-8 py-16 lg:py-8">
          <div className="w-full max-w-xl">
            <SectionHeading
              label="Contact Us"
              title="Get in Touch"
              description="Fill out the form and our travel specialists will reach out shortly."
              align="left"
              gradient={true}
              animate={true}
              className="contact-desc mb-10"
            />

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isSubmitSuccessful ? 1 : 0, y: isSubmitSuccessful ? 0 : -10 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              {isSubmitSuccessful && (
                <p className="text-green-600 dark:text-green-400 font-semibold text-lg bg-green-50 dark:bg-green-900/20 px-6 py-4 rounded-2xl border border-green-200 dark:border-green-800/50">
                  Thank you! We’ll be in touch soon.
                </p>
              )}
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-field">
                  <input
                    {...register("firstName")}
                    type="text"
                    placeholder="First Name"
                    className={`
                      w-full px-6 py-4 rounded-2xl 
                      bg-surface/70 dark:bg-surface/50 backdrop-blur-md 
                      border ${errors.firstName ? "border-red-500/50" : "border-border"}
                      focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20
                      text-text 
                      placeholder:text-gray-500 dark:placeholder:text-gray-400
                      transition-all duration-300
                    `}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <input
                    {...register("lastName")}
                    type="text"
                    placeholder="Last Name"
                    className={`
                      w-full px-6 py-4 rounded-2xl 
                      bg-surface/70 dark:bg-surface/50 backdrop-blur-md 
                      border ${errors.lastName ? "border-red-500/50" : "border-border"}
                      focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20
                      text-text 
                      placeholder:text-gray-500 dark:placeholder:text-gray-400
                      transition-all duration-300
                    `}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="form-field">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className={`
                    w-full px-6 py-4 rounded-2xl 
                    bg-surface/70 dark:bg-surface/50 backdrop-blur-md 
                    border ${errors.email ? "border-red-500/50" : "border-border"}
                    focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20
                    text-text 
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    transition-all duration-300
                  `}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="form-field">
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Ask us anything or share your travel dreams..."
                  className={`
                    w-full px-6 py-4 rounded-2xl 
                    bg-surface/70 dark:bg-surface/50 backdrop-blur-md 
                    border resize-none ${errors.message ? "border-red-500/50" : "border-border"}
                    focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20
                    text-text 
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    transition-all duration-300
                  `}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* =============== STATIC SUBSCRIBE CHECKBOX (NO ANIMATION) =============== */}
              <div className="form-field">
                <label className="flex items-center gap-4 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register("subscribe")}
                    className="sr-only peer"
                  />
                  
                 
                </label>
              </div>

              {/* Submit Button */}
              <div className="form-field submit-btn">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full py-5 rounded-full font-bold text-lg text-white bg-gradient-to-r from-primary-600 to-accent-500
                    shadow-2xl shadow-primary-900/30 dark:shadow-primary-900/50
                    hover:shadow-accent-500/40 hover:-translate-y-1 active:translate-y-0
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0
                    transition-all duration-500 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= RIGHT: MAP WITH INFO CARD ================= */}
        <div className="relative min-h-[500px] lg:min-h-screen overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out
              dark:invert-[0.92] dark:hue-rotate-[180deg] dark:grayscale-[0.25] dark:brightness-[0.95] dark:contrast-[0.92]"
          >
            <iframe
              title="Royal Travelers Location - Downtown Dubai"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.364915748165!2d55.272986315441!3d25.196053983795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f68296f1b3b3d%3A0x9f3b2f8f3e5d6e8f!2sDowntown%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/30" />

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="map-card absolute bottom-8 left-8 
              glass-card-strong backdrop-blur-xl 
              border border-white/20 dark:border-white/15
              bg-white/10 dark:bg-black/25
              p-8 rounded-3xl max-w-sm shadow-2xl shadow-black/20 dark:shadow-black/40
              text-white transition-all duration-300"
          >
            <h4 className="text-2xl font-bold mb-3">Royal Travelers</h4>
            <p className="text-white/85 dark:text-white/75 text-sm leading-relaxed mb-6">
              Downtown Dubai<br />
              Sheikh Mohammed bin Rashid Blvd<br />
              Near Burj Khalifa
            </p>

            <div className="space-y-3 text-sm">
              <p className="text-white/80 dark:text-white/70">+971 4 123 4567</p>
              <p className="text-white/80 dark:text-white/70">info@royaltravelers.com</p>
            </div>

            <Link
              href="https://www.google.com/maps/dir/?api=1&destination=Downtown+Dubai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-6 text-accent-400 dark:text-accent-300 font-semibold hover:text-white transition-colors duration-300 group"
            >
              Get Directions
              <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}