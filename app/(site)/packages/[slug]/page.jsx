"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function PackageDetailPage() {
  const { slug } = useParams();

  const [pkg, setPkg] = useState(null);
  const [recentPackages, setRecentPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ================= FETCH MAIN PACKAGE ================= */
  useEffect(() => {
    if (!slug) return;

    async function fetchPackage() {
      try {
        const res = await fetch(`/api/packages/${slug}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setPkg(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPackage();
  }, [slug]);

  /* ================= FETCH RECENT PACKAGES ================= */
  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/packages", { cache: "no-store" });
        const data = await res.json();

        if (Array.isArray(data)) {
          const sorted = [...data]
            .filter((p) => p.slug !== slug)
            .sort((a, b) => {
              // Prefer created_at, fallback to id
              if (a.created_at && b.created_at) {
                return new Date(b.created_at) - new Date(a.created_at);
              }
              return (b.id || 0) - (a.id || 0);
            })
            .slice(0, 4);

          setRecentPackages(sorted);
        }
      } catch {
        // silently fail
      }
    }

    fetchRecent();
  }, [slug]);

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading package details...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6 bg-gray-50">
        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Package Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The package you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/packages"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to All Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src={
            pkg.image
              ? `/images/packages/${pkg.image}`
              : "/images/placeholder.jpg"
          }
          alt={pkg.title || "Package image"}
          fill
          priority
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              {pkg.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              {pkg.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Package Overview
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {pkg.description ? (
                  <div dangerouslySetInnerHTML={{ __html: pkg.description }} />
                ) : (
                  <p>No detailed description available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-8">
              <div className="space-y-6">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">
                    {pkg.duration_days || "?"} Day
                    {pkg.duration_days !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex justify-between items-end pt-4">
                  <span className="text-lg font-medium">Price</span>
                  <span className="text-3xl font-bold text-amber-600">
                    AED {pkg.price?.toLocaleString() || "—"}
                  </span>
                </div>

                <Link
                  href={`/booking?type=package&slug=${pkg.slug}`}
                  className="block w-full bg-blue-600 text-white py-4 rounded-xl font-medium text-center hover:bg-blue-700 transition"
                >
                  Book This Package →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RECENT PACKAGES ================= */}
{recentPackages.length > 0 && (
  <section className="py-20 bg-[var(--color-bg)]">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">
       Recommend packages for you. 
            </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recentPackages.map((item) => (
          <div
            key={item.slug}
            className="
              bg-white dark:bg-[var(--color-surface)]
              rounded-2xl
              border border-[var(--color-border)]
              shadow-sm hover:shadow-lg
              transition-all duration-300
              flex flex-col
            "
          >
            {/* Image */}
            <div className="relative h-48 rounded-t-2xl overflow-hidden">
              <Image
                src={
                  item.image
                    ? `/images/packages/${item.image}`
                    : "/images/placeholder.jpg"
                }
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-2 text-[var(--color-text)]">
                {item.title}
              </h3>

              <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                {item.short_description || "No description available."}
              </p>

              {/* Meta */}
              <div className="flex justify-between items-center text-sm mb-6">
                <span className="text-[var(--color-text-secondary)]">
                  {item.duration_days
                    ? `${item.duration_days} Day${item.duration_days > 1 ? "s" : ""}`
                    : "Flexible"}
                </span>

                <span className="text-lg font-bold text-accent-500">
                  AED {item.price?.toLocaleString() || "—"}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-auto grid grid-cols-2 gap-4">
                <Link
                  href={`/packages/${item.slug}`}
                  className=" btn-outline
                    text-center py-3 rounded-lg
                    border border-[var(--color-border)]
                    text-[var(--color-text)]
                    font-medium
                    hover:bg-[var(--color-surface)]
                    transition
                  "
                >
                  View Details
                </Link>

                <Link
                  href={`/booking?type=package&slug=${item.slug}`}
                  className="
                    text-center py-3 rounded-lg
                    bg-primary-500
                    text-white
                    font-medium
                    hover:bg-primary-600
                    transition
                  "
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
