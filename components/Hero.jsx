"use client";

export default function Hero() {
  const scrollToGallery = () => {
    const gallerySection = document.getElementById("gallery");
    if (gallerySection) {
      gallerySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative h-screen min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Desktop Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        
      >
        <source src="/hero-desktop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Mobile Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover md:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      
      >
        <source src="/hero-mobile.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback Image */}
     

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Scroll Down Button with Infinite Pulsing Glow */}
     
    </section>
  );
}