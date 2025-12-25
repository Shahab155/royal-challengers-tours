// components/WhatsAppFloatingButton.jsx
'use client';

import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloatingButton() {
  // IMPORTANT: International format, NO +, NO spaces, NO 00
  // For Pakistan: 92 + 3022187590 → 923022187590
  const phoneNumber = '9203008938194'; // ← your corrected number

  const message = "Hi Royal Challengers Tours! I'm interested in booking a tour in Dubai...";

  // Most reliable link (opens WhatsApp or WhatsApp Business automatically)
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="
        fixed bottom-6 right-6 z-[100]
        flex items-center justify-center
        w-16 h-16
        bg-[#25D366] hover:bg-[#20b858]
        text-white
        rounded-full
        shadow-2xl shadow-black/20
        transition-all duration-300
        hover:scale-110 hover:shadow-green-500/50
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-green-500/40
      "
    >
      <FaWhatsapp className="w-9 h-9" />
    </Link>
  );
}