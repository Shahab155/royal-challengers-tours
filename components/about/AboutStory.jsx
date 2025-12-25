export default function AboutStory() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Our Story
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 lg:space-y-8">
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed">
              Royal Challengers Travelers was born from a deep passion for Dubai — a city where futuristic skylines meet timeless desert traditions. 
              Founded in 2018 by a small team of local experts and international travel enthusiasts, we set out to create extraordinary experiences 
              that go beyond the ordinary.
            </p>

            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed">
              Today, we are proud to be a trusted name in luxury tourism, serving discerning travelers from across the globe. 
              Every journey we craft is personal, precise, and filled with moments that stay with you forever.
            </p>
          </div>

          <div className="card overflow-hidden">
            <img
              src="https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0a/7b/86/d6.jpg"
              alt="Luxury desert camp under starry night sky in Dubai"
              className="w-full h-80 lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}