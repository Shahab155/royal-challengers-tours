import Image from "next/image";
import Link from "next/link";

/* ================= FETCH SINGLE TOUR ================= */
async function getTour(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/tours/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ================= FETCH RECENT TOURS ================= */
async function getRecentTours(currentSlug) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/tours`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();

    return Array.isArray(data)
      ? data
          .filter((t) => t.slug !== currentSlug)
          .sort(
            (a, b) =>
              new Date(b.created_at || b.id) -
              new Date(a.created_at || a.id)
          )
      : [];
  } catch {
    return [];
  }
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;

  const tour = await getTour(slug);
  const recentTours = await getRecentTours(slug);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[var(--color-text-secondary)]">
          Tour not found
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* ================= HERO ================= */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src={
            tour.image
              ? `/images/tours/${tour.image}`
              : "/images/placeholder.jpg"
          }
          alt={tour.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h1 className="text-4xl md:text-6xl text-white mb-4">
              {tour.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              {tour.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            <div className="glass-card p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl mb-6">
                Tour Overview
              </h2>

              <div className="prose prose-lg max-w-none text-[var(--color-text-secondary)]">
                {tour.description ? (
                  <div dangerouslySetInnerHTML={{ __html: tour.description }} />
                ) : (
                  <p>No detailed description available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="glass-card p-8 sticky top-8">
              <div className="space-y-6">
                <div className="flex justify-between border-b border-[var(--color-border)] pb-3">
                  <span className="text-[var(--color-text-secondary)]">
                    Duration
                  </span>
                  <span className="font-semibold">
                    {tour.duration_days} Day
                    {tour.duration_days > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[var(--color-border)] pb-3">
                  <span className="text-[var(--color-text-secondary)]">
                    Category
                  </span>
                  <span className="font-semibold">
                    {tour.category_name || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-lg font-medium">
                    Price
                  </span>
                  <div className="text-3xl font-bold text-accent-500 mt-2">
                    AED {tour.price?.toLocaleString() || "—"}
                  </div>
                </div>

                <Link
                  href={`/booking?type=tour&slug=${tour.slug}`}
                  className="btn-primary w-full mt-4"
                >
                  Book This Tour
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ================= RECENT TOURS ================= */}
      {recentTours.length > 0 && (
        <section className="py-20 bg-[var(--color-surface)]">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl md:text-4xl mb-12">
              Recommended for you.
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentTours.map((item) => (
                <div
                  key={item.slug}
                  className="glass-card flex flex-col overflow-hidden hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52">
                    <Image
                      src={
                        item.image
                          ? `/images/tours/${item.image}`
                          : "/images/placeholder.jpg"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                      {item.short_description}
                    </p>

                    <div className="flex justify-between items-center text-sm mb-6">
                      <span className="text-[var(--color-text-secondary)]">
                        {item.duration_days} Day
                        {item.duration_days > 1 ? "s" : ""}
                      </span>
                      <span className="font-bold text-accent-500">
                        AED {item.price?.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4">
                      <Link
                        href={`/tours/${item.slug}`}
                        className="btn-outline text-sm"
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/booking?type=tour&slug=${item.slug}`}
                        className="btn-primary text-sm"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
