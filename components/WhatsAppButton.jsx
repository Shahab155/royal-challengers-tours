"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phone = "9203022187590"; // WITHOUT + sign
  const message = encodeURIComponent(
    `Hello, Royal Challengers. I’m interested in your Dubai travel services. Can you tell me more about your services.`
  );

  return (
    <>
      {/* Custom keyframes and animation (add this to your globals.css or inside a <style> tag if not using Tailwind's @layer) */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
          }
          70% {
            box-shadow: 0 0 0 30px rgba(37, 211, 102, 0);
            
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
      `}</style>

      <Link
        href={`https://wa.me/${phone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="
          fixed bottom-16 right-6 md:right-10 z-50
          w-14 h-14 lg:w-20 lg:h-20 rounded-full
          flex items-center justify-center
          bg-[#25D366]
          text-white text-3xl hover:scale-110
          shadow-lg shadow-black/20
          hover:scale-110 hover:shadow-xl
          transition-all duration-300
          animate-pulse-glow
        "
      >
        <FaWhatsapp className="lg:h-14 lg:w-14" />
      </Link>
    </>
  );
}