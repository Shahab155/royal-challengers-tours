// app/packages/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HiCalendar, HiClock, HiUserGroup, HiCurrencyDollar, HiCheckCircle } from 'react-icons/hi';

// Dummy data – in real project use getStaticProps/getServerSideProps or CMS/API
const getPackageBySlug = (slug) => {
  const packages = {
    'evening-desert-safari': {
      title: 'Evening Desert Safari',
      slug: 'evening-desert-safari',
      heroImage: 'https://www.dsktravelsdubai.com/wp-content/uploads/2024/12/desert-safari.jpg',
      gallery: [
        'https://media.tacdn.com/media/attractions-splice-spp-674x446/09/27/d7/05.jpg',
        'https://dubaidesertsafarie.com/wp-content/uploads/2024/11/20200326-tent.webp',
        'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0a/7b/86/d6.jpg',
      ],
      description:
        'Experience the thrill of dune bashing, camel rides, sandboarding, and a magical BBQ dinner under the stars with live entertainment.',
      duration: '6–7 hours',
      groupSize: 'Small groups (max 6–8)',
      price: 'AED 250 per person',
      highlights: [
        'Professional 4x4 dune bashing',
        'Camel ride at sunset',
        'Sandboarding & henna painting',
        'Delicious BBQ dinner & shisha',
        'Traditional Tanoura & Belly dance show',
      ],
      inclusions: [
        'Hotel pickup & drop-off',
        'Professional guide & driver',
        'All activities mentioned',
        'Unlimited water/soft drinks',
        'Dinner with veg/non-veg options',
      ],
      exclusions: ['Alcoholic beverages', 'Personal expenses', 'Tips (optional)'],
      itinerary: [
        { time: '15:30 – 16:00', desc: 'Hotel pickup in luxury 4x4' },
        { time: '16:30 – 18:30', desc: 'Dune bashing & sunset photo stop' },
        { time: '18:45 – 19:30', desc: 'Camel ride & sandboarding' },
        { time: '19:30 – 22:30', desc: 'BBQ dinner, live shows & entertainment' },
        { time: '22:30 – 23:00', desc: 'Drop-off back to hotel' },
      ],
      cancellation: 'Free cancellation up to 24 hours before the tour. No refund within 24 hours.',
    },
    // Add more packages here...
  };

  return packages[slug] || null;
};

export default function PackageDetail({ params }) {
  const pkg = getPackageBySlug(params.slug);

  if (!pkg) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero */}
      <section className="relative h-[70vh] lg:h-[85vh]">
        <img
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          className="object-cover brightness-[0.65]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-lg">
              <div className="flex items-center gap-2">
                <HiClock className="w-6 h-6 text-accent-500" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiUserGroup className="w-6 h-6 text-accent-500" />
                <span>{pkg.groupSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCurrencyDollar className="w-6 h-6 text-accent-500" />
                <span className="text-2xl font-bold">{pkg.price}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="py-12 lg:py-16 bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {pkg.highlights.map((highlight, i) => (
              <div key={i} className="flex items-start gap-4">
                <HiCheckCircle className="w-8 h-8 text-accent-500 flex-shrink-0 mt-1" />
                <p className="text-lg">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery + Itinerary + Inclusions */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Gallery */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-8">Gallery</h2>
            <div className="grid grid-cols-2 gap-4">
              {pkg.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] relative rounded-xl overflow-hidden">
                  <img src={img} alt="" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-12">
            {/* Itinerary */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-6">Itinerary</h2>
              <div className="space-y-6">
                {pkg.itinerary.map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-xl flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{step.time}</p>
                      <p className="text-[var(--color-text-secondary)]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-green-500">What's Included</h3>
                <ul className="space-y-3">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-red-400">Exclusions</h3>
                <ul className="space-y-3">
                  {pkg.exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-0.5">×</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold font-heading mb-6">
            Ready for Your Desert Adventure?
          </h2>
          <p className="text-xl lg:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            Secure your spot now — limited availability!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/booking"
              className="btn-primary px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-accent-500/40 transform hover:-translate-y-2 transition-all"
            >
              Book Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-12 py-6 text-xl font-semibold border-2 border-white/60 hover:border-white rounded-full transition-all hover:bg-white/10"
            >
              Ask a Question →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}