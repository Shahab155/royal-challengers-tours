import Link from "next/link";

// components/contact/ContactInfo.jsx
export default function ContactInfo() {
  const contacts = [
    {
      icon: '📍',
      title: 'Our Office',
      content: 'Downtown Dubai, Sheikh Mohammed Bin Rashid Blvd, Dubai, UAE',
      link: 'https://maps.google.com/?q=Downtown+Dubai',
    },
    {
      icon: '📞',
      title: 'Call Us',
      content: '+971 50 123 4567\n+971 4 123 4567',
      link: 'tel:+971501234567',
    },
    {
      icon: '✉️',
      title: 'Email Us',
      content: 'info@royalchallengers.com',
      link: 'mailto:info@royalchallengers.com',
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      content: 'Message us instantly',
      link: 'https://wa.me/971501234567?text=Hi%20Royal%20Challengers%2C%20I%27m%20interested%20in...',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-center mb-12 lg:mb-16">
          Ways to Reach Us
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {contacts.map((item, i) => (
            <Link
              key={i}
              href={item.link}
              target={item.link.startsWith('http') ? '_blank' : undefined}
              rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group bg-primary-500 dark:bg-white text-white backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:border-accent-500/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl mb-6 text-accent-500 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl text-primary-500 font-semibold mb-3">{item.title}</h3>
              <p className="text-[var(--color-surface)] whitespace-pre-line">
                {item.content}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}