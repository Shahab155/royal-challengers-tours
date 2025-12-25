'use client';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
gsap.registerPlugin(ScrollTrigger);

function ContactItem({ icon, title, content, href }) {
  const itemRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ paused: true });
    tl.to(itemRef.current, { y: -10, duration: 0.4, ease: 'power3.out' })
      .to(itemRef.current.querySelector('.icon-circle'), {
        scale: 1.2,
        rotate: 8,
        duration: 0.5,
        ease: 'power3.out',
      }, '<');

    itemRef.current.addEventListener('mouseenter', () => tl.play());
    itemRef.current.addEventListener('mouseleave', () => tl.reverse());
  }, { scope: itemRef });

  return (
    <Link
      ref={itemRef}
      href={href}
      className="group relative flex items-start gap-6 p-8 rounded-3xl card hover:shadow-[0_20px_50px_-15px] hover:shadow-[var(--color-glow)] "
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      <div className="icon-circle relative flex-shrink-0 w-20 h-20 rounded-full  flex items-center justify-center text-3xl border-2 border-[var(--color-accent-500)] shadow-inner  duration-500">
        {icon}
      </div>

      <div className="flex-1">
        <h4 className="text-2xl font-semibold font-heading text-[var(--color-text)] mb-3 tracking-tight">
          {title}
        </h4>
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors whitespace-pre-line">
          {content}
        </p>
      </div>
    </Link>
  );
}

export default function ContactSection() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  const [formFocused, setFormFocused] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: titleRef.current, start: 'top 80%' } }
    );

    gsap.fromTo(
      '.contact-item',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: infoRef.current, start: 'top 80%' } }
    );

    gsap.fromTo(
      formRef.current.querySelectorAll('.form-group'),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: formRef.current, start: 'top 80%' } }
    );
  }, { scope: containerRef });

  const contactItems = [
    {
      icon: '📍',
      title: 'Our Office',
      content: 'Office 305, Downtown Dubai\nSheikh Mohammed Bin Rashid Blvd, Dubai, UAE',
      href: 'https://maps.google.com/?q=Downtown+Dubai+Sheikh+Mohammed+Bin+Rashid+Boulevard',
    },
    {
      icon: '📞',
      title: 'Speak With Us',
      content: '+971 50 123 4567\n+971 4 123 4567',
      href: 'tel:+971501234567',
    },
    {
      icon: '✉️',
      title: 'Write To Us',
      content: 'info@royalchallengerstours.com',
      href: 'mailto:info@royalchallengerstours.com',
    },
  ];

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-24 lg:py-32 bg-[var(--color-bg)] overflow-hidden"
    >
      {/* Subtle luxury background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[var(--color-primary-500)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] bg-[var(--color-secondary-500)]/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className="text-center mb-16 lg:mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-[var(--color-text)] tracking-tight mb-6">
            Begin Your Royal Dubai Journey
          </h2>
          <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-4xl mx-auto leading-relaxed">
            Our specialists are ready to curate your private escape — from soaring Burj vistas to serene desert nights and timeless luxury.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Premium Contact Form */}
          <div
            ref={formRef}
            className={`card relative p-10 lg:p-14 overflow-hidden ${formFocused ? 'shadow-[0_0_80px_-20px] shadow-[var(--color-glow)]' : ''}`}
          >
            <h3 className="text-4xl font-semibold font-heading text-[var(--color-text)] mb-12">
              Get In Touch
            </h3>

            <form className="space-y-10">
              {[
                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'hello@example.com' },
              ].map((field) => (
                <div key={field.id} className="form-group relative">
                  <input
                    type={field.type}
                    id={field.id}
                    className="peer w-full px-6 py-6 rounded-2xl bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-secondary-500)] focus:ring-2 focus:ring-[var(--color-secondary-500)]/30 outline-none transition-all duration-300"
                    placeholder={field.placeholder}
                    required
                    onFocus={() => setFormFocused(true)}
                    onBlur={() => setFormFocused(false)}
                  />
                  <label
                    htmlFor={field.id}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[var(--color-secondary-500)] peer-focus:font-medium peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base"
                  >
                    {field.label}
                  </label>
                </div>
              ))}

              <div className="form-group relative">
                <textarea
                  id="message"
                  rows={5}
                  className="peer w-full px-6 py-6 rounded-2xl bg-transparent border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-secondary-500)] focus:ring-2 focus:ring-[var(--color-secondary-500)]/30 outline-none transition-all duration-300 resize-none"
                  placeholder="Tell us about your dream Dubai experience..."
                  required
                  onFocus={() => setFormFocused(true)}
                  onBlur={() => setFormFocused(false)}
                />
                <label
                  htmlFor="message"
                  className="absolute left-6 top-6 text-[var(--color-text-secondary)] pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[var(--color-secondary-500)] peer-focus:font-medium peer-placeholder-shown:top-6 peer-placeholder-shown:text-base"
                >
                  Your Message
                </label>
              </div>

              <button type="submit" className="btn-primary bg-primary-500 hover:bg-primary-600 w-full text-lg">
                Send Your Inquiry
              </button>
            </form>
          </div>

          {/* Contact Cards */}
          <div ref={infoRef} className="space-y-8 lg:space-y-10 lg:mt-6">
            {contactItems.map((item, i) => (
              <ContactItem key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}