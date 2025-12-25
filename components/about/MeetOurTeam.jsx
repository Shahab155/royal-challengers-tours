'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function MeetOurTeam() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Staggered entrance for each team member
    gsap.fromTo(
      containerRef.current.querySelectorAll('.team-member'),
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.25,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Subtle image scale + overlay on scroll/hover
    gsap.utils.toArray('.team-avatar').forEach((avatar) => {
      gsap.fromTo(
        avatar,
        { scale: 1.03 },
        {
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: avatar,
            start: 'top 90%',
          },
        }
      );
    });
  }, { scope: containerRef });

  const teamMembers = [
    {
      name: "Ahmed Al Maktoum",
      role: "Founder & Lead Curator",
      bio: "15+ years crafting unforgettable Dubai experiences, blending local heritage with world-class luxury.",
      image: "https://images.unsplash.com/photo-1556155099-490a1ba16284?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Layla Hassan",
      role: "Head of Luxury Operations",
      bio: "Detail-obsessed perfectionist ensuring every private yacht, desert camp, and VIP transfer is flawless.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "James Carter",
      role: "International Client Director",
      bio: "Global traveler turned Dubai expert, helping guests from 40+ countries discover the city's true magic.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[var(--color-bg)]">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-5">
            Meet the Hearts Behind Royal Challengers
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Passionate experts who live and breathe Dubai — dedicated to turning your dreams into extraordinary reality
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="team-member group flex flex-col items-center text-center"
            >
              {/* Avatar with glow + gradient overlay */}
              <div className="relative mb-8">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-transparent group-hover:border-accent-500/30 transition-all duration-500 shadow-xl group-hover:shadow-2xl">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-[2deg]"
                  />
                </div>

                {/* Subtle outer glow on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-r from-accent-500/20 to-primary-500/20 blur-xl pointer-events-none"></div>
              </div>

              {/* Content */}
              <h3 className="text-2xl md:text-3xl font-semibold font-heading mb-2 text-accent-500">
                {member.name}
              </h3>

              <p className="text-lg font-medium text-primary-500 mb-4 tracking-wide">
                {member.role}
              </p>

              <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-xs">
                {member.bio}
              </p>
            </div>
          ))}
        </div>

        {/* Closing inspirational line */}
        <div className="mt-16 lg:mt-20 text-center">
          <p className="text-xl italic text-[var(--color-text-secondary)] max-w-4xl mx-auto">
            "We don't just plan trips. We create stories you'll tell for generations."
          </p>
        </div>
      </div>
    </section>
  );
}