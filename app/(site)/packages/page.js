"use client";

import { useEffect, useState, useMemo } from "react";
import PackagesList from "@/components/packages/PackagesList";
import PackagesFilters from "@/components/packages/PackagesFilters";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  /* ================= FETCH PACKAGES ================= */
  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => {
        // Normalize DB → UI format
        const normalized = data.map((pkg) => ({
          slug: pkg.slug,
          title: pkg.title,
          description: pkg.short_description,
          duration: `${pkg.duration_days} Days`,
          price: `AED ${pkg.price}`,
          imageSrc: pkg.image
            ? `/images/packages/${pkg.image}`
            : "/images/placeholder.jpg",
          imageAlt: pkg.title,
          category: pkg.category_slug || "uncategorized",
        }));

        setPackages(normalized);
      });
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "all" || pkg.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [packages, searchQuery, activeCategory]);

  return (
    <>
      <PackagesFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <PackagesList filteredPackages={filteredPackages} />
    </>
  );
}
