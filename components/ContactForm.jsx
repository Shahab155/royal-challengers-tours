"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ================= CONTACT ITEM ================= */

function ContactItem({ icon, title, content, href }) {
  const itemRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ paused: true });

    tl.to(itemRef.current, {
      y: -10,
      duration: 0.4,
      ease: "power3.out",
    }).to(
      itemRef.current.querySelector(".icon-circle"),
      {
        scale: 1.2,
        rotate: 8,
        duration: 0.5,
        ease: "power3.out",
      },
      "<"
    );

    itemRef.current.addEventListener("mouseenter", () => tl.play());
    itemRef.current.addEventListener("mouseleave", () => tl.reverse());
  }, { scope: itemRef });

  return (
    <Link
      ref={itemRef}
      href={href}
      className="group relative flex items-start gap-6 p-8 rounded-3xl card"
      target={href.startsWith("http") ? "_blank" : undefined}
    >
      <div className="icon-circle w-20 h-20 rounded-full flex items-center justify-center text-3xl border-2 border-[var(--color-accent-500)]">
        {icon}
      </div>

      <div>
        <h4 className="text-2xl font-semibold mb-3">{title}</h4>
        <p className="text-text-secondary whitespace-pre-line">
          {content}
        </p>
      </div>
    </Link>
  );
}

/* ================= CONTACT SECTION ================= */

export default function ContactSection() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  const [formFocused, setFormFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "",
    message: "",
  });

  /* ================= GSAP ================= */

  useGSAP(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
      }
    );

    gsap.fromTo(
      ".contact-item",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        scrollTrigger: { trigger: infoRef.current, start: "top 80%" },
      }
    );
  }, { scope: containerRef });

  /* ================= FORM SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/admin/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      package: "",
      message: "",
    });
  };

  const contactItems = [
    {
      icon: "📍",
      title: "Our Office",
      content:
        "Office 305, Downtown Dubai\nSheikh Mohammed Bin Rashid Blvd, Dubai",
      href: "https://maps.google.com",
    },
    {
      icon: "📞",
      title: "Call Us",
      content: "+971 50 123 4567",
      href: "tel:+971501234567",
    },
    {
      icon: "✉️",
      title: "Email",
      content: "info@royalchallengerstours.com",
      href: "mailto:info@royalchallengerstours.com",
    },
  ];

  return (
    <section ref={containerRef} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Begin Your Royal Dubai Journey
          </h2>
          <p className="text-text-secondary text-xl">
            Our specialists are ready to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FORM */}
          <div ref={formRef} className="card p-10">
            <h3 className="text-3xl font-semibold mb-8">Get In Touch</h3>

            {success && (
              <p className="text-green-600 mb-4">
                Thank you! We will contact you soon.
              </p>
            )}

            {error && (
              <p className="text-red-600 mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onFocus={() => setFormFocused(true)}
                onBlur={() => setFormFocused(false)}
                className="w-full border rounded-xl px-5 py-4"
              />

              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded-xl px-5 py-4"
              />

              <input
                type="text"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border rounded-xl px-5 py-4"
              />

              <input
                type="text"
                placeholder="Package / Tour (optional)"
                value={formData.package}
                onChange={(e) =>
                  setFormData({ ...formData, package: e.target.value })
                }
                className="w-full border rounded-xl px-5 py-4"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full border rounded-xl px-5 py-4"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div ref={infoRef} className="space-y-6">
            {contactItems.map((item, i) => (
              <ContactItem key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
