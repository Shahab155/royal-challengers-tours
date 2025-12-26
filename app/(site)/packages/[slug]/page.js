"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function PackageDetailsPage() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/packages/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setPkg)
      .catch(() => setError("Package not found"));
  }, [slug]);

  if (error) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold">{error}</h1>
        <Link href="/packages" className="btn-primary mt-6 inline-block">
          Back to Packages
        </Link>
      </div>
    );
  }

  if (!pkg) {
    return <p className="p-12 text-center">Loading package...</p>;
  }

  return (
    <section className="py-20 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Image */}
        <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src={
              pkg.image
                ? `/images/packages/${pkg.image}`
                : "/images/placeholder.jpg"
            }
            alt={pkg.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">
              {pkg.title}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              {pkg.short_description}
            </p>
          </div>

          <div className="card p-6 min-w-[260px] space-y-4">
            <div>
              <p className="text-sm text-text-secondary">Price</p>
              <p className="text-3xl font-bold text-accent-500">
                AED {pkg.price}
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">Duration</p>
              <p className="text-lg font-semibold">
                {pkg.duration_days} Days
              </p>
            </div>

            <Link
              href="/contact"
              className="btn-primary w-full text-center"
            >
              Enquire Now
            </Link>
          </div>
        </div>

        {/* Description */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Package Details
          </h2>
          <div className="prose max-w-none text-text-secondary">
            {pkg.description}
          </div>
        </div>
      </div>
    </section>
  );
}
