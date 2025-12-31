'use client';

import { useEffect, useMemo, useState } from "react";
import PackagesFilters from "@/components/packages/PackagesFilters";
import PackagesList from "@/components/packages/PackagesList";
import PackagesHero from "@/components/packages/PackagesHero";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  /* ================= FETCH PACKAGES ================= */
  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => {
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

        // derive categories
        const uniqueCategories = [
          ...new Set(
            data
              .map((p) => p.category_slug)
              .filter(Boolean)
          ),
        ];

        setCategories(uniqueCategories);
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
    <PackagesHero/>
      <PackagesFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <PackagesList
        filteredPackages={filteredPackages}
        hasCategories={categories.length > 0}
      />
    </>
  );
}
