'use client';

import React, { useState } from 'react';



export default function VerticalGradientButton({
  children,
  onClick,
  size = 'medium',
  className = '',
}) {
  const [ripple, setRipple] = useState([]);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipple((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipple((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);

    if (onClick) onClick();
  };

  const sizeStyles = {
    small: 'px-8 py-3 text-base',
    medium: 'px-12 py-5 text-xl',
    large: 'px-20 py-7 text-2xl',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative overflow-hidden
        font-bold text-white
        bg-gradient-to-b from-[#0822C0] via-[#0822C0] to-[#99732F]
        bg-[length:100%_200%] bg-top
        rounded-full
        shadow-2xl
        transition-all duration-400
        hover:shadow-[#0822C0]/50 hover:shadow-2xl hover:-translate-y-2
        focus:outline-none focus:ring-4 focus:ring-[#0822C0]/50
        ${sizeStyles[size]}
        ${className}
      `}
      style={{
        backgroundImage: 'linear-gradient(to bottom, #0822C0 0%, #0822C0 70%, #99732F 100%)',
      }}
    >
      {/* Ripple Elements */}
      {ripple.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute bg-white/40 rounded-full animate-ping"
          style={{
            left: x,
            top: y,
            width: '300px',
            height: '300px',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.8s ease-out forwards',
          }}
        />
      ))}

      {/* Button Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Add the keyframe animation in your global CSS (e.g., globals.css or tailwind.config if using @tailwindcss/animate)